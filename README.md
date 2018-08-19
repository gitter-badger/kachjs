# KachJS - minimalistic TypeScript framework
[![npm version](https://badge.fury.io/js/kachjs.svg)](https://www.npmjs.com/package/kachjs)
[![Gitter Chat](https://img.shields.io/badge/gitter-join_the_chat-4cc61e.svg)](https://gitter.im/kachjs/Lobby)
## Quick start
Install this package:
```
npm i -g kachjs
```
Create new project:
```
kach new quick-start
```
Start development server:
```
kach serve
```
Edit src/components/app-root and open browser in http://localhost:9000

## CLI
For CLI usage you can use command ```kach```
## Reference
### Components
You can create components with custom template and css.
```
kach component my-awesome-component
```

Shorthand: ```kach c my-awesome-component```

New folder called my-awesome-component will be created.
Now you can use it in app-root.html:
```html
<my-awesome-component></my-awesome-component>
```
### Attributes [directives]
#### (bind) - Two way binding
Example:
```html
<h1 (bind)="name"></h1>
<input (bind)="name">
```
In this example h1 inner text depends on variable "name", which is binded to the input.
#### (listen) - One way binding
```html
<h1 (listen)="name"></h1>
<input (bind)="name">
```
In this example header listens for changes in "name" variable. Works same as previous example.
#### (listen:`<attribute>`), (bind:`<attribute>`) - Data binding
```html
<img (listen:src)="myphoto">
<input (listen:placeholder)="placeholder">
```
These attributes bind variable to defined attribute of calling element.
#### (model) - One way binding
```html
<h1 (listen)="name"></h1>
<input (model)="name">
```
This example's input listens for changes and only modifies "name" variable.
#### (init) - Initialize value
```html
<h1 (listen)="name"></h1>
<input (init)="name = 'hi there!'" (bind)="name">
```
In this example "name" varibale is initialized  with value 'hi there!'.
#### (for) - Iterate over array or object
Example:
```html
<div (init)="favourites = ['snickers', 'milky way']" (for)="candy of favourites"><div>I love ${candy}!</div></div>
```
"favourites" variable is initalized with ['snickers', 'milky way'] array, for directive iterates over array's values.
Use "in" instead of "of" to iterate over object's keys, not values.
To access iterated value, use variable name in "${}" in html, e.g. ${candy}.
Notice that scope of "${}" value is isolated. That means you can access only this variable and json() function;
##### json - Convert object to JSON
Usage:
```html
<div (init)="favourites = [{'snickers': true}, {'milky way': false}]" (for)="candy of favourites"><div>${json(candy)}</div></div>
```
Output:
```
{"snickers":true}
{"milky way":false}
```
#### (if) - Show element conditionnally
```html
<p (if)="2 + 2 === 5">Wow, 2 + 2 is 5</p>
<p (if)="2 + 2 === 4">As always, 2 + 2 is 4</p>
<p (init)="truth = true" (if)="truth">Everything is truth</p>
```
#### (ifn) - Hide element conditionnally
```html
<p (ifn)="{{2 + 2 === 5}}">2 + 2 is not 5</p>
<p (ifn)="{{2 + 2 === 4}}">2 + 2 is 4, it's true</p>
<p (init)="truth = false" (ifn)="truth">Everything is false</p>
```
### Advanced
#### Eval {{expression}} syntax
```html
<p>This expression is precomputed: {{2 + 2}}</p>
<p (init)="x = 4 + 4">This expression is binded to "x" variable: {{x}}</p>
```
KachJS defines and uses
```
$data
$subscribes
```
global variables. $data is used to store variables.
Example:
```html
<h1 (init)="title = 'Add more A: '">{{title}}</h1>
<button (click)="$data['title'] += 'A'">Add A here</button>
```
In this example $data['title'] is initialized with value 'Add more A: ' and then button click adds 'A' to the var.
#### Reactiveness
KachJS reactiveness mechanism is quite simple: item is initialized in $data variable with setter invoking all functions in corresponding $subscribes object. To subscribe on change of some variable in $data, push callback in $subscribes or use subscribe function. Example:
```html
<!-- app-root.html -->
<h1 (init)="title = 'hello!'" (listen)="title"></h1>
```
component.ts:
```
/// <reference path="../../kachjs/init.ts"/>
/// <reference path="../../kachjs/component.ts"/>
@Component('app-root')
class AppRootComponent extends KachComponent {
  constructor() {
    super('app-root');
    setTimeout(() => {
      $data['title'] = 'hi there!';
    }, 500);
    subscribe('title', () => console.log('title has changed!'));
  }
}
```
#### Functions
##### $http - send asynchronous HTTP request
```
interface HTTPRequest {
  headers?: { [key: string]: string };

  url: string;
  method: string;

  body?: any;
  parseJSON?: boolean;
}

function $http<T>(requestData: HTTPRequest): Promise<T>
```
$http sends HTTP request and returns promise with response body. If parseJSON is set, response body is parsed and returned in Promise, otherwise string casted to T is returned.
##### $element - query elements using selector
```
function $element(selector: string)
```
Example calls:
```
$element('#header')
$element('.active')
$element('div')
```
Returns: `KachModifiable`
Fields:
```
KachModifiable.style(stylename: string, value: string) // Set style of element(s)
KachModifiable.class(classname: string) // Toggle class of element(s)
KachModifiable.el // Element, element list or null matching selector
```
##### subscribe - listen for changes in the variable
```
function subscribe(objname: string, callback: Function)
```
subscribe adds callback invoked on `$data[objname]`'s change.
#### Comparation to other frameworks
##### Counter app
KachJS
```html
<h1 (init)="count = 0">{{count}}</h1>
<button (click)="$data['count']--">-</button>
<button (click)="$data['count']++">+</button>
```
React
```
import React from "react";
import ReactDOM from "react-dom";

class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = { count: 0};
    }

    down(value) {
        this.setState(state => ({ count: state.count - value }));
    }
    up(value) {
        this.setState(state => ({ count: state.count + value }));
    }

    render() {
        return (
            <div>
                <h1>{this.state.count}</h1>
                <button onClick = {() => this.down(1)}>-</button>
                <button onClick = {() => this.up(1)}>+</button>
            </div>
        );
    }
}
ReactDOM.render(<Counter />, document.querySelector("#app"));
```
Vue
```
import Vue from "vue";

new Vue({
    data: { count: 0 },

    methods: {
        down: function(value) {
            this.count -= value;
        },
        up: function(value) {
            this.count += value;
        }
    },

    render: function(h) {
        return(
            <div>
                <h1>{this.count}</h1>
                <button onClick={() => this.down(1)}>-</button>
                <button onClick={() => this.up(1)}>+</button>
            </div>
        );
    },

    el: "#app"
});
```
Hyperapp
```
import { h, app } from "hyperapp";

const state = {
    count: 0
};

const actions = {
    down: value => state => ({ count: state.count - value}),
    up: value => state => ({ count: state.count + value})
};

const view = (state, actions) => (
    <div>
        <h1>{state.count}</h1>
        <button onclick={() => actions.down(1)}>-</button>
        <button onclick={() => actions.up(1)}>+</button>
    </div>
);

app(state, actions, view, document.querySelector("#app"));
```
Svelte
```
<div>
  <h1>{count}</h1>
  <button on:click="set({count: count - 1})">-</button>
  <button on:click="set({count: count + 1})">+</button>
</div>
```
#### Asynchronous app
KachJS

app-root.html
```html
<button (click)="getPosts()">Get posts</button>
<div (for)="post of posts">
    <div id="${post.id}">
        <h2><font color="#3AC1EF">${post.title}</font></h2>
        <p>${post.body}</p>
    </div>
</div>
```
component.ts
```
/// <reference path="../../kachjs/init.ts"/>
/// <reference path="../../kachjs/component.ts"/>
@Component('app-root')
class AppRootComponent extends KachComponent {
  constructor() {
    super('app-root');
    $data['posts'] = [];
  }
}

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}
function getPosts() {
  $http<Post[]>({ url: 'https://jsonplaceholder.typicode.com/posts', method: 'GET', parseJSON: true }).then(data => {
    $data['posts'] = data;
  });
}
```
React
```
import React from "react";
import ReactDOM from "react-dom";

class PostViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { posts: [] };
    }

    getData() {
        fetch(`https://jsonplaceholder.typicode.com/posts`)
        .then(response => response.json())
        .then(json => {
            this.setState(state => ({ posts: json}));
        });
    }

    render() {
        return (
            <div>
                <button onClick={() => this.getData()}>Get posts</button>
                {this.state.posts.map(post => (
                    <div key={post.id}>
                        <h2><font color="#3AC1EF">{post.title}</font></h2>
                        <p>{post.body}</p>
                    </div>
                ))}
            </div>
        );
    }
}

ReactDOM.render(<PostViewer />, document.querySelector("#app"));
```
Vue
```
import Vue from "vue";

new Vue({
    data: { posts: [] },

    methods: {
        getData: function(value) {
            fetch(`https://jsonplaceholder.typicode.com/posts`)
            .then(response => response.json())
            .then(json => {
                this.posts = json;
            });
        }
    },

    render: function(h) {
        return (
            <div>
                <button onClick={() => this.getData()}>Get posts</button>
                {this.posts.map(post => (
                    <div key={post.id}>
                        <h2><font color="#3AC1EF">{post.title}</font></h2>
                        <p>{post.body}</p>
                    </div>
                ))}
            </div>
        );
    },

    el: "#app"
});
```
Hyperapp
```
import { h, app } from "hyperapp";

const state = {
    posts: []
};

const actions = {
    getData: () => (state, actions) => {
        fetch(`https://jsonplaceholder.typicode.com/posts`)
        .then(response => response.json())
        .then(json => {
            actions.getDataComplete(json);
        });
    },
    getDataComplete: data => state => ({ posts: data })
};

const view = (state, actions) => (
    <div>
        <button onclick={() => actions.getData()}>Get posts</button>
        {state.posts.map(post => (
            <div key={post.id}>
                <h2><font color="#3AC1EF">{post.title}</font></h2>
                <p>{post.body}</p>
            </div>
        ))}
    </div>
);

app(state, actions, view, document.querySelector("#app"));
```
Svelte
```
<div>
  <button on:click="getData()">Get posts</button>
  {#each posts as {title, body}}
  <div>
    <h2><font color="#3AC1EF">{title}</font></h2>
    <p>{body}</p>
  </div>
  {/each}
</div>

<script>
  export default {
    methods: {
      getData() {
        fetch('https://jsonplaceholder.typicode.com/posts')
          .then(res => res.json())
          .then(posts => this.set({ posts }));
      }
    }
  };
</script>
```