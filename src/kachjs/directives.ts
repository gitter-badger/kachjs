class KachDirectives {
  constructor(private el: HTMLElement, parseInnerText: boolean) {
    if ('getAttribute' in el) {
      this.applyAttribute('(click)', (action: string) => {
        this.el.addEventListener('click', () => {
          eval(action);
        });
      });
      this.applyAttribute('(init)', (action: string) => {
        new KachInitDirective(this.el, action);
      });

      this.applyAttribute('(if)', (action: string) => {
        new KachIfDirective(this.el, action);
      });
      this.applyAttribute('(ifn)', (action: string) => {
        new KachIfDirective(this.el, action, true);
      });
      this.applyAttribute('(for)', (loop: string) => {
        new KachForDirective(this.el, loop);
      });
      this.applyAttribute('(bind)', (objname: string) => {
        new KachBindDirective(this.el, objname);
      });
      this.applyAttribute('(model)', (objname: string) => {
        new KachModelDirective(this.el, objname);
      });
      this.applyAttribute('(listen)', (objname: string) => {
        new KachListenDirective(this.el, objname);
      });
      this.applyAttribute('(listen:src)', (objname: string) => {
        new KachListenDirective(this.el, objname, 'src');
      });
    }
    if (this.el.hasAttributes()) {
      for (let i = 0; i < this.el.attributes.length; i++)
        this.el.attributes[i].value = this.evalAndReplace(this.el.attributes[i].value);
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
  private applyAttribute(name: string, callback: Function) {
    let attr = this.el.getAttribute(name);
    if (attr) callback(this.evalAndReplace(attr));
  }
}
