class KachListenDirective {
  constructor(private el: HTMLElement, objname: string) {
    bind(objname);
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
