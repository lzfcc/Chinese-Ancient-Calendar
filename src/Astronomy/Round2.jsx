import React from "react";
import { RoundC2LHPrint } from "../Cal/equa_geometry";
export default class Equa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      A: 66.858059
    };
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <p className='note'></p>
        <span> 弦</span>
        <input className='width3'
          value={this.state.A}
          onChange={e => {
            this.setState({ A: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Print = RoundC2LHPrint(this.state.A)
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
            <th>弧</th>
            <th>Δ</th>
            <th>矢</th>
            <th>Δ</th>
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
        <button onClick={this.handle} className='button4-8'>弦2弧矢</button>
        {this.result()}
      </div>
    );
  }
}
