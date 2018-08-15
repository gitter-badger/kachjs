#!/usr/bin/node
const fs = require('fs');
const ncp = require('ncp').ncp;
const spawn = require('child_process').spawn;

const dev_js = `console.warn('This app is built with development server. To compile app in production mode use "kach build --prod" command.');
var es = new EventSource("/sse");
es.onmessage = () => {
    console.log("Update detected. Reloading...");
    location.reload();
};`;
const prettierrc = `{
  "printWidth": 120,
  "trailingComma": "all",
  "singleQuote": true
}`;
function index_html(project, dev) {
  return `<html>
    <head>
        <title>${project}</title>
        <link rel="stylesheet" href="styles.css">
    </head>
    <body>
        <app-root></app-root>
        <script src="app.js"></script>${dev ? `<script src="dev.js"></script>` : ``}
    </body>
</html>`;
}
const server_js = `const port = 9000;
const fs = require('fs');
const sse = require('sse');
const url = require('url');
const http = require('http');
const path = require('path');

let lock = false;
const spawn = require('child_process').spawn,
  build = () => {
    if (!lock) {
      lock = true;
      let builder = spawn('npm', ['run', 'build']);
      builder.stdout.pipe(process.stdout);
      builder.stderr.pipe(process.stderr);
      return builder;
    } else return { on: () => {} };
  };

let server = http
  .createServer(function(req, res) {
    // parse URL
    const parsedUrl = url.parse(req.url);
    // extract URL path
    let pathname = \`.\${parsedUrl.pathname}\`;
    pathname = './prod/' + pathname.substr(2);
    // based on the URL path, extract the file extention. e.g. .js, .doc, ...
    const ext = path.parse(pathname).ext || '.html';
    // maps file extention to MIME typere
    const map = {
      '.ico': 'image/x-icon',
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.json': 'application/json',
      '.css': 'text/css',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.wav': 'audio/wav',
      '.mp3': 'audio/mpeg',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
    };

    fs.exists(pathname, function(exist) {
      if (!exist) {
        // if the file is not found, return 404
        res.statusCode = 404;
        res.end(\`File \${pathname} not found!\`);
        return;
      }

      // if is a directory search for index file matching the extention
      if (fs.statSync(pathname).isDirectory()) pathname += '/index.html';

      // read file from file system
      fs.readFile(pathname, function(err, data) {
        if (err) {
          res.statusCode = 500;
          res.end(\`Error getting the file: \${err}.\`);
        } else {
          // if the file is found, set Content-type and send data
          res.setHeader('Content-type', map[ext] || 'text/plain');
          res.end(data);
        }
      });
    });
  })
  .listen(port, '0.0.0.0', () => {
    var ss = new sse(server);
    ss.on('connection', client => {
      fs.watch('prod').on('change', () => {
        client.send('update');
      });
    });
  });

let watcher = require('hound').watch('src');
watcher.on('create', () => build().on('close', () => (lock = false)));
watcher.on('change', () => build().on('close', () => (lock = false)));
watcher.on('delete', () => build().on('close', () => (lock = false)));

build().on('close', () => {
  lock = false;
  console.log(\`Server listening on port \${port}\`);
});
`;
function package_json(name) {
  return `{
    "name": "${name}",
    "dependencies": {
      "hound": "^1.0.5",
      "sse": "0.0.8"
    },
    "scripts": {
      "build": "prettier --write \\"src/**/*.ts\\" && tsc &&  cp src/components/**/*.html prod/components/ && sass src/components/app-root/*.sass prod/styles.css --no-source-map",
      "start": "node server.js"
    },
    "devDependencies": {}
}`};
const tsconfig_json = `{
    "compilerOptions": {
      "target": "es2015",
      "lib": ["dom", "es2015"],
      "outFile": "./prod/app.js",
      "rootDir": "./src",
      "removeComments": true,
      "strict": true,
      "noImplicitReturns": true,
      "esModuleInterop": true,
      "experimentalDecorators": true,
    },
    "exclude": [
      "prod"
    ]
}`;

function newProject(name) {
  fs.mkdirSync(name);
  fs.writeFileSync(name + '/.prettierrc', prettierrc);
  fs.writeFileSync(name + '/package.json', package_json(name));
  fs.writeFileSync(name + '/tsconfig.json', tsconfig_json);
  fs.writeFileSync(name + '/server.js', server_js);

  fs.mkdirSync(name + '/src');
  ncp(__dirname + '/src/kachjs', name + '/src/kachjs');
  fs.mkdirSync(name + '/src/components');

  fs.mkdirSync(name + '/prod');
  fs.writeFileSync(name + '/prod/index.html', index_html(name, true));
  fs.writeFileSync(name + '/prod/dev.js', dev_js);
  fs.mkdirSync(name + '/prod/components');

  process.chdir(name);
  newComponent('app-root');
  let install = spawn('npm', ['install']);
  install.stdout.pipe(process.stdout);
  install.stderr.pipe(process.stderr);
}

function parseName(name) {
  name = name.charAt(0).toUpperCase() + name.slice(1);
  let index;
  while ((index = name.indexOf('-')) !== -1) {
    if (index + 1 === name.length) name = name.slice(0, -1);
    else name = name.slice(0, index) + name.charAt(index + 1).toUpperCase() + name.slice(index + 2);
  }
  return name;
}
function newComponent(name) {
  fs.mkdirSync(`src/components/${name}`);
  fs.writeFileSync(`src/components/${name}/${name}.html`, `<p>${name} works!</p>`);
  fs.writeFileSync(
    `src/components/${name}/${name}.sass`,
    `${name}
\tp
\t\tcolor: red`,
  );
  fs.writeFileSync(
    `src/components/${name}/component.ts`,
    `/// <reference path="../../kachjs/component.ts"/>
  @Component('${name}')
  class ${parseName(name)}Component extends KachComponent {
    constructor() {
      super('${name}');
    }
  }`,
  );
}

function usage() {
  console.log(`Usage:
\tkach <command>
Possible commands:
\t[n]ew <name> - create new project
\t[c]omponent <name> - create new component
\t[s]erve - run live development server
\t[b]uild (--prod) - build project`);
}

function main() {
  if (process.argv.length === 2) return usage();
  switch (process.argv[2]) {
    case 's':
    case 'serve':
      fs.stat('src/kachjs', err => {
        if (err) console.error('src/kachjs folder not found. Aborting.');
        else {
          let server = spawn('npm', ['start']);
          server.stderr.pipe(process.stderr);
          server.stdout.pipe(process.stdout);
          server.on('close', code => process.exit(code));
        }
      });
      break;
    case 'n':
    case 'new':
      if (process.argv.length === 3) return usage();
      newProject(process.argv[3]);
      break;
    case 'c':
    case 'component':
      if (process.argv.length === 3) return usage();
      newComponent(process.argv[3]);
      break;
    case 'p':
      console.log(parseName(process.argv[3]));
      break;
    case 'b':
    case 'build':
      let builder = spawn('npm', ['run', 'build']);
      builder.stdout.pipe(process.stdout);
      builder.stderr.pipe(process.stderr);
      fs.writeFileSync('prod/index.html', index_html(require('./package.json').name, true));
      break;
    default:
      usage();
      break;
  }
}
main();
