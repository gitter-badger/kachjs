/// <reference path="../varcheck.ts"/>
class KachIfDirective {
  constructor(el: HTMLElement, arg: string, invert?: boolean) {
    if (isValidVarName(arg)) {
      bind(arg);
      el.hidden = invert ? $data[arg] : !$data[arg];
      $subscribes[arg].push(() => (el.hidden = invert ? $data[arg] : !$data[arg]));
    } else {
      let ev = eval(arg);
      el.hidden = invert ? ev : !ev;
    }
  }
}
