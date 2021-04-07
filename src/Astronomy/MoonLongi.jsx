import React from 'react'
import { BindMoonLongiLati } from '../Shangshu-calendar/bind_astronomy'

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
      <div className='ans InputDecompose InputDecompose1'>
        <p></p>
        <table>
          <tr>
            <th></th>
            <th>極白經</th>
            <th>赤經</th>
            <th>去極度</th>
            <th>黃緯</th>
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
        <h3>月極黃經 ⇒ 極白經、赤經、極黃緯</h3>
        <p className='note'>需要輸入此刻入降交點<n>正交</n>交點月的日數、距離冬至的日數。正交至半交：白大於黃，半交至正交：黃大於白。一交點月約 27.2122 日</p>
        {this.input()}
        <button onClick={this.handle} className='button4-2'>月行九道</button>
        {this.result()}
      </div>
    )
  }
}