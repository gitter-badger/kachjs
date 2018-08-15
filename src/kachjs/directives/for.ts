class KachForDirective {
  loopData: string[];
  loopDirective: string;

  constructor(private el: HTMLElement, private loop: string) {
    this.loopData = loop.split(' ');
    this.loopDirective = this.el.innerHTML;

    if (this.loopData.length !== 3 || !this.loopData[0] || !this.loopData[1] || !this.loopData[2]) this.error();
    else {
      bind(this.loopData[2]);
      this.render();
      $subscribes[this.loopData[2]].push(() => this.render());
    }
  }
  private render() {
    let newChild = document.createElement('div');
    switch (this.loopData[1]) {
      case 'in':
        for (let val in $data[this.loopData[2]]) {
          let newItem = document.createElement('div');
          newItem.innerHTML = this.loopDirective.replace(`\${${this.loopData[0]}}`, val.toString());
          newChild.appendChild(newItem);
        }
        break;
      case 'of':
        for (let val of $data[this.loopData[2]]) {
          let newItem = document.createElement('div');
          newItem.innerHTML = this.loopDirective.replace(`\${${this.loopData[0]}}`, val.toString());
          newChild.appendChild(newItem);
        }
        break;
      default:
        this.error();
        break;
    }
    this.el.innerHTML = newChild.innerHTML;
  }
  private error() {
    console.error(`Failed to parse (for)="${this.loop}"`);
  }
}
