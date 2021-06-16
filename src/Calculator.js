import React from "react";

class App extends React.Component {
  state = {
    equation: "",
    result: 0,
    previousKey: "",
    dotNumberOn: true,
    dotOperatorOn: true
  };

  onButtonPress = (event) => {
    let equation = this.state.equation;
    const pressedButton = event.target.innerHTML;
    const preKey = this.state.previousKey;
    const dotNumOn = this.state.dotNumberOn;
    const dotOpeOn = this.state.dotOperatorOn;
    var limitedresult = 0;
    if (pressedButton === "C") return this.clear();
    /**************************************數字*****************************************/ else if (
      pressedButton >= "1" &&
      pressedButton <= "9"
    ) {
      if (equation === "0") {
        equation = pressedButton;
        this.setState({ previousKey: pressedButton });
      } else if (
        (equation.substr(equation.length - 1, 1) === "0" &&
          equation.substr(equation.length - 2, 1) === "+") ||
        (equation.substr(equation.length - 1, 1) === "0" &&
          equation.substr(equation.length - 2, 1) === "-") ||
        (equation.substr(equation.length - 1, 1) === "0" &&
          equation.substr(equation.length - 2, 1) === "×")
      ) {
        equation = equation.substr(0, equation.length - 1);
        equation += pressedButton;
        this.setState({ previousKey: pressedButton });
      } else {
        equation += pressedButton;
        this.setState({ previousKey: pressedButton });
      }
      if (dotOpeOn === true) {
        this.setState({ dotNumberOn: true });
      }
    } else if (
      /***********************************0******************************************/
      pressedButton === "0" ||
      pressedButton === "00"
    ) {
      if (
        equation.substr(equation.length - 1, 1) === "+" ||
        equation.substr(equation.length - 1, 1) === "-" ||
        equation.substr(equation.length - 1, 1) === "×" ||
        equation === ""
      ) {
        equation += "0";
        this.setState({ previousKey: pressedButton });
      } else if (
        (equation.substr(equation.length - 1, 1) === "0" &&
          equation.substr(equation.length - 2, 1) === "+") ||
        (equation.substr(equation.length - 1, 1) === "0" &&
          equation.substr(equation.length - 2, 1) === "-") ||
        (equation.substr(equation.length - 1, 1) === "0" &&
          equation.substr(equation.length - 2, 1) === "×")
      ) {
        equation = equation.substr(0, equation.length - 1);
        equation += "0";
        this.setState({ previousKey: pressedButton });
      } else if (equation !== "0") {
        equation += pressedButton;
        this.setState({ previousKey: pressedButton });
      }
      if (dotOpeOn === true) {
        this.setState({ dotNumberOn: true });
      }
    } else if (
      /***********************************小數點******************************************/
      pressedButton === "." &&
      equation !== "" &&
      preKey !== "+" &&
      preKey !== "-" &&
      preKey !== "×" &&
      dotNumOn === true &&
      dotOpeOn === true
    ) {
      equation += pressedButton;
      this.setState({ previousKey: pressedButton });
      this.setState({ dotNumberOn: false });
      this.setState({ dotOperatorOn: false });
    } else if (
      /************************************運算*******************************************/
      ["+", "-", "×"].indexOf(pressedButton) !== -1 &&
      equation !== "" &&
      preKey !== "."
    ) {
      if (preKey === "+" || preKey === "-" || preKey === "×") {
        equation = equation.substr(0, equation.length - 1);
        equation += pressedButton;
      } else if (preKey === "=") {
        equation = this.state.result;
        equation += "" + pressedButton + "";
      } else {
        equation += "" + pressedButton + "";
      }
      this.setState({ previousKey: pressedButton });
      this.setState({ dotOperatorOn: true });
    } else if (pressedButton === "=" && equation !== "") {
      /**************************************等號*****************************************/
      try {
        equation = equation.split("×").join("*");
        //console.log(equation);
        const evalResult = eval(equation);
        const result = Number.isInteger(evalResult)
          ? evalResult
          : Math.ceil(evalResult);
        if (result >= 1000000000000) {
          limitedresult = this.state.result;
          alert("只能計算12位金額");
        } else if (result < 0) {
          alert("金額請大於0");
          return this.clear();
        } else {
          limitedresult = result;
        }
        this.props.set_total_amount(limitedresult);
        this.setState({ result: limitedresult });
      } catch (error) {
        alert("無效運算");
      }
      this.setState({ previousKey: pressedButton });
    } else if (pressedButton === "←") {
      /***************************************刪除****************************************/
      equation = equation.trim();
      var lastChar = equation.substr(equation.length - 1, 1);
      //console.log(this.state.dotNumberOn);
      //console.log(this.state.dotOperatorOn);
      if (lastChar >= "0" && lastChar <= "9") {
        equation = equation.split("").reverse().join("");

        if (
          !equation.includes("+") &&
          !equation.includes("-") &&
          !equation.includes("×")
        ) {
          if (equation.includes(".")) {
            this.setState({ dotNumberOn: false });
          }
        } else {
          var a = equation.indexOf("+");
          if (a < 0) a += equation.length;
          var b = equation.indexOf("-");
          if (b < 0) b += equation.length;
          var c = equation.indexOf("×");
          if (c < 0) c += equation.length;
          var min = Math.min(a, b, c);
          let eq = equation.substr(0, min - 1);
          if (eq.includes(".")) {
            this.setState({ dotNumberOn: false });
          }
        }
        equation = equation.split("").reverse().join("");
      } else if (lastChar === "+" || lastChar === "-" || lastChar === "×") {
        equation = equation.split("").reverse().join("");
        //console.log(equation);

        if (
          equation.includes("+") ||
          equation.includes("-") ||
          equation.includes("×")
        ) {
          var d = equation.indexOf("+");
          if (d <= 0) d += equation.length;
          var e = equation.indexOf("-");
          if (e <= 0) e += equation.length;
          var f = equation.indexOf("×");
          if (f <= 0) f += equation.length;
          var minn = Math.min(d, e, f);
          let eq = equation.substr(1, minn - 1);
          if (!eq.includes(".")) {
            this.setState({ dotOperatorOn: true });
          } else {
            this.setState({ dotOperatorOn: false });
          }
        } else {
          if (!equation.includes(".")) {
            this.setState({ dotOperatorOn: true });
          } else {
            this.setState({ dotOperatorOn: false });
          }
        }
        equation = equation.split("").reverse().join("");
      } else if (lastChar === ".") {
        this.setState({ dotNumberOn: true });
        this.setState({ dotOperatorOn: true });
      }
      //console.log(equation.substr(equation.length - 1, 1));
      equation = equation.substr(0, equation.length - 1);
      this.setState({ previousKey: equation.substr(equation.length - 1, 1) });
    } else if (pressedButton === "⊗") {
      /***************************************關閉****************************************/
      this.setState({ equation: "", result: 0 });
      this.setState({ previousKey: "" });
      this.setState({ dotNumberOn: true });
      this.setState({ dotOperatorOn: true });
      this.props.openCalculator();
    }
    if (pressedButton !== "⊗") {
      equation = equation.split("*").join("×");
      this.setState({ equation: equation });
    }
  };

  clear() {
    this.setState({ equation: "", result: 0 });
    this.setState({ previousKey: "" });
    this.setState({ dotNumberOn: true });
    this.setState({ dotOperatorOn: true });
  }

  render() {
    return (
      <div className="calculator">
        <Screen equation={this.state.equation} result={this.state.result} />
        <Keypad
          onButtonPress={this.onButtonPress}
          onKeyDown={this.onKeyPress}
        />
      </div>
    );
  }
}

const ResultScreen = (props) => (
  <div className="result-screen">{props.children}</div>
);

const ComputationScreen = (props) => (
  <div className="computation-screen">{props.children}</div>
);

const Screen = (props) => (
  <section className="screen">
    <ResultScreen>{props.result}</ResultScreen>
    <ComputationScreen>{props.equation}</ComputationScreen>
  </section>
);

const KeypadRow = (props) => (
  <div className="keypad__row">{props.children}</div>
);

const Button = (props) => {
  const classes = ["key_btn"];

  if (typeof props !== "undefined" && typeof props.type !== "undefined")
    classes.push("btn--" + props.type);

  return (
    <button className={classes.join(" ")} onClick={props.onButtonPress}>
      {props.children}
    </button>
  );
};

const LargeButton = (props) => <Button type="large" {...props} />;

const Keypad = (props) => (
  <section className="keypad">
    <KeypadRow>
      <Button type="clear" onButtonPress={props.onButtonPress}>
        C
      </Button>
      <Button type="backspace" onButtonPress={props.onButtonPress}>
        &larr;
      </Button>
      <Button type="close" onButtonPress={props.onButtonPress}>
        &otimes;
      </Button>
    </KeypadRow>

    <KeypadRow>
      <Button onButtonPress={props.onButtonPress}>7</Button>
      <Button onButtonPress={props.onButtonPress}>8</Button>
      <Button onButtonPress={props.onButtonPress}>9</Button>
      <Button type="operator" onButtonPress={props.onButtonPress}>
        +
      </Button>
    </KeypadRow>

    <KeypadRow>
      <Button onButtonPress={props.onButtonPress}>4</Button>
      <Button onButtonPress={props.onButtonPress}>5</Button>
      <Button onButtonPress={props.onButtonPress}>6</Button>
      <Button type="operator" onButtonPress={props.onButtonPress}>
        -
      </Button>
    </KeypadRow>

    <KeypadRow>
      <Button onButtonPress={props.onButtonPress}>1</Button>
      <Button onButtonPress={props.onButtonPress}>2</Button>
      <Button onButtonPress={props.onButtonPress}>3</Button>
      <Button type="operator" onButtonPress={props.onButtonPress}>
        ×
      </Button>
    </KeypadRow>

    <KeypadRow>
      <Button onButtonPress={props.onButtonPress}>.</Button>
      <Button onButtonPress={props.onButtonPress}>0</Button>
      <Button onButtonPress={props.onButtonPress}>00</Button>
      <LargeButton onButtonPress={props.onButtonPress}>=</LargeButton>
    </KeypadRow>
  </section>
);

export default App;
