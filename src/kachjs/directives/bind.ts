function bind(objname: string) {
  let prop = Object.getOwnPropertyDescriptor($data, objname);
  if (!prop || !prop.set) {
    let val: any = $data[objname];
    Object.defineProperty($data, objname, {
      get() {
        return val;
      },
      set(newValue: any) {
        val = newValue;
        $subscribes[objname].forEach((subscriber: Function) => subscriber());
      },
    });
  }
  if (!$subscribes[objname]) $subscribes[objname] = [];
}

class KachBindDirective {
  constructor(private el: HTMLElement, objname: string, ...args: string[]) {
    bind(objname);
    if (args[0]) {
      this.el.setAttribute(args[0], $data[objname]);
      subscribe(objname, () => this.el.setAttribute(args[0], $data[objname]));
    } else {
      if (this.el instanceof HTMLInputElement) {
        const input = this.el as HTMLInputElement;
        switch (input.type) {
          case 'checkbox':
            input.addEventListener('change', () => ($data[objname] = input.checked || ''));
            break;
          case 'text':
            input.addEventListener('change', () => ($data[objname] = input.value || ''));
            input.addEventListener('keyup', () => ($data[objname] = input.value || ''));
            input.addEventListener('keydown', () => ($data[objname] = input.value || ''));
            break;
        }
        if ($data[objname] !== undefined) input.value = $data[objname];
        subscribe(objname, () => (input.value = $data[objname]));
      } else {
        if ($data[objname] !== undefined) this.el.innerText = $data[objname];
        subscribe(objname, () => (this.el.innerText = $data[objname]));
      }
    }
  }
}
