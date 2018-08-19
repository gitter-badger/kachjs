class KachListenDirective {
  constructor(private el: HTMLElement, objname: string, ...args: string[]) {
    bind(objname);
    if (args[0]) {
      if ($data[objname] !== undefined) this.el.setAttribute(args[0], $data[objname]);
      subscribe(objname, () => this.el.setAttribute(args[0], $data[objname]));
    } else {
      let isInput = this.el instanceof HTMLInputElement;
      if ($data[objname] !== undefined) {
        if (isInput) (this.el as HTMLInputElement).value = $data[objname];
        else this.el.innerText = $data[objname];
      }
      subscribe(
        objname,
        isInput
          ? () => ((this.el as HTMLInputElement).value = $data[objname])
          : () => (this.el.innerText = $data[objname]),
      );
    }
  }
}
