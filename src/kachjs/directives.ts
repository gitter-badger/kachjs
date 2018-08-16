class KachDirectives {
  private readonly directives: { [key: string]: Function } = {
    '(click)': (action: string) => {
      this.el.addEventListener('click', () => {
        eval(action);
      });
    },
    '(init)': (action: string) => {
      new KachInitDirective(this.el, action);
    },
    '(if)': (action: string) => {
      new KachIfDirective(this.el, action);
    },
    '(ifn)': (action: string) => {
      new KachIfDirective(this.el, action, true);
    },
    '(for)': (loop: string) => {
      new KachForDirective(this.el, loop);
    },
    '(bind)': (objname: string, ...args: string[]) => {
      new KachBindDirective(this.el, objname, args[0]);
    },
    '(listen)': (objname: string, ...args: string[]) => {
      new KachListenDirective(this.el, objname, args[0]);
    },
    '(model)': (objname: string) => {
      new KachModelDirective(this.el, objname);
    },
  };
  constructor(private el: HTMLElement, parseInnerText: boolean) {
    if (this.el.hasAttributes()) {
      for (let i = 0; i < this.el.attributes.length; i++)
        this.el.attributes[i].value = this.evalAndReplace(this.el.attributes[i].value);
      for (let i = 0; i < this.el.attributes.length; i++) {
        if (RegExp(`^\\(.+?(:.+)?\\)$`).test(this.el.attributes[i].name)) {
          let args = this.el.attributes[i].name.slice(1, -1).split(':');
          let directive = `(${args[0]})`;
          if (this.directives[directive]) {
            this.directives[directive](this.el.attributes[i].value, ...args.slice(1));
          }
        }
      }
    }
    if (parseInnerText && 'innerText' in el) this.el.innerText = this.evalAndReplace(this.el.innerText);
  }

  private evalAndReplace(data: string): string {
    const matches = data.match(/{{.+}}/gm);
    if (matches) {
      matches.forEach(match => {
        data = data.replace(match, eval(match));
      });
    }
    return data;
  }
}
