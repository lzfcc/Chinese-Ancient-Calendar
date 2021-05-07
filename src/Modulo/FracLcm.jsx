import React from "react"
import { FracLcm1 } from "../Cal/modulo_gcdlcm"
export default class a extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      FracLcmIn: "13,145;114,7;14,57;9,13;8,10",
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className="year-select width5">
        <input
          value={this.state.FracLcmIn}
          onChange={e => {
            this.setState({ FracLcmIn: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const { lcmFracPrint } = FracLcm1(this.state.FracLcmIn);
      this.setState({ output: lcmFracPrint });
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
        <h3>分數最小公倍數</h3>
        {this.input()}
        <button onClick={this.handle} className="button4-6">
          try
        </button><span className="decimal64">.64</span>
        {this.result()}
      </div>
    );
  }
}
