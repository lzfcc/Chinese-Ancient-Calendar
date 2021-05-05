import React from 'react'
import { BindMoonLongiLati } from '../Cal/bind_astronomy'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: 1.25351,
      b: 45.15
    }
    this.handle = this.handle.bind(this)
  }
  input() {
    return (
      <span className='year-select'>
        <span>入交日</span>
        <input className='width3'
          value={this.state.a}
          onChange={e => {
            this.setState({ a: e.currentTarget.value });
          }}
        />
        <span> 距冬至日數</span>
        <input className='width3'
          value={this.state.b}
          onChange={e => {
            this.setState({ b: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Print = BindMoonLongiLati(this.state.a, this.state.b)
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
      <div className='ans table2 right'>
        <table>
          <tr>
            <th></th>
            <th>極黃經</th>       
            <th>赤經</th>
            <th>赤-黃</th>
            <th>極白經</th>
            <th>白-黃</th>
            <th>赤白差</th>
            <th>去極度</th>
            <th>黃緯</th>
          </tr>
          {(this.state.output || []).map(row => {
            return (
              <tr style={{ whiteSpace: "pre-wrap" }}>
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
        <h3>月極黃經 ⇒ 極白經、赤經、極黃緯</h3>
        <p className='note'>需要輸入此刻入降交點<n>正交</n>交點月的日數、距離冬至的日數。距離冬至日數會加上日躔、轉換爲黃道度，再進行接下來的計算。正交至半交：白大於黃，半交至正交：黃大於白。一交點月約 27.21222 日。<v>大衍</v>月黃緯表用到了三次內插，前半段<code>Δ = 171, -24, -8</code>後半段<code>Δ = -75, -40, 8</code>。<v>紀元</v>第一行赤道度以九道術求得，第二行以黃赤轉換公式求得。赤白差一欄，除了紀元，都是赤道-白道，紀元較爲特殊，日月同名：赤白差=黃赤差+黃白差，異名：赤白差=黃赤差-黃白差</p>
        {this.input()}
        <button onClick={this.handle} className='button4-8'>月行九道</button>
        {this.result()}
      </div>
    )
  }
}