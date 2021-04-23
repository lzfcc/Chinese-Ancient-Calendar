import React from "react"
import { YearScConvert } from '../Cal/time_era'
export default class a extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: "辛丑"
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className="year-select width2">
        <span>年干支</span>
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
      const Print = YearScConvert(this.state.a);
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
        {this.input()}
        <button onClick={this.handle} className="button4-6">
          SC2year
        </button>
        {this.result()}
      </div>
    );
  }
}
