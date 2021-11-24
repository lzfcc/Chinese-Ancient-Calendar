import React from 'react'
import { BindEqua2Eclp } from '../Cal/astronomy_bind'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Eclp2: 365.244,
      Eclp3: 1000,
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>度數</span>
        <input className='width3'
          value={this.state.Eclp1}
          onChange={e => {
            this.setState({ Eclp1: e.currentTarget.value });
          }}
        />
        <span> 週天</span>
        <input className='width3'
          value={this.state.Eclp2}
          onChange={e => {
            this.setState({ Eclp2: e.currentTarget.value });
          }}
        />
        <span> 公元年</span>
        <input className='width2'
          value={this.state.Eclp3}
          onChange={e => {
            this.setState({ Eclp3: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const { Range, Print } = BindEqua2Eclp(this.state.Eclp1, this.state.Eclp2, this.state.Eclp3)
      this.setState({ outputEclp: Print, outputEclp1: Range })
    } catch (e) {
      alert(e.message)
    }
  }

  result() {
    if (!this.state.outputEclp) {
      return null
    }
    return (
      <div className='ans table2 right'>
        <p>{this.state.outputEclp1}</p>
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
          {(this.state.outputEclp || []).map(row => {
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
        <h3>赤經 ⇌ 極黃經</h3>
        {this.input()}
        <button onClick={this.handle} className='button4-6'>Eclp&Equa</button>
        {this.result()}
      </div>
    )
  }
}