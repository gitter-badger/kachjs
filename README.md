# kachjs-cli
KachJS - minimalistic TypeScript framework

## Dependencies
* sass
```
npm i -g sass
```
* TypeScript
```
npm i -g typescript
```
* Prettier
```
npm i -g prettier
```
## Quick start
Clone this repository:
```
git clone https://github.com/zolbooo/kachjs-cli.git
```
Go to the directory and install package globally:
```
cd kachjs-cli
npm install -g
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
New folder called my-awesome-component will be created.
Make changes in app-root.html:
```
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
#### (listen:<attribute>), (bind:<attribute>) - One way binding
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