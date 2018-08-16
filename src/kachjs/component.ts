/// <reference path="modules/component.cache.ts"/>
function Component(selector: string) {
  return (target: any) => {
    window.customElements.define(selector, target);
  };
}

class KachComponent extends HTMLElement {
  innerData?: string;

  constructor(selector: string, noTemplate?: boolean) {
    super();
    this.innerData = this.innerHTML;
    if (!noTemplate)
      getComponentTemplate(selector).then(template => {
        this.innerHTML = (template as string).replace(/{{@data}}/g, this.innerData || '');
        // We get DOM updated, so that we traverse this node again
        traverseNodes(this);
      });
  }
}
