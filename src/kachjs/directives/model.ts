class KachModelDirective {
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
    }
  }
}
