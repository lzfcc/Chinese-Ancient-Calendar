import React from "react";
import { ContinuedFrac } from "../Cal/modulo_continued-frac";
import MathJax from "../Mathjax";
import { convertLatex } from "../utils";
export default class a extends React.Component {
  constructor(props) {
    super(props);
    this.state = { fracA: 399, fracB: 752 };
    this.handle = this.handle.bind(this);
  }
  input() {
    return (
      <span className="year-select width4">
        <p className="note">給定一個分數，求其連分數、各漸進連分數。非常適合與調日法參照</p>
        <span>分子</span>
        <input
          value={this.state.fracA}
          onChange={(e) => {
            this.setState({ fracA: e.currentTarget.value });
          }}
        />
        <span> 分母</span>
        <input
          value={this.state.fracB}
          onChange={(e) => {
            this.setState({ fracB: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const { z, zPrint, Result } = ContinuedFrac(
        this.state.fracA,
        this.state.fracB
      );
      this.setState({
        output1: zPrint,
        output2: Result,
        output3: z,
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
      <div className="ans" style={{ whiteSpace: "pre-wrap" }}>
        <p>{this.state.output1}</p>
        <p>{this.state.output2}</p>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h3>連分數　漸進分數</h3>
        {this.input()}
        <span className="decimal64">.64</span>
        <button onClick={this.handle} className="button4-3">
          快快快
        </button>
        {(this.state.output3 || []).length > 0 ? (
          <MathJax rawLatex={convertLatex(this.state.output3)} />
        ) : null}
        {this.result()}
      </div>
    );
  }
}
