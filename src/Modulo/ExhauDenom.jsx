import React from "react"
import { ExhauDenom } from "../Cal/modulo_exhaustion"
export default class Exhau extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: 0.5305949,
      b: 0.53059491,
      c: 10,
    };
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className="year-select width3">
        <span>日法 ∈ (</span>
        <input
          value={this.state.a}
          onChange={(e) => {
            this.setState({ a: e.currentTarget.value });
          }}
        />
        <span>,</span>
        <input
          value={this.state.b}
          onChange={(e) => {
            this.setState({ b: e.currentTarget.value });
          }}
        />
        <span>) 結尾</span>
        <input
          value={this.state.c}
          onChange={(e) => {
            this.setState({ c: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Print = ExhauDenom(this.state.a, this.state.b, this.state.c);
      this.setState({ output: Print });
    } catch (e) {
      alert(e.message);
    }
  }

  result() {
    if (!this.state.output) {
      return null;
    }
    return (
      <div className="ans">
        <p>{this.state.output}</p>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h3>第一步、窮舉日法</h3>
        <p className="note">
          暴力窮舉所有符合條件的日法
        </p>
        {this.input()}
        <button onClick={this.handle} className="button4-7">
          暴力
        </button>
        {this.result()}
      </div>
    );
  }
}
