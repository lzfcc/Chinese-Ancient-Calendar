import React from "react";
import { RoundH2LPrint } from "../Cal/equa_geometry";
export default class Equa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {      
      H: 10
    };
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>矢</span>
        <input className='width3'
          value={this.state.H}
          onChange={e => {
            this.setState({ H: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Print = RoundH2LPrint(this.state.H)
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
        <h3>會圓術</h3>
        {this.input()}
        <button onClick={this.handle} className='button4-8'>矢2弧弦</button>
        {this.result()}
      </div>
    );
  }
}
