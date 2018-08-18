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
  style: Function;
  constructor(public el: HTMLElement | HTMLCollectionOf<Element> | NodeListOf<Element> | null) {
    if (el instanceof HTMLElement)
      this.style = (stylename: string, value: string) => {
        ((this.el as HTMLElement).style as ExtendableCSSStyleDeclaration)[stylename] = value;
      };
    else if (!el) this.style = () => {};
    else
      this.style = (stylename: string, value: string) =>
        (this.el as any).forEach(
          (element: HTMLElement) => ((element.style as ExtendableCSSStyleDeclaration)[stylename] = value),
        );
  }
}
