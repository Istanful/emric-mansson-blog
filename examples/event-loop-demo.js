document.innerHTML = "";
const scene = document.createElement("div");
scene.id = "scene";
document.body.appendChild(scene);

const COL_SIZE = 100;
const DEFAULT_FRAME_DURATION = 200;
const GUTTER = 25;
const EASING = "ease-out";
const ROW_COUNT = 6;

class Stack {
  constructor(items, id) {
    this.id = id;
    this.items = items.map((item, i) => {
      return {
        ...item,
        properties: {
          left: this.left,
          top: ROW_COUNT - i,
          transform: "scale(0)",
          background: "#b788d7",
          ...item.properties,
        },
      };
    });
  }

  get left() {
    return (
      ["mainThread", "taskQueue", "renderSteps", "microTasks"].indexOf(
        this.id
      ) + 1
    );
  }

  get initialFrameItems() {
    return this.items.reduce((memo, item, i) => {
      return {
        ...memo,
        [`${this.id}${i}`]: { ...item.properties },
      };
    }, {});
  }

  get fillFrames() {
    return this.items.reduce((memo, item, i) => {
      return [
        ...memo,
        {
          items: {
            [`${this.id}${i}`]: { transform: "scale(1)" },
          },
        },
      ];
    }, []);
  }

  shiftFrames(eventLoop) {
    return this.consumeFrames(eventLoop, 1);
  }

  appendFrames(frames) {
    const left = this.left;

    this.items = [
      ...this.items,
      ...frames.map((frame, i) => {
        return {
          ...frame,
          properties: {
            left,
            top: ROW_COUNT - i,
            transform: "scale(0)",
            background: "#b788d7",
            ...frame.properties,
          },
        };
      }),
    ];

    return this.items.reduce((memo, item, i) => {
      return [
        ...memo,
        {
          items: {
            [`${this.id}${i}`]: item.properties,
          },
        },
        {
          items: {
            [`${this.id}${i}`]: { transform: "scale(1)" },
          },
        },
      ];
    }, []);
  }

  get hasTasks() {
    return this.items.length > 0;
  }

  consumeFrames(eventLoop, count = this.items.length) {
    const frames = this.items.slice(0, count).reduce((memo, _, frameI) => {
      let newFrames = [
        {
          items: {
            ...this.items.reduce((memo, item, i) => {
              let props = {
                ...memo,
                [`${this.id}${i}`]: {
                  top: item.properties.top + frameI + 1,
                },
              };

              if (i === frameI) {
                props[`${this.id}${i}`].transform = "scale(0)";
              }

              return props;
            }, {}),
          },
        },
      ];

      if (this.items[frameI].enqueues) {
        const enqueueingItem = this.items[frameI];
        const [threadName, appendedFrames] = Object.entries(
          enqueueingItem.enqueues
        )[0];
        newFrames = [
          ...newFrames,
          ...eventLoop.threads[threadName].appendFrames(appendedFrames),
        ];
      }

      return [...memo, ...newFrames];
    }, []);

    this.items = this.items.slice(count);

    return frames;
  }
}

class RenderStack extends Stack {
  appendFrames(frames) {
    const threads = eventLoop.threads;
    const left = Object.keys(threads).indexOf(this.id) + 1;

    this.items = [
      ...frames.map((frame, i) => {
        return {
          ...frame,
          properties: {
            left,
            top: ROW_COUNT - i,
            transform: "scale(0)",
            background: "#b788d7",
            ...frame.properties,
          },
        };
      }),
      ...this.items,
      {
        properties: {
          left,
          transform: "scale(0)",
          background: "#b788d7",
          innerText: "Paint",
          top: ROW_COUNT - frames.length,
        },
      },
    ];

    return this.items.reduce((memo, item, i) => {
      return [
        ...memo,
        {
          items: {
            [`${this.id}${i}`]: item.properties,
          },
        },
        {
          items: {
            [`${this.id}${i}`]: { transform: "scale(1)" },
          },
        },
      ];
    }, []);
  }
}

class Robot {
  constructor(stacks) {
    this.stacks = stacks;
    this.props = {
      left: 0,
      top: ROW_COUNT + 1,
      background: "#88ddfe",
      zIndex: 1000,
      transitionTimingFunction: "ease-out",
    };
  }

  get initialFrameItem() {
    return this.props;
  }

  moveToStackFrame(name) {
    const index = Object.keys(this.stacks).indexOf(name) + 1;

    return {
      items: {
        robot: {
          left: index,
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
    return [
      {
        duration: 250,
        items: {
          robot: {
            left: this.stacksArray.length + 1,
            transitionTimingFunction: "ease-in",
          },
        },
      },
      {
        duration: 250,
        items: {
          robot: {
            top: ROW_COUNT + 2,
            transitionTimingFunction: "linear",
          },
        },
      },
      {
        duration: 250,
        items: {
          robot: {
            duration: (this.stacksArray.length + 2) * 250,
            left: 0,
          },
        },
      },
      {
        items: {
          robot: {
            left: 0,
            top: ROW_COUNT + 1,
            background: "#88ddfe",
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
          robot: this.robot.initialFrameItem,
        },
      },
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
      debugger;
      frames = [
        ...frames,
        ...this.mainThread.fillFrames,
        this.robot.moveToStackFrame("mainThread"),
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
    return this.mainThread.consumeFrames(this);
  }

  get shiftTaskQueueFrames() {
    return this.taskQueue.shiftFrames(this);
  }
}

const eventLoop = new EventLoop({
  mainThread: new Stack(
    [
      {
        properties: { innerText: 'console.log("Shopping for ingredients.");' },
      },
      {
        properties: {
          innerText: 'fetch("http://grocery-store/shopping-list")',
        },
        enqueues: {
          microTasks: [
            { properties: { innerText: "const fruitSalad = [];" } },
            { properties: { innerText: 'console.log("Slicing bananas.");' } },
            {
              properties: {
                innerText:
                  'setTimeout(() => fruitSalad.push("Sliced bananas"))',
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
                  "requestAnimationFrame(() => console.log(fruitSalad))",
              },
              enqueues: {
                renderSteps: [
                  { properties: { innerText: "console.log(fruitSalad)" } },
                ],
              },
            },
          ],
        },
      },
    ],
    "mainThread"
  ),
});

const callStack = eventLoop.frames;

function createElement(name, options) {
  const el = document.createElement("div");
  el.id = name;
  el.style.position = "absolute";
  el.style.width = `${COL_SIZE}px`;
  el.style.height = `${COL_SIZE}px`;
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
        el.style.left = `${value * COL_SIZE}px`;
        break;
      case "top":
        el.style.top = `${value * COL_SIZE}px`;
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

showExample(callStack);
