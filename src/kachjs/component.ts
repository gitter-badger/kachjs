/// <reference path="modules/component.cache.ts"/>
/// <reference path="modules/router.ts"/>
function Component(selector: string, route?: string) {
  if (route) $routes[route] = selector;
  return (target: any) => window.customElements.define(selector, target);
}

class KachComponent extends HTMLElement {
  innerData?: string;
  loaded: boolean = false;

  constructor(selector: string, noTemplate?: boolean) {
    super();
    this.innerData = this.innerHTML;
    if (!noTemplate)
      getComponentTemplate(selector).then(template => {
        this.innerHTML = (template as string).replace(/{{@data}}/g, this.innerData || '');
        traverseNodes(this, true);
        this.loaded = true;
      });
  }
  load(): Promise<void> {
    let waitForElement = (resolve: any) => {
      if (this.loaded) resolve();
      else setTimeout(waitForElement, 0, resolve);
    };
    return new Promise(waitForElement);
  }
}
