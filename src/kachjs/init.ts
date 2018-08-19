/// <reference path="component.ts"/>
/// <reference path="directives.ts"/>
function traverseNodes(el: HTMLElement, revisit?: boolean) {
  if (el.hasAttribute('kach-app') && !revisit) return;
  el.setAttribute('kach-app', '');
  new KachDirectives(el);
  for (let i = 0; i < el.children.length; i++) traverseNodes(el.children.item(i) as HTMLElement, revisit);
}

var $data: { [key: string]: any } = {};
var $subscribes: { [key: string]: Function[] } = {};

function subscribe(objname: string, callback: Function) {
  if (!$subscribes[objname]) $subscribes[objname] = [];
  $subscribes[objname].push(callback);
}

@Component('kach-data')
class KachDataComponent extends KachComponent {
  constructor() {
    super('kach-data', true);
  }
}
