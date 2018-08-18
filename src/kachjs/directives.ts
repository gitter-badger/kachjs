type directiveRegisterCallback = (el: HTMLElement, data: string, ...args: string[]) => {};
let $directives: { [key: string]: directiveRegisterCallback } = {};

function Directive(attrname: string) {
  if (!$directives) $directives = {};
  if ($directives[attrname]) throw Error(`Directive ${attrname} was already defined!`);
  return (target: any, key: any, value: any) => ($directives[attrname] = value.value);
}
class KachDirectives {
  constructor(private el: HTMLElement) {
    if (this.el.hasAttributes()) {
      for (let i = 0; i < this.el.attributes.length; i++)
        this.el.attributes[i].value = this.evalAndReplace(this.el.attributes[i].value);
      for (let i = 0; i < this.el.attributes.length; i++) {
        if (RegExp(`^\\(.+?(:.+)?\\)$`).test(this.el.attributes[i].name)) {
          let args = this.el.attributes[i].name.slice(1, -1).split(':');
          let directive = `(${args[0]})`;
          if ($directives[directive]) $directives[directive](this.el, this.el.attributes[i].value, ...args.slice(1));
        }
      }
    }
    this.el.innerHTML = this.evalAndReplace(this.el.innerHTML);
  }

  private evalAndReplace(data: string): string {
    const matches = data.match(/{{.+?}}/gm);
    if (matches) {
      matches.forEach(match => {
        let binddata = match.slice(2, -2);
        if (isValidVarName(binddata)) data = data.replace(match, `<kach-data (listen)="${binddata}"></kach-data>`);
        else data = data.replace(match, eval(match));
      });
    }
    return data;
  }

  @Directive('(click)')
  clickDirective(el: HTMLElement, data: string) {
    el.addEventListener('click', () => eval(data));
  }
  @Directive('(init)')
  initDirective(el: HTMLElement, data: string) {
    if (data.indexOf('=') === -1) console.error(`Failed to parse (init)="${data}"`);
    else {
      let varname = data.slice(data.indexOf('='));
      if (varname.indexOf(' ') !== -1) varname = varname.slice(varname.indexOf(' '));
      if (!$data[varname]) eval('$data.' + data);
    }
  }
  @Directive('(if)')
  ifDirective(el: HTMLElement, data: string) {
    new KachIfDirective(el, data);
  }
  @Directive('(ifn)')
  ifnDirective(el: HTMLElement, data: string) {
    new KachIfDirective(el, data, true);
  }
  @Directive('(for)')
  forDirective(el: HTMLElement, data: string) {
    new KachForDirective(el, data);
  }
  @Directive('(bind)')
  bindDirective(el: HTMLElement, data: string, ...args: string[]) {
    new KachBindDirective(el, data, args[0]);
  }
  @Directive('(listen)')
  listenDirective(el: HTMLElement, data: string, ...args: string[]) {
    new KachListenDirective(el, data, args[0]);
  }
  @Directive('(model)')
  modelDirective(el: HTMLElement, data: string) {
    new KachModelDirective(el, data);
  }
}
