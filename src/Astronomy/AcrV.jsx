import React from 'react'
import { bindTcorr } from '../Cal/astronomy_bind'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: 1,
      b: 1
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
      </span>
    );
  }

  handle() {
    try {
      const { Print1, Print2 } = bindTcorr(this.state.a, this.state.b)
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
            <th><bc>日</bc>盈縮積</th>
            <th>誤差‱</th>
            <th>改正</th>
            <th><bc>月</bc>遲疾積</th>
            <th>誤差‱</th>
            <th>改正</th>
            <th>實行</th>
            <th>實速</th>
            <th><bc>日月</bc>改正</th>
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
            <th><bc>日</bc>盈縮積</th>
            <th>誤差‱</th>
            <th>改正</th>
            <th><bc>月</bc>遲疾積</th>
            <th>誤差‱</th>
            <th>改正</th>
            <th>實行</th>
            <th><bc>日月</bc>改正</th>
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