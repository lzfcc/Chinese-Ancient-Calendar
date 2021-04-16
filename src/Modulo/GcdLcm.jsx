import React from "react"
import { GcdLcmGroup } from "../Shangshu-calendar/modulo_gcdlcm"
export default class a extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className="year-select width5">
        <p className="note">
          求多個整數或小數的最大公因數 gcd、最小公倍數 lcm
          <span className="decimal64">.64</span>
        </p>
        <input
          value={this.state.GcdLcmIn}
          onChange={(e) => {
            this.setState({ GcdLcmIn: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const { Print } = GcdLcmGroup(this.state.GcdLcmIn);
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
      <div className="ans" style={{ whiteSpace: "pre-wrap" }}>
        <p>{this.state.output}</p>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h3>最大公因數　最小公倍數</h3>
        {this.input()}
        <button onClick={this.handle} className="button4-6">
          try
        </button>
        {this.result()}
      </div>
    );
  }
}
