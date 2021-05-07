import React from "react"
import { GcdLcmGroup } from "../Cal/modulo_gcdlcm"
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
        <input
          value={this.state.GcdLcmIn}
          onChange={e => {
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
        </button><span className="decimal64">.64</span>
        {this.result()}
      </div>
    );
  }
}
