let $$components: { [key: string]: string } = {};
function getComponentTemplate(selector: string): Promise<string> {
  if (selector in $$components) return new Promise(resolve => resolve($$components[selector]));
  else {
    return new Promise((resolve, reject) => {
      $http<string>({
        url: `/components/${selector}.html`,
        method: 'GET',
      })
        .then(data => {
          $$components[selector] = data;
          resolve(data);
        })
        .catch(reason => reject(reason));
    });
  }
}
