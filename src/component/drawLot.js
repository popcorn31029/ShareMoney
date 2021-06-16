import React from "react";
import "./drawLot.css";

class App extends React.Component {
  state = {
    input: "",
    result: "",
    loadpage: false,
    startTimer: true
  };
  inputHandle = (e) => {
    this.setState({
      input: e.target.value
    });
    // onChange={e => this.set_account(e.target.value)
  };
  getRandom = () => {
    if (this.state.input > 99) {
      alert("籤數不得大於99");
      this.setState({
        input: 99
      });
    } else if (this.state.input < 1) {
      alert("籤數不得小於1");
      this.setState({
        input: 1
      });
    } else {
      var input = this.state.input;
      var number = Math.floor(Math.random() * input) + 1;
      this.setState({
        result: number,
        loadpage: true
      });
      setTimeout(() => {
        this.setState({ loadpage: false });
      }, 2500);
    }
  };
  render = () => {
    //console.log(this.props.visable);
    //console.log(this.state.loadpage);
    // console.log(this.state.result)
    // if(this.state.loadpage)
    // {setTimeout(() => {
    //   this.setState({ loadPage: false });
    // }, 300);}

    let main = this.state.loadpage ? (
      <div className="loadPage" />
    ) : (
      <div className="box">
        <div
          className="result"
          style={{ display: this.state.result === "" ? "none" : "block" }}
        >
          {this.state.result}
        </div>
        <div
          className="draw_picture"
          style={{ display: this.state.result !== "" ? "none" : "block" }}
        />
        <div className="titleNumber">請輸入抽籤人數</div>
        <br />
        <input
          type="number"
          className="numberInput"
          value={this.state.input}
          onChange={this.inputHandle}
        />
        <br />
        <button onClick={this.getRandom} className="drawlot_button">
          {this.state.result === "" ? "抽籤" : "再抽一次"}
        </button>
      </div>
    );
    return <div>{main}</div>;
  };
}
export default App;
