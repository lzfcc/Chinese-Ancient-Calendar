import React from 'react'
import { BindEquator2Ecliptic } from '../Cal/bind_astronomy'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Ecliptic2: 365.2445,
      Ecliptic3: 3400,
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>度數</span>
        <input className='width3'
          value={this.state.Ecliptic1}
          onChange={(e) => {
            this.setState({ Ecliptic1: e.currentTarget.value });
          }}
        />
        <span> 週天</span>
        <input className='width3'
          value={this.state.Ecliptic2}
          onChange={(e) => {
            this.setState({ Ecliptic2: e.currentTarget.value });
          }}
        />
        <span> 公元年</span>
        <input className='width2'
          value={this.state.Ecliptic3}
          onChange={(e) => {
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
      <div className='ans InputDecompose InputDecompose1'>
        <p>{this.state.outputEcliptic1}</p>
        <table>
          <tr>
            <th></th>
            <th>赤轉黃</th>
            <th>誤差</th>
            <th>黃轉赤</th>
            <th>誤差</th>
          </tr>
          {(this.state.outputEcliptic || []).map((row) => {
            return (
              <tr>
                <td className='RowTitle'>{row.title}</td>
                {row.data.map((d) => {
                  return (<td>{d}</td>)
                })}
              </tr>
            )
          })}
        </table>
        <p></p>
      </div>
    )
  }
  
  render() {
    return (
      <div>
        <h3>赤經 ⇌ 極黃經</h3>
        <p className='note'>週天需用該曆法的恆星年長度，可前往源碼倉庫査詢；若不需要絕對精確，可用近似値：四分： .25，魏晉、北系 .2463，南系 .26，唐系 .2565，宋系.257，授時系 .2575。度數從冬至起算，二至到二分：赤大於黃；二分到二至：黃大於赤。崇玄、崇天、明天、觀天、紀元使用各自的週天度，不受輸入的週天度影響。</p>
        {this.input()}
        <button onClick={this.handle} className='button4-6'>ecliptic&equator</button>
        {this.result()}
      </div>
    )
  }
}