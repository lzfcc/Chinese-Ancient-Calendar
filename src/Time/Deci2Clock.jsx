import React from "react"
import { BindClock1 } from "../Cal/time_decimal2clock"
export default class a extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className="year-select width3">
        <span>日分 0.</span>
        <input
          value={this.state.a}
          onChange={e => {
            this.setState({ a: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Print = BindClock1(this.state.a);
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
      <div className="ans table2">
        <table>
          {(this.state.output || []).map(row => {
            return (
              <tr>
                <td className="RowTitle">{row.title}</td>
                <td>{row.data}</td>
              </tr>
            );
          })}
        </table>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h3>時刻 ⇌ 辰刻加時</h3>
        {this.input()}
        <button onClick={this.handle} className="button4-1">
          decimal2clock
        </button>
        {this.result()}
      </div>
    );
  }
}