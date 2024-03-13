import React from 'react'
import { bindLon2Lat } from '../Cal/astronomy_bind'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      b: 5
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>距冬至日數</span>
        <input className='width3'
          value={this.state.a}
          onChange={e => {
            this.setState({ a: e.currentTarget.value });
          }}
        />
        <span>冬至小分0.</span>
        <input className='width2'
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
      const Print = bindLon2Lat(this.state.a, this.state.b, this.state.d, this.state.c, this.state.year)
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
      <div className='ans table2 right' style={{ whiteSpace: "pre-wrap" }}>
        <table>
          <tr>
            <th></th>
            <th><bc>赤緯</bc>度</th>
            <th>誤差</th>
            <th>ε度</th>
            <th><bc>日出</bc>刻</th>
            <th>誤差修正</th>
            <th>誤差未修</th>
            <th><bc>晷長</bc>尺</th>
            <th>誤差修正‱</th>
            <th>誤差未修‱</th>
            <th>緯度°</th>
          </tr>
          {(this.state.output || []).map(row => {
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
        <h3>積日 ⇒ 赤緯、日出、晷長</h3>
        {this.input()}
        <button onClick={this.handle} className='button4-2'>longi2lati</button>
        <p>「誤差未修」：與直接由太陽赤緯換算過來的理論值之間的誤差，「誤差修正」：考慮了蒙氣差、太陽視半徑之後的理論值。公式算法的日出都是未修正的</p>
        {this.result()}
      </div>
    )
  }
}