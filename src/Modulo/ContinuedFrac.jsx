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
        <span>分子</span>
        <input
          value={this.state.fracA}
          onChange={e => {
            this.setState({ fracA: e.currentTarget.value });
          }}
        />
        <span> 分母</span>
        <input
          value={this.state.fracB}
          onChange={e => {
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
        {(this.state.output3 || []).length ? (
          <MathJax rawLatex={convertLatex(this.state.output3)} />
        ) : null}
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
        <button onClick={this.handle} className="button4-3">
          ●○●○
        </button><span className="Deci64">.64</span>
        {this.result()}
      </div>
    );
  }
}
