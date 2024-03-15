import React from "react"
import { Sunzi } from "../Cal/modulo_origin"
export default class a extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sunziIn: "60,130;30,120;20,110;30,100;30,60;30,50;5,25;10,20",
    };
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className="year-select width5">
        <input
          value={this.state.sunziIn}
          onChange={e => {
            this.setState({ sunziIn: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const { Print, DingPrint } = Sunzi(this.state.sunziIn);
      this.setState({ output1: Print, output2: DingPrint });
    } catch (e) {
      alert(e.message);
    }
  }

  result() {
    if (!this.state.output1) {
      return null;
    }
    return (
      <div className="ans">
        <p>{this.state.output1}</p>
        <p>{this.state.output2}</p>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h3>大衍總數術</h3>
        {this.input()}
        <button onClick={this.handle} className="button4-7">
          孫子
        </button><span className="Deci64">.64</span>
        {this.result()}
      </div>
    );
  }
}
