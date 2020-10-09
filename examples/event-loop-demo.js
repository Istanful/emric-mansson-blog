const UNIT_SIZE = 65;
const BLOCK_WIDTH = 6;
const BLOCK_HEIGHT = 1.6;
const DEFAULT_FRAME_DURATION = 1000;
const GUTTER = 15;
const BORDER_RADIUS = 10;
const PADDING = 15;
const EASING = "ease-out";
const ROW_COUNT = 6;
const CODE_BG_COLOR = "#31373e";
const BACKGROUND_COLOR = "#282c34";
const ROBOT_COLOR = "#98c379";
const THREAD_NAMES = ["mainThread", "taskQueue", "renderSteps", "microTasks"];
const COL_COUNT = THREAD_NAMES.length;
const CURRENT_EXAMPLE = parseInt(
  new URLSearchParams(window.location.search).get("exampleIndex") || "0"
);

const scene = document.createElement("div");
scene.id = "scene";
scene.style.left = `${
  window.innerWidth / 2 - (COL_COUNT * UNIT_SIZE * BLOCK_WIDTH) / 2
}px`;
scene.style.position = "absolute";

document.body.appendChild(scene);
document.body.style.background = BACKGROUND_COLOR;

function paintItem() {
  return {
    properties: {
      innerText: "paint",
      background: "#c679dc",
      color: BACKGROUND_COLOR,
    },
  };
}

class Stack {
  constructor(items, id = "mainThread", bgColor = CODE_BG_COLOR) {
    this.id = id;
    this.bgColor = bgColor;
    this.items = items.map((item, i) => {
      return {
        ...item,
        id: this.nextItemId(),
        properties: {
          left: this.left,
          top: ROW_COUNT - i,
          transform: "scale(0)",
          background: bgColor,
          ...item.properties,
        },
      };
    });
  }

  get left() {
    return THREAD_NAMES.indexOf(this.id);
  }

  get initialFrameItems() {
    const itemsProperties = this.items.reduce((memo, item) => {
      return {
        ...memo,
        [item.id]: { ...item.properties },
      };
    }, {});
    return {
      ...itemsProperties,
      [`${this.id}Label`]: {
        innerText: this.id,
        top: 0,
        left: this.left,
        fontSize: "1.5rem",
        textAlign: "center",
      },
    };
  }

  fillFrames(items = this.items) {
    return items.reduce(
      (memo, item) => {
        return [
          ...memo,
          {
            duration: 200,
            items: {
              [item.id]: { ...item.properties, transform: "scale(1)" },
            },
          },
        ];
      },
      [
        items.reduce(
          (memo, item) => ({
            ...memo,
            duration: 50,
            items: {
              ...memo.items,
              [item.id]: { ...item.properties, transform: "scale(0)" },
            },
          }),
          { items: {} }
        ),
      ].filter((frame) => Object.keys(frame.items).length > 0)
    );
  }

  shiftFrames(eventLoop) {
    return this.consumeFrames(eventLoop, 1);
  }

  nextItemId() {
    this.currentItemId = this.currentItemId || 0;
    this.currentItemId++;
    return `${this.id}${this.currentItemId}`;
  }

  appendItem(item) {
    const newItem = {
      ...item,
      id: this.nextItemId(),
      properties: {
        left: this.left,
        top: ROW_COUNT - this.items.length,
        transform: "scale(0)",
        background: this.bgColor,
        ...item.properties,
      },
    };
    this.items = [...this.items, newItem];
    return newItem;
  }

  appendFrames(items) {
    const newItems = items.map((items) => this.appendItem(items));
    return this.fillFrames(newItems);
  }

  get hasTasks() {
    return this.items.length > 0;
  }

  consumeOneFrames(eventLoop) {
    const consumedItem = this.items[0];

    if (!consumedItem) {
      return [];
    }

    let newFrames = [
      {
        items: {
          ...this.items.reduce((memo, item, i) => {
            let props = {
              ...memo,
              [item.id]: {
                top: item.properties.top + 1,
              },
            };

            this.items[i].properties.top = item.properties.top + 1;

            if (item.id === consumedItem.id) {
              props[item.id].transform = "scale(0)";
            }

            return props;
          }, {}),
        },
      },
    ];

    this.items.splice(0, 1);

    if (consumedItem.enqueues) {
      const [threadName, appendedFrames] = Object.entries(
        consumedItem.enqueues
      )[0];
      newFrames = [
        ...newFrames,
        ...eventLoop.threads[threadName].appendFrames(appendedFrames),
      ];
    }

    return newFrames;
  }

  consumeFrames(eventLoop, count = this.items.length) {
    return Array(count)
      .fill(null)
      .reduce((frames) => {
        return [...frames, ...this.consumeOneFrames(eventLoop)];
      }, []);
  }
}

class RenderStack extends Stack {}

class Robot {
  constructor(stacks) {
    this.stacks = stacks;
    this.props = {
      left: 0,
      top: ROW_COUNT + 1,
      background: ROBOT_COLOR,
      zIndex: 1000,
      transitionTimingFunction: "ease-in-out",
    };
  }

  get initialFrameItem() {
    return this.props;
  }

  moveToStackFrame(name) {
    const stack = this.stacks[name];

    return {
      items: {
        robot: {
          transitionTimingFunction: "ease-in-out",
          left: stack.left,
        },
      },
    };
  }

  get stacksArray() {
    return Object.values(this.stacks);
  }

  get highestStack() {
    return this.stacksArray.sort((a, b) => b.items.length - a.items.length)[0];
  }

  get loopAroundFrames() {
    const durationPerUnit = DEFAULT_FRAME_DURATION / 3;

    return [
      {
        duration: durationPerUnit,
        items: {
          robot: {
            top: ROW_COUNT + 2,
            transitionTimingFunction: "ease-in",
          },
        },
      },
      {
        duration: durationPerUnit * this.stacksArray.length,
        items: {
          robot: {
            transitionTimingFunction: "ease-in-out",
            left: 0,
          },
        },
      },
      {
        items: {
          duration: durationPerUnit,
          robot: {
            left: 0,
            top: ROW_COUNT + 1,
            transitionTimingFunction: "ease-out",
          },
        },
      },
    ];
  }
}

class EventLoop {
  constructor(threads) {
    this.threads = {
      mainThread: new Stack([], "mainThread"),
      taskQueue: new Stack([], "taskQueue"),
      renderSteps: new RenderStack([], "renderSteps"),
      microTasks: new Stack([], "microTasks"),
      ...threads,
    };
    this.robot = new Robot(this.threads);
  }

  get mainThread() {
    return this.threads.mainThread;
  }

  get taskQueue() {
    return this.threads.taskQueue;
  }

  get renderSteps() {
    return this.threads.renderSteps;
  }

  get microTasks() {
    return this.threads.microTasks;
  }

  get frames() {
    return [
      {
        duration: 500,
        items: {
          ...this.mainThread.initialFrameItems,
          ...this.taskQueue.initialFrameItems,
          ...this.renderSteps.initialFrameItems,
          ...this.microTasks.initialFrameItems,
          robot: this.robot.initialFrameItem,
        },
      },
      ...this.mainThread.fillFrames(),
      ...this.taskQueue.fillFrames(),
      ...this.renderSteps.fillFrames(),
      ...this.microTasks.fillFrames(),
      ...this.consumeFrames,
    ];
  }

  get consumeFrames() {
    let frames = [];
    const hasTasks = () => {
      return Object.entries(this.threads).find(([name, thread]) => {
        return thread.hasTasks;
      });
    };

    while (hasTasks()) {
      frames = [
        ...frames,
        ...this.consumeMainThreadFrames,
        this.robot.moveToStackFrame("taskQueue"),
        ...this.shiftTaskQueueFrames,
        this.robot.moveToStackFrame("renderSteps"),
        ...this.consumeRenderStepsFrames,
        this.robot.moveToStackFrame("microTasks"),
        ...this.consumeMicroTasksFrames,
        ...this.robot.loopAroundFrames,
      ];
    }

    return frames;
  }

  get consumeMicroTasksFrames() {
    return this.microTasks.consumeFrames(this);
  }

  get consumeRenderStepsFrames() {
    return this.renderSteps.consumeFrames(this);
  }

  get consumeMainThreadFrames() {
    const frames = this.mainThread.consumeFrames(this);

    if (this.mainThread.hasTasks) {
      return [...frames, ...this.consumeMainThreadFrames];
    }

    return frames;
  }

  get shiftTaskQueueFrames() {
    return this.taskQueue.shiftFrames(this);
  }
}

const EXAMPLES = [
  new EventLoop({
    mainThread: new Stack([
      { properties: { innerText: 'console.log("Bring water to boil.");' } },
      {
        properties: {
          innerText: 'console.log("Put in noodles and spice.");',
        },
      },
      { properties: { innerText: 'console.log("Wait for 5 minutes.");' } },
      { properties: { innerText: 'console.log("Serve noodles!");' } },
    ]),
  }),
  new EventLoop({
    mainThread: new Stack([
      { properties: { innerText: 'console.log("Bring water to boil.");' } },
      {
        properties: { innerText: 'console.log("Put in noodles and spice.");' },
      },
      {
        properties: {
          innerText:
            "setTimeout(() => {\n" +
            '\t\tconsole.log("Serve noodles!");\n' +
            "}, 5 * 60 * 1000);",
        },
        enqueues: {
          taskQueue: [
            { properties: { innerText: 'console.log("Serve noodles!");' } },
          ],
        },
      },
      {
        properties: {
          innerText: 'console.log("Browse the interwebs.");',
        },
      },
    ]),
  }),
  new EventLoop({
    taskQueue: new Stack(
      [
        {
          properties: { innerText: "moveBox();" },
          enqueues: {
            taskQueue: [
              {
                properties: { innerText: "moveBox();" },
                enqueues: {
                  renderSteps: [paintItem()],
                },
              },
            ],
          },
        },
      ],
      "taskQueue"
    ),
  }),
  new EventLoop({
    renderSteps: new Stack(
      [
        {
          properties: { innerText: "moveBox();" },
          enqueues: {
            renderSteps: [
              {
                properties: { innerText: "moveBox();" },
                enqueues: {
                  renderSteps: [
                    { properties: { innerText: "moveBox();" } },
                    paintItem(),
                  ],
                },
              },
              paintItem(),
            ],
          },
        },
        paintItem(),
      ],
      "renderSteps"
    ),
  }),
  new EventLoop({
    mainThread: new Stack([
      { properties: { innerText: 'console.log("Fetching articles...");' } },
      {
        properties: { innerText: 'fetch("http://my-api.com/posts");' },
        enqueues: {
          microTasks: [
            { properties: { innerText: "renderPosts(response);" } },
            { properties: { innerText: 'console.log("Fetched articles.");' } },
          ],
        },
      },
    ]),
  }),
  new EventLoop({
    mainThread: new Stack([
      {
        properties: {
          innerText: 'console.log("Shopping for ingredients.");',
        },
      },
      {
        properties: {
          innerText: 'fetch("http://grocery-store/shopping-list");',
        },
        enqueues: {
          microTasks: [
            { properties: { innerText: "const fruitSalad = [];" } },
            { properties: { innerText: 'console.log("Slicing bananas.");' } },
            {
              properties: {
                innerText:
                  'setTimeout(() => fruitSalad.push("Sliced bananas"));',
              },
              enqueues: {
                taskQueue: [
                  {
                    properties: {
                      innerText: 'fruitSalad.push("Sliced bananas");',
                    },
                  },
                ],
              },
            },
            {
              properties: {
                innerText: 'fruitSalad.push("Blueberries");',
              },
            },
            {
              properties: {
                innerText: 'fruitSalad.push("Honey");',
              },
            },
            {
              properties: {
                innerText:
                  "requestAnimationFrame(() => console.log(fruitSalad));",
              },
              enqueues: {
                renderSteps: [
                  { properties: { innerText: "console.log(fruitSalad);" } },
                ],
              },
            },
          ],
        },
      },
    ]),
  }),
];

const frames = EXAMPLES[CURRENT_EXAMPLE].frames;

function createElement(name, options) {
  const el = document.createElement("div");
  el.id = name;
  el.style.position = "absolute";
  el.style.width = `${UNIT_SIZE * BLOCK_WIDTH - GUTTER}px`;
  el.style.height = `${UNIT_SIZE * BLOCK_HEIGHT - GUTTER}px`;
  el.style.padding = `${PADDING}px`;
  el.style.borderRadius = `${BORDER_RADIUS}px`;
  applyProps(el, options);
  scene.appendChild(el);
  return el;
}

function renderScene(frame) {
  Object.entries(frame.items).forEach(([name, options]) => {
    createElement(name, options);
  });
}

function showExample(frames) {
  renderScene(frames[0]);
  animate(frames);
}

function applyProps(el, props = {}) {
  Object.entries(props).forEach(([name, value]) => {
    switch (name) {
      case "left":
        el.style.left = `${value * UNIT_SIZE * BLOCK_WIDTH + PADDING}px`;
        break;
      case "top":
        el.style.top = `${value * UNIT_SIZE * BLOCK_HEIGHT + PADDING}px`;
        break;
      case "innerText":
        el.innerText = value;
        break;
      default:
        el.style[name] = value;
    }
  });
}

function animate(frames, index = 0) {
  const frame = frames[index];
  const { duration = DEFAULT_FRAME_DURATION } = frame;

  Object.entries(frame.items).forEach(([name, options]) => {
    const el = document.getElementById(name) || createElement(name);
    el.style.transition = `${EASING} ${duration}ms`;
    applyProps(el, options);
  });

  setTimeout(() => {
    animate(frames, (index + 1) % frames.length);
  }, duration);
}

showExample(frames);
