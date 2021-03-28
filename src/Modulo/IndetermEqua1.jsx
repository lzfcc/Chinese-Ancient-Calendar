import React from "react"
import { IndetermEqua1 } from "../Shangshu-calendar/modulo_origin"
export default class a extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className="year-select width3">
        <p className="note">
          ax - by = c 等價於 ax ≡ c (mod b)，有解的充要條件：(a,b)|c，卽 c 能被
          a、b的最大公因數整除
        </p>
        <input
          value={this.state.a}
          onChange={(e) => {
            this.setState({ a: e.currentTarget.value });
          }}
        />
        <span>x + </span>
        <input
          value={this.state.b}
          onChange={(e) => {
            this.setState({ b: e.currentTarget.value });
          }}
        />
        <span>y = </span>
        <input
          value={this.state.z}
          onChange={(e) => {
            this.setState({ z: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const { xPrint, yPrint } = IndetermEqua1(
        this.state.a,
        this.state.b,
        this.state.z
      );
      this.setState({
        output1: xPrint,
        output2: yPrint,
      });
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
        <p></p>
        <div>{this.state.output1}</div>
        <div>{this.state.output2}</div>
        <p></p>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h3>一次同餘式　二元一次不定方程</h3>
        {this.input()}
        <button onClick={this.handle} className="button4-8">
          ●○●○
        </button>
        {this.result()}
      </div>
    );
  }
}
