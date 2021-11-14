function q(query) {
  return Array.prototype.slice.call(document.querySelectorAll(query));
}

function createElement(type, options = {}) {
  const el = document.createElement(type);
  const { className = {}, parent, children, style, ...rest } = options;

  if (parent) {
    parent.appendChild(el);
  }

  if (children) {
    children.forEach((childDef) => {
      if (childDef instanceof HTMLElement) {
        return el.appendChild(childDef);
      }
      const [childType, childOptions] = childDef;
      createElement(childType, { ...childOptions, parent: el });
    });
  }

  if (style) {
    Object.entries(style).forEach(([property, value]) => {
      el.style[property] = value;
    });
  }

  Object.entries(className).forEach(([name, isEnabled]) => {
    el.classList.toggle(name, isEnabled);
  });

  Object.entries(rest).forEach(([key, value]) => {
    el[key] = value;
  });

  return el;
}

class FlexContainer {
  constructor(itemDefs, options = {}) {
    this.options = options;
    this.el = createElement("div", {
      className: { "flex-container": true },
      children: itemDefs.map((def, i) => new FlexItem(def, i).render()),
    });
  }

  render() {
    Object.assign(this.el.style, this.options);
    return this.el;
  }
}

function camelCase(str) {
  const [firstWord, ...words] = str.split("-");

  return [
    firstWord.toLowerCase(),
    ...words
      .map((word) => word.split(""))
      .map(([firstChar, ...chars]) =>
        [firstChar.toUpperCase(), ...chars].join("")
      )
      .join(""),
  ].join("");
}

class ToolSelect {
  constructor(property, options, onChange) {
    this.property = property;
    this.options = options;
    this.onChange = onChange;
  }

  render() {
    return createElement("span", {
      children: [
        ["code", { innerText: `  ${this.property}: ` }],
        [
          "select",
          {
            id: camelCase(this.property),
            onchange: this.onChange,
            children: [
              ...this.options.map((value) => [
                "option",
                { innerHTML: value, value },
              ]),
            ],
          },
        ],
        ["code", { innerText: `;\n` }],
      ],
    });
  }
}

class Toolbar {
  constructor(parent, options = { onChange: () => null }) {
    this.parent = parent;
    this.options = options;
  }

  render() {
    this.tools = [
      new ToolSelect(
        "flex-direction",
        ["row", "row-reverse", "column", "column-reverse"],
        this.onChange.bind(this)
      ),
      new ToolSelect(
        "flex-wrap",
        ["nowrap", "wrap", "wrap-reverse"],
        this.onChange.bind(this)
      ),
      new ToolSelect(
        "justify-content",
        [
          "flex-start",
          "flex-end",
          "center",
          "space-between",
          "space-around",
          "space-evenly",
          "start",
          "end",
          "left",
          "right",
        ],
        this.onChange.bind(this)
      ),
      new ToolSelect(
        "align-items",
        ["flex-start", "flex-end", "center", "stretch", "baseline"],
        this.onChange.bind(this)
      ),
      new ToolSelect(
        "align-content",
        [
          "normal",
          "flex-start",
          "flex-end",
          "center",
          "stretch",
          "space-between",
          "space-around",
        ],
        this.onChange.bind(this)
      ),
      new ToolSelect(
        "gap",
        ["initial", "1rem", "2rem"],
        this.onChange.bind(this)
      ),
    ];

    class FlexItemTool {
      constructor(selector, toolDefs) {
        this.selector = selector;
        this.toolDefs = toolDefs;
      }

      render() {
        return createElement("pre", {
          children: [
            ["code", { innerText: `${this.selector} {\n` }],
            ...this.toolDefs.map(([property, options, onChange]) => {
              return new ToolSelect(property, options, onChange).render();
            }),
            ["code", { innerText: `}` }],
            ["br"],
            ["br"],
          ],
        });
      }
    }

    return createElement("pre", {
      parent: this.parent,
      children: [
        ["code", { innerText: ".flex-container {\n" }],
        ["span", { innerText: "  display: flex;\n" }],
        ...this.tools.map((tool) => tool.render()),
        ["span", { innerText: "}" }],
        ["br"],
        ["br"],
        ...Array(this.options.itemCount)
          .fill()
          .map((_, i) =>
            new FlexItemTool(`.flex-item-${i}`, [
              [
                "order",
                [0, 1, 2, 3, 4],
                this.onChildChange(`.flex-item-${i}`, "order"),
              ],
              [
                "flex-grow",
                [0, 1, 2, 3, 4],
                this.onChildChange(`.flex-item-${i}`, "flex-grow"),
              ],
              [
                "flex-shrink",
                [0, 1, 2, 3, 4],
                this.onChildChange(`.flex-item-${i}`, "flex-shrink"),
              ],
              [
                "flex-basis",
                ["auto", "1%", "2rem"],
                this.onChildChange(`.flex-item-${i}`, "flex-basis"),
              ],
              [
                "align-self",
                [
                  "auto",
                  "flex-start",
                  "flex-end",
                  "center",
                  "baseline",
                  "stretch",
                ],
                this.onChildChange(`.flex-item-${i}`, "align-self"),
              ],
            ]).render()
          ),
      ],
    });
  }

  onChildChange(className, property) {
    return (event) => {
      q(className).forEach((el) => {
        el.style[property] = event.target.value;
      });
    };
  }

  onChange(event) {
    this.options[event.target.id] = event.target.value;
    this.options.onChange(event, this.options);
  }
}

class FlexItem {
  constructor(definition, id) {
    this.definition = definition;
    this.id = id;
  }

  render() {
    return createElement("div", {
      innerText: `.flex-item-${this.id}`,
      className: { "flex-item": true, [`flex-item-${this.id}`]: true },
      style: {
        width: this.definition.width,
        height: this.definition.height,
      },
    });
  }
}

class FlexEditor {
  constructor(el) {
    this.el = el;
    this.itemDefs = [
      { width: "20%", height: "5rem" },
      { width: "20%", height: "2rem" },
      { width: "20%", height: "7rem" },
      { width: "60%", height: "4rem" },
    ];
  }

  render() {
    const toolbar = new Toolbar(this.el, {
      itemCount: 5,
      onChange: (_, options) => {
        flexContainer.options = options;
        flexContainer.render();
      },
    });
    const flexContainer = new FlexContainer(this.itemDefs, toolbar.options);

    createElement("div", {
      parent: this.el,
      className: { row: true },
      children: [
        [
          "div",
          {
            className: { "col-6": true },
            children: [flexContainer.render()],
          },
        ],
        [
          "div",
          {
            className: { "col-6": true },
            children: [toolbar.render()],
          },
        ],
      ],
    });
  }
}

q(".flex-editor").forEach((el) => {
  new FlexEditor(el).render();
});
