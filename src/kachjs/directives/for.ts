/// <reference path="../varcheck.ts"/>
class KachForDirective {
  loopData: string[];
  loopDirective: string;

  constructor(private el: HTMLElement, private loop: string) {
    this.loopData = loop.split(' ');
    this.loopDirective = this.el.innerHTML;

    if (isValidVarName(this.loopData[2])) {
      bind(this.loopData[2]);
      this.render();
      $subscribes[this.loopData[2]].push(() => this.render());
    } else this.render();
  }
  private render() {
    let rendered = '';
    eval(`
    for (let ${this.loop}) {
      let match;
      let parsed = this.loopDirective;
      do {
        match = /\\\${.*}/.exec(parsed);
        if (match) parsed = parsed.replace(match[0], eval(match[0].slice(2, -1)));
      } while (match);
      rendered += parsed;
    }`);
    this.el.innerHTML = rendered;
  }
}
