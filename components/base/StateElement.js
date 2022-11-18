class StateElement extends HTMLElement {
  constructor(config) {
    super();
    this.attachShadow({
      mode: 'open',
    });
    this._state = config?.state;

    this._styleSheet = document.createElement('style');
    this._styleSheet.textContent = config?.styleSheet ?? '';
  };

  get state() {
    return this._state;
  }

  setState(state) {
    if (typeof state === 'function') {
      this._state = state(this._state);
    } else {
      this._state = {
        ...this._state,
        ...state
      };
    }
    this._render();
  }

  connectedCallback() {
    this.childrenHTML =  this.innerHTML;
    const attrNames = this.getAttributeNames();
    this.props = {};
    for(const name of attrNames) {
      this.props[name] = this.getAttribute(name);
    }

    this._render();
  }

  // attributeChangedCallback(name, oldValue, newValue) {
  //   console.log("attributeChangedCallback", name, oldValue || "null", newValue);
  // }

  _render() {
    if (!this.render) {
      return;
    }

    const {
      html, options
    } = this.render();
    this.shadowRoot.innerHTML = `${html}${this._styleSheet.outerHTML}`;

    for(const id in options) {
      const el = this.shadowRoot.querySelector(`[${id}]`);

      if(!el) continue;

      const option = options[id];

      if(option?.handlers) {
        const handlers = option?.handlers;
        
        for(const event in handlers) {
          el.addEventListener(`${event}`, handlers[event].bind(this));
        }
      }
    }
  }
}