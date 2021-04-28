import React from "react"
import { Jd2Date1 } from '../Cal/time_jd2date'
export default class a extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className="year-select width4">
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
      const { Result } = Jd2Date1(this.state.a);
      this.setState({ output: Result });
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
        <h3>儒略日 ⇌ 日期</h3>
        <p className="note">日干支序 = mod(儒略日-11, 60) + 1</p>
        {this.input()}
        <button onClick={this.handle} className="button4-8">
          JD2date
        </button>
        <span className="decimal64">.64</span>
        {this.result()}
      </div>
    );
  }
}
