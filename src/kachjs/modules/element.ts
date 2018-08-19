function $element(selector: string) {
  switch (selector[0]) {
    case '#':
      return new KachModifiable(document.getElementById(selector.slice(1)));
    case '.':
      return new KachModifiable(document.getElementsByClassName(selector.slice(1)));
    default:
      return new KachModifiable(document.getElementsByTagName(selector));
  }
}

interface ExtendableCSSStyleDeclaration extends CSSStyleDeclaration {
  [key: string]: any;
}
class KachModifiable {
  style: (stylename: string, value: string) => void;
  class: (classname: string) => void;

  constructor(public el: HTMLElement | HTMLCollectionOf<Element> | NodeListOf<Element> | null) {
    if (this.el instanceof HTMLElement) {
      this.style = (stylename: string, value: string) => {
        ((this.el as HTMLElement).style as ExtendableCSSStyleDeclaration)[stylename] = value;
      };
      this.class = (classname: string) => (this.el as HTMLElement).classList.toggle(classname);
    } else if (!this.el) this.style = this.class = () => {};
    else {
      this.style = (stylename: string, value: string) =>
        (this.el as any).forEach(
          (element: HTMLElement) => ((element.style as ExtendableCSSStyleDeclaration)[stylename] = value),
        );
      this.class = (classname: string) =>
        (this.el as any).forEach((element: HTMLElement) => element.classList.toggle(classname));
    }
  }
}
