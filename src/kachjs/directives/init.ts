class KachInitDirective {
  constructor(el: HTMLElement, action: string) {
    if (action.indexOf('=') === -1 || action.indexOf(' ') === 0) console.error(`Failed to parse (init)="${action}"`);
    else eval('$data.' + action);
  }
}
