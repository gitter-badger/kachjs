var $routes: { [key: string]: string } = { default: '' };

interface RouteDecoratorOptions {
  selector: string;
  route?: string;
  defaultRoute?: boolean;
}
function Route(options: RouteDecoratorOptions) {
  if (options.route) $routes[options.route] = options.selector;
  if (options.defaultRoute) $routes['default'] = options.selector;
  return (target: any) => {};
}
@Component('kach-router')
class KachRoutes extends KachComponent {
  constructor() {
    super('kach-router', true);
    if (!$routes['default'])
      listen($routes, 'default', () => {
        if ($routes[location.hash.slice(1)]) this.innerHTML = $routes['default'];
      });
    if ($routes[location.hash.slice(1)]) {
      let routerComponent = $routes[location.hash.slice(1)];
      this.innerHTML = `<${routerComponent}></${routerComponent}>`;
    } else this.innerHTML = $routes['default'];
    window.addEventListener('hashchange', () => {
      if ($routes[location.hash.slice(1)]) {
        let routerComponent = $routes[location.hash.slice(1)];
        this.innerHTML = `<${routerComponent}></${routerComponent}>`;
      } else this.innerHTML = $routes['default'];
    });
  }
}
