class KachIfDirective {
  constructor(el: HTMLElement, arg: string, not?: boolean) {
    try {
      eval('(function(' + arg + '){})');
    } catch {
      el.hidden = eval(arg);
      return;
    }
    bind(arg);
    el.hidden = not ? $data[arg] : !$data[arg];
    $subscribes[arg].push(() => (el.hidden = not ? $data[arg] : !$data[arg]));
  }
}
