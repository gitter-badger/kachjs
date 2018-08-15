/*
    Attribute: (bind)
    Performs two-way binding, e.g. links user input and variable
*/
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
  constructor(private el: HTMLElement, objname: string) {
    bind(objname);
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

      input.value = $data[objname];
      $subscribes[objname].push(() => (input.value = $data[objname]));
    } else {
      this.el.innerText = $data[objname];
      $subscribes[objname].push(() => (this.el.innerText = $data[objname]));
    }
  }
}
