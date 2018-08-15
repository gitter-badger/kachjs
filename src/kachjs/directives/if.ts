/*
    Attribute: (if)
    Hides element if value is undefined, false, null, '', 0
*/
class KachIfDirective {
  constructor(el: HTMLElement, arg: string) {
    bind(arg);
    el.hidden = !(<boolean>$data[arg]);
    $subscribes[arg].push(() => (el.hidden = !(<boolean>$data[arg])));
  }
}
