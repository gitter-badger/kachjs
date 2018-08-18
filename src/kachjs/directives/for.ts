/// <reference path="../varcheck.ts"/>
class KachForDirective {
  loopData: string[];
  loopDirective: string;

  constructor(private el: HTMLElement, private loop: string) {
    this.loopData = loop.split(' ');
    this.loopDirective = this.el.innerHTML;

    if (isValidVarName(this.loopData[2])) {
      bind(this.loopData[2]);
      this.loop = `${this.loopData[0]} ${this.loopData[1]} $data['${this.loopData[2]}']`;
      this.render();
      subscribe(this.loopData[2], () => this.render());
    } else this.render();
  }
  private findClosingBracket(str: string, l: number) {
    l = str.indexOf('{', l);
    let stack = 0;
    let r: number;
    do {
      if (str[l] === '{') stack++;
      else if (str[l] === '}') {
        stack--;
        r = l;
      }
      l++;
    } while (stack);
    return r!;
  }
  private render() {
    let rendered = '';
    eval(`let i = 0;for (let ${this.loop}) {
      let match;
      let parsed = this.loopDirective;
      do {
        match = /\\\${/.exec(parsed);
        if (match) {
          let directive = parsed.slice(match.index, this.findClosingBracket(parsed, match.index) + 1);
          parsed = parsed.replace(
            directive,
            eval(
              \`(function(${this.loopData[0]}, json, i) {return \${directive.slice(2, -1)}})(${
      this.loopData[0]
    }, JSON.stringify, i)\`,
            ),
          );
        }
      } while (match);
      i++;
      rendered += parsed;
    }`);
    this.el.innerHTML = rendered;
  }
}
