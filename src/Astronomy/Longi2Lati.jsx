import React from 'react'
import { BindLongi2Lati } from '../Cal/astronomy_bind'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      b: 5,
      c: 365.244,
      year: 1000,
      d: 34.475,
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
        <span> 緯度</span>
        <input className='width3'
          value={this.state.d}
          onChange={e => {
            this.setState({ d: e.currentTarget.value });
          }}
        />
        <span> 週天</span>
        <input className='width3'
          value={this.state.c}
          onChange={e => {
            this.setState({ c: e.currentTarget.value });
          }}
        />
        <span> 公元年</span>
        <input className='width2'
          value={this.state.year}
          onChange={e => {
            this.setState({ year: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Print = BindLongi2Lati(this.state.a, this.state.b, this.state.d, this.state.c, this.state.year)
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
            <th>去極度</th>
            <th>赤緯</th>
            <th>誤差</th>
            <th>日出</th>
            <th>誤差1</th>
            <th>誤差2</th>
            <th>晷長</th>
            <th>誤差1</th>
            <th>誤差2</th>
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
        <h3>積日 ⇒ 去極度、赤緯、日出、晷長</h3>
        {this.input()}
        <button onClick={this.handle} className='button4-2'>longi2lati</button>
        {this.result()}
      </div>
    )
  }
}