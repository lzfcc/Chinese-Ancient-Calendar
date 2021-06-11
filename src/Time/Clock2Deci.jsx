import React from "react"
import { Clock2Deci } from "../Cal/time_decimal2clock"
export default class a extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: '子正四刻'
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className="year-select width3">
        <span>加時</span>
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
      const Print = Clock2Deci(this.state.a);
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
        {this.input()}
        <button onClick={this.handle} className="button4-1">
        clock2decimal
        </button>
        {this.result()}
      </div>
    );
  }
}
