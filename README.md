# kachjs-cli
KachJS - minimalistic TypeScript framework

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
<p (init)="favourites = ['snickers', 'milky way']" (for)="candy of favourites">I love ${candy}!</p>
```
"favourites" variable is initalized with ['snickers', 'milky way'] array, for directive iterates over array's values.
Use "in" instead of "of" to iterate over object's keys, not values.
