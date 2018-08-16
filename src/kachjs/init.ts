/// <reference path="component.ts"/>
/// <reference path="directives.ts"/>
function traverseNodes(el: HTMLElement) {
  const parseInner = !el.children || el.children.length === 0;
  new KachDirectives(el, parseInner);
  for (let i = 0; i < el.children.length; i++) traverseNodes(el.children.item(i) as HTMLElement);
}

var $data: { [key: string]: any } = {};
var $subscribes: { [key: string]: Function[] } = {};

@Component('kach-data')
class KachDataComponent extends KachComponent {
  constructor() {
    super('kach-data', true);
  }
}
