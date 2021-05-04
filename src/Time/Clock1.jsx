import React from "react"
import { Clock1 } from "../Cal/time_decimal2clock"
export default class a extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: '12',
      b: '0',
      c: '0'
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className="year-select">
        <input className='width1'
          value={this.state.a}
          onChange={e => {
            this.setState({ a: e.currentTarget.value });
          }}
        />
        <span>h </span>
        <input className='width1'
          value={this.state.b}
          onChange={e => {
            this.setState({ b: e.currentTarget.value });
          }}
        />
        <span>m </span>
        <input className='width2'
          value={this.state.c}
          onChange={e => {
            this.setState({ c: e.currentTarget.value });
          }}
        />
        <span>s </span>
      </span>
    );
  }

  handle() {
    try {
      const Print = Clock1(this.state.a, this.state.b, this.state.c);
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
          clock2clock
        </button>
        {this.result()}
      </div>
    );
  }
}
