import React from 'react'
import { BindTcorr } from '../Cal/bind_astronomy'

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
        <span> 公元年</span>
        <input className='width2'
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
      const { Print1, Print2 } = BindTcorr(this.state.a, this.state.b, this.state.c)
      this.setState({ output1: Print1, output2: Print2 })
    } catch (e) {
      alert(e.message)
    }
  }

  result() {
    if (!this.state.output1) {
      return null
    }
    return (
      <div className='ans table2 right'>
        <h3>近地點入轉</h3>
        <table>
          <tr>
            <th></th>
            <th>日盈縮積</th>
            <th>誤差</th>
            <th>月遲疾積</th>
            <th>誤差</th>
            <th>日行改正</th>
            <th>誤差</th>
            <th>月行改正</th>
            <th>誤差</th>
            <th>日月改正</th>
            <th>入交改正</th>
          </tr>
          {(this.state.output1 || []).map(row => {
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
        <h3>遠地點入轉</h3>
        <table>
          <tr>
            <th></th>
            <th>日盈縮積</th>
            <th>誤差</th>
            <th>月遲疾積</th>
            <th>誤差</th>
            <th>日行改正</th>
            <th>誤差</th>
            <th>月行改正</th>
            <th>誤差</th>
            <th>日月改正</th>
            <th>入交改正</th>
          </tr>
          {(this.state.output2 || []).map(row => {
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
        <h3>積日 ⇒ 日月盈縮修正</h3>
        <p className='note'>入轉日需在一個近點月<n>約27.5545</n>以內。太陽運動很簡單，用一次傅立葉函數就能比較準確地擬合，但有一個問題是，基本上所有的古曆都以冬至爲近日點<n>日速最快</n>，實際上並不是這麼回事，在 1250 年左右纔是正好以冬至爲近日點，往前往後誤差都會越來越大，只有<v>儀天曆</v>對日躔表有意識地做出了修正；月亮運動相當複雜，週期項非常多，而古曆都僅僅以一個近點月爲週期，我們只能用非常粗糙的近似修正來模擬古曆模型。圖中分爲三部分：1、日盈縮積，距冬至日數這麼多天，太陽實際上走了多少度；2、遲疾積，入近點月這麼多天，月亮實際走了多少度；3、日行改正=日盈縮積/(月實行速-日實行速)；4、月行改正=-月遲疾積/(月實行速-日實行速) 。平朔+日行改正+月行改正=定朔，平氣-日盈縮積=定氣。入交定分=入交泛分+太陽改正+0.0785077*月亮改正。理想的分母是(月實行速-日實行速)，但是不同時期的曆法所選分母各不相同，授時曆以月實行速爲分母，唐宋曆法上以月平行速爲分母，魏晉曆法基本上是(月實行速-日平行速)。有 8 部曆法以遠地點<n>月速最慢</n>入轉，其餘都是近地點<n>月速最快</n>入轉。</p>
        {this.input()}
        <button onClick={this.handle} className='button4-3'>日月之行</button>
        {this.result()}
      </div>
    )
  }
}