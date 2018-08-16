class KachListenDirective {
  constructor(private el: HTMLElement, objname: string, ...args: string[]) {
    bind(objname);
    if (args[0]) {
      this.el.setAttribute(args[0], $data[objname]);
      $subscribes[objname].push(() => this.el.setAttribute(args[0], $data[objname]));
    } else {
      if (this.el instanceof HTMLInputElement) {
        const input = this.el as HTMLInputElement;
        input.value = $data[objname];
        $subscribes[objname].push(() => (input.value = $data[objname]));
      } else {
        this.el.innerText = $data[objname];
        $subscribes[objname].push(() => (this.el.innerText = $data[objname]));
      }
    }
  }
}
