import React from "react";
import { Hushigeyuan_Ex_Print } from "../Cal/equa_geometry";
export default class Equa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      E: 24
    };
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>度數</span>
        <input className='width3'
          value={this.state.L}
          onChange={e => {
            this.setState({ L: e.currentTarget.value });
          }}
        />
        <span>黃赤交角</span>
        <input className='width3'
          value={this.state.E}
          onChange={e => {
            this.setState({ E: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Print = Hushigeyuan_Ex_Print(this.state.L, this.state.E)
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
            <th><bc>赤 ⇒ 黃</bc></th>
            <th>黃-赤</th>
            <th>誤差</th>            
            <th><bc>黃 ⇒ 赤</bc></th>
            <th>赤-黃</th>
            <th>誤差</th>
            <th><bc>赤緯</bc></th>
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
        <h3>弧矢割圓術</h3>
        {this.input()}
        <button onClick={this.handle} className='button4-8'>郭守敬</button>
        {this.result()}
      </div>
    );
  }
}
