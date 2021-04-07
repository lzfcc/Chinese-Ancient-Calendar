import React from 'react'
import { BindAcrV } from '../Shangshu-calendar/bind_astronomy'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
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
      </span>
    );
  }

  handle() {
    try {
      const Print = BindAcrV(this.state.a, this.state.b)
      this.setState({ output: Print})
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
            <th>線性</th>
            <th>二次</th>
            <th>三次</th>
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
        <p className='note'>入轉日需在一個近點月<n>約27.5545</n>以內。計算出的日數直接加在平朔平氣上卽可。表格各標題表示使用幾次內插</p>
        {this.input()}
        <button onClick={this.handle} className='button4-3'>日月之行</button>
        {this.result()}
      </div>
    )
  }
}