import React from 'react'
import { BindAcrV } from '../Shangshu-calendar/bind_astronomy'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      c: 1247,
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>入轉日</span>
        <input className='width3'
          value={this.state.a}
          onChange={(e) => {
            this.setState({ a: e.currentTarget.value });
          }}
        />
        <span> 距冬至日數</span>
        <input className='width3'
          value={this.state.b}
          onChange={(e) => {
            this.setState({ b: e.currentTarget.value });
          }}
        />
        <span> 公元年</span>
        <input className='width2'
          value={this.state.c}
          onChange={(e) => {
            this.setState({ c: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Print = BindAcrV(this.state.a, this.state.b, this.state.c)
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
      <div className='ans InputDecompose InputDecompose1'>
        <p></p>
        <table>
          <tr>
            <th></th>
            <th>日盈縮積</th>
            <th>誤差</th>
            <th>月遲疾積</th>
            <th>誤差</th>
            <th>線性改正</th>
            <th>高次改正</th>
            <th>誤差</th>
          </tr>
          {(this.state.output || []).map((row) => {
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
        <h3>積日 ⇒ 日月盈縮修正</h3>
        <p className='note'>入轉日需在一個近點月<n>約27.5545</n>以內。計算出的日數直接加在平朔平氣上卽可。表格各標題表示使用幾次內插。日月速度的修正。太陽運動很簡單，用一次傅立葉函數就能比較準確地擬合。而月亮運動相當複雜，只能用近似修正來模擬古曆的模型。圖中分為三部分：1、日盈縮積，距冬至日數這麼多天，太陽實際上走了多少度。第二項月遲疾積，入近點月這麼多天，月亮實際走了多少度。第三項日月改正=(日盈縮積-月遲疾積)/(月實行速-日實行速)，第三項算出來直接加在平朔上就是定朔。</p>
        {this.input()}
        <button onClick={this.handle} className='button4-3'>日月之行</button>
        {this.result()}
      </div>
    )
  }
}