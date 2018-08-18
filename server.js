const port = 9000;

const fs = require('fs');
const sse = require('sse');
const url = require('url');
const http = require('http');
const path = require('path');

let lock = false;
const spawn = require('child_process').spawn,
  build = () => {
    return new Promise(resolve => {
      if (!lock) {
        lock = true;
        let builder = spawn('/usr/bin/env', ['bash', 'scripts/build.sh', 'dev']);
        builder.stdout.pipe(process.stdout);
        builder.stderr.pipe(process.stderr);
        builder.on('close', code => {
          lock = false;
          if (code === 0) $subscribes.forEach(subscribe => subscribe());
          resolve();
        });
      }
      resolve();
    });
  };

let $subscribes = [];
let server = http
  .createServer(function(req, res) {
    res.setHeader('Cache-Control', 'no-cache');
    const parsedUrl = url.parse(req.url);
    let pathname = `.${parsedUrl.pathname}`;
    pathname = './prod/' + pathname.substr(2);
    const ext = path.parse(pathname).ext || '.html';
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
        res.statusCode = 404;
        res.end(`File ${pathname} not found!`);
        return;
      }
      if (fs.statSync(pathname).isDirectory()) pathname += '/index.html';
      fs.readFile(pathname, function(err, data) {
        if (err) {
          res.statusCode = 500;
          res.end(`Error getting the file: ${err}.`);
        } else {
          res.setHeader('Content-type', map[ext] || 'text/plain');
          res.end(data);
        }
      });
    });
  })
  .listen(port, '0.0.0.0', () => {
    var ss = new sse(server);
    ss.on('connection', client => $subscribes.push(() => client.send('update')));
  });

let watcher = require('hound').watch('src');
watcher.on('create', build);
watcher.on('change', build);
watcher.on('delete', build);

build().then(() => console.log(`\x1b[32mServer listening on http://localhost:${port}\x1b[0m`));
