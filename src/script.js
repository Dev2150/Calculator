class App extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      currentOperand: 0,
      display: 0,
      operation: null,
      lastOperand: 0,
      formula: ["0"]
    }
    this.zero = this.zero.bind(this);
    this.one = this.one.bind(this);
    this.two = this.two.bind(this);
    this.three = this.three.bind(this);
    this.four = this.four.bind(this);
    this.five = this.five.bind(this);
    this.six = this.six.bind(this);
    this.seven = this.seven.bind(this);
    this.eight = this.eight.bind(this);
    this.nine = this.nine.bind(this);
    this.addDigit = this.addDigit.bind(this);
    this.clear = this.clear.bind(this);
    this.divide = this.divide.bind(this);
    this.multiply = this.multiply.bind(this);
    this.subtract = this.subtract.bind(this);
    this.add = this.add.bind(this);
    this.equals = this.equals.bind(this);
    this.decimal = this.decimal.bind(this);
  }
  zero() {
    this.addDigit(0);
  }
  one() {
    this.addDigit(1);
  }
  two() {
    this.addDigit(2);
  }
  three() {
    this.addDigit(3);
  }
  four() {
    this.addDigit(4);
  }
  five() {
    this.addDigit(5);
  }
  six() {
    this.addDigit(6);
  }
  seven() {
    this.addDigit(7);
  }
  eight() {
    this.addDigit(8);
  }
  nine() {
    this.addDigit(9);
  }
  getNumberIfLast() {
    let f = this.state.formula;
    const str = f[f.length - 1];
    const num = Number(str);
    const isNumber = str.trim() !== "" && !isNaN(num);
    return isNumber ? Number(str) : null;
  }
  isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }
  addDigit(digit) { 
    let f = this.state.formula;
    if (f.includes("=")) {
      f = ["" + digit];
    }
    else if (this.getNumberIfLast() !== null) {
      if (this.getNumberIfLast() != 0 || this.state.formula[this.state.formula.length - 1].includes("."))
        f = f.map( (str, i) => i === f.length - 1 ? str + digit : str);
      else
        f = ["" + digit];
    }
    else {
      f = [...f, "" + digit];
    }
    this.setState({formula: f, display: f[f.length - 1]});
  }
  clear() {
    this.setState({formula: ["0"]});
    this.setState({display: 0});
  }
  setOperation(operation) {
    this.setState({operation});
    let f = this.state.formula;
    if (f.includes("="))
      f = [f[f.length - 1], operation];
    else if (operation == "-" && this.isNumeric(f[f.length - 2])) 
      f = [...f, operation];
    else if (operation != "-" && f[f.length - 1] == "-" && !this.isNumeric(f[f.length - 2])) 
      f = [...f.slice(0, f.length - 2), operation];
    else if (this.getNumberIfLast() !== null) 
      f = f.concat(operation);
    else if (f.length == 1)
      f = ["0", operation];
    else
      f = f.map( (e, i) => i == f.length - 1 ? operation : e);
    this.setState({formula: f, display: f[f.length - 1]});
  }
  add() {
    this.setOperation('+');
  }
  subtract() {
    this.setOperation('-');
  }
  multiply() {
    this.setOperation('x');
  }
  divide() {
    this.setOperation('/');
  }
  decimal() {
    let f = this.state.formula;
    if (!f[f.length - 1].includes('.'))
      f = f.map( (e, i) => i == f.length - 1 ? e + "." : e);
    
    this.setState({formula: f, display: f[f.length - 1]});
  }
  equals() {
    let f = this.state.formula;
    if (f.includes("="))
      return;
    for (let i = 3; i < f.length; i++) {
      if (f[i - 1] == "-" && !this.isNumeric(f[i - 2]) && f[i - 2] != "-") {
        f = [...f.slice(0, i - 1), "" + -Number(f[i]), ...f.slice(i + 1)];
        console.log(f);
      }
    }
    while (f.indexOf("x") !== f.indexOf("/")) {
      let multIndex = f.indexOf("x");
      let divIndex = f.indexOf("/");
      let i = 0;
      if (multIndex == -1)
        i = divIndex;
      else if (divIndex == -1)
        i = multIndex;
      else
        i = Math.min(divIndex, multIndex);
      
      const prev = Number(f[i - 1]);
      const next = Number(f[i + 1]);
      const product = f[i] == "x" ? prev * next : prev / next;
      f = [...f.slice(0, i - 1), "" + product, ...f.slice(i + 2)];
      console.log(f);
    }
    let total = f[0];
    for (let i = 2; i < f.length; i += 2) {
      if (f[i - 1] == "+")
        total = Number(total) + Number(f[i]);
      else
        total = Number(total) - Number(f[i]);
    }
    this.setState({
      formula: [...this.state.formula, "=", "" + total],
      display: total
    })
  }
  
  render() {
    return (
      <div id="calculator">
        <div id="display-formula" class="block">{this.state.formula.join('')}</div>
        <div id="display">{this.state.display}</div>
        <div id="buttonContainer">
          <button className="button-1x2 red" id="clear" onClick={this.clear}>AC</button>
          <button className="button-1x1 gray" id="divide" onClick={this.divide}>/</button>
          <button className="button-1x1 gray" id="multiply" onClick={this.multiply}>x</button>
          <button className="button-1x1 darkGray" id="seven" onClick={this.seven}>7</button>
          <button className="button-1x1 darkGray" id="eight" onClick={this.eight}>8</button>
          <button className="button-1x1 darkGray" id="nine" onClick={this.nine}>9</button>
          <button className="button-1x1 gray" id="subtract" onClick={this.subtract}>-</button>
          <button className="button-1x1 darkGray" id="four" onClick={this.four}>4</button>
          <button className="button-1x1 darkGray" id="five" onClick={this.five}>5</button>
          <button className="button-1x1 darkGray" id="six" onClick={this.six}>6</button>
          <button className="button-1x1 gray" id="add" onClick={this.add}>+</button>
          <button className="button-1x1 darkGray" id="one" onClick={this.one}>1</button>
          <button className="button-1x1 darkGray" id="two" onClick={this.two}>2</button>
          <button className="button-1x1 darkGray" id="three" onClick={this.three}>3</button>
          <button className="button-2x1 blue" id="equals" onClick={this.equals}>=</button>
          <button className="button-1x2 darkGray" id="zero" onClick={this.zero}>0</button>
          <button className="button-1x1 darkGray" id="decimal" onClick={this.decimal}>.</button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));