import React from "react";
import { RoundL2HPrint } from "../Cal/equa_geometry";
export default class Equa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      A: 68.500769,
      c: 365.25
    };
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <p className='note'></p>
        <span> 弧</span>
        <input className='width3'
          value={this.state.A}
          onChange={e => {
            this.setState({ A: e.currentTarget.value });
          }}
        />
        <span> 週天度</span>
        <input className='width3'
          value={this.state.c}
          onChange={e => {
            this.setState({ c: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Print = RoundL2HPrint(this.state.A, this.state.c)
      this.setState({ output: Print })
    } catch (e) {
      alert(e.message)
    }
  }

  result() {
    if (!this.state.output) {
      return null
    }
    return (
      <div className='ans table2'>
        <table>
          <tr>
            <th></th>
            <th>矢</th>
            <th>誤差</th>
            <th>弦</th>
            <th>誤差</th>         
          </tr>
          {(this.state.output || []).map(row => {
            return (
              <tr>
                <td className='RowTitle'>{row.title}</td>
                {row.data.map(d => {
                  return (<td>{d}</td>)
                })}
              </tr>
            )
          })}
        </table>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.input()}
        <button onClick={this.handle} className='button4-8'>弧2矢弦</button>
        {this.result()}
      </div>
    );
  }
}
