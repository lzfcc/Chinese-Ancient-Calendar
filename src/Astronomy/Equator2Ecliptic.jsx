import React from 'react'
import { BindEquator2Ecliptic } from '../Cal/bind_astronomy'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Ecliptic2: 365.244,
      Ecliptic3: 1000,
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>度數</span>
        <input className='width3'
          value={this.state.Ecliptic1}
          onChange={e => {
            this.setState({ Ecliptic1: e.currentTarget.value });
          }}
        />
        <span> 週天</span>
        <input className='width3'
          value={this.state.Ecliptic2}
          onChange={e => {
            this.setState({ Ecliptic2: e.currentTarget.value });
          }}
        />
        <span> 公元年</span>
        <input className='width2'
          value={this.state.Ecliptic3}
          onChange={e => {
            this.setState({ Ecliptic3: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const { Range, Print } = BindEquator2Ecliptic(this.state.Ecliptic1, this.state.Ecliptic2, this.state.Ecliptic3)
      this.setState({ outputEcliptic: Print, outputEcliptic1: Range })
    } catch (e) {
      alert(e.message)
    }
  }

  result() {
    if (!this.state.outputEcliptic) {
      return null
    }
    return (
      <div className='ans table2 right'>
        <p>{this.state.outputEcliptic1}</p>
        <table>
          <tr>
            <th></th>
            <th>赤→黃</th>
            <th>誤差</th>
            <th>黃→赤</th>
            <th>誤差</th>
          </tr>
          {(this.state.outputEcliptic || []).map((row) => {
            return (
              <tr>
                <td className='RowTitle'>{row.title}</td>
                {row.data.map(d =>  {
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
        <p className='note'>度數從冬至起算，二至到二分：赤大於黃；二分到二至：黃大於赤</p>
        {this.input()}
        <button onClick={this.handle} className='button4-6'>ecliptic&equator</button>
        {this.result()}
      </div>
    )
  }
}