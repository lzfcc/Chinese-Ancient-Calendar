import React from 'react'
import { BindTcorr } from '../Cal/astronomy_bind'

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
      <div className='ans table2 right' style={{ whiteSpace: "pre-wrap" }}>
        <h3>近地點入轉</h3>
        <table>
          <tr>
            <th></th>
            <th>日盈縮積</th>
            <th>誤差</th>
            <th>月實行度</th>
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
            <th>月實行度</th>
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
        {this.input()}
        <button onClick={this.handle} className='button4-3'>日月之行</button>
        {this.result()}
      </div>
    )
  }
}