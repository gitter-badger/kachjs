class KachIfDirective {
  constructor(el: HTMLElement, arg: string) {
    try {
      eval('(function(' + arg + '){})');
    } catch {
      el.hidden = eval(arg);
      return;
    }
    bind(arg);
    el.hidden = !$data[arg];
    $subscribes[arg].push(() => (el.hidden = !$data[arg]));
  }
}
class KachIfNotDirective {
  constructor(el: HTMLElement, arg: string) {
    try {
      eval('(function(' + arg + '){})');
    } catch {
      el.hidden = eval(arg);
      return;
    }
    bind(arg);
    el.hidden = $data[arg];
    $subscribes[arg].push(() => (el.hidden = $data[arg]));
  }
}
