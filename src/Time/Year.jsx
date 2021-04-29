import React from "react"
import { EraConvert } from '../Cal/time_era'
export default class a extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className="year-select width2">
        <span>公元年</span>
        <input
          value={this.state.a}
          onChange={(e) => {
            this.setState({ a: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Print = EraConvert(this.state.a);
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
        <h3>公元年 ⇌ 年干支</h3>
        <p className="note">年干支序 = ((公元年 - 3) % 60 + 60) % 60</p>
        {this.input()}
        <button onClick={this.handle} className="button4-6">
          year2SC
        </button>
        {this.result()}
      </div>
    );
  }
}
