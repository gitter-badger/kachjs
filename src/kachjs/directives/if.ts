class KachIfDirective {
  constructor(el: HTMLElement, arg: string) {
    let ev;
    try {
      ev = eval(arg);
    } catch {}
    try {
      eval('(function(' + ev + '){})');
    } catch {
      el.hidden = !ev;
      return;
    }
    bind(arg);
    el.hidden = !$data[arg];
    $subscribes[arg].push(() => (el.hidden = !$data[arg]));
  }
}
