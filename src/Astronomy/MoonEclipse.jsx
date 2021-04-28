import React from 'react'
import { BindMoonEclipse } from '../Cal/bind_astronomy'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: 0.1
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select width3'>
        <span>入交泛日</span>
        <input
          value={this.state.a}
          onChange={(e) => {
            this.setState({ a: e.currentTarget.value });
          }}
        />
        <span> 經朔入轉</span>
        <input
          value={this.state.b}
          onChange={(e) => {
            this.setState({ b: e.currentTarget.value });
          }}
        />
        <span> 定望分0.</span>
        <input
          value={this.state.c}
          onChange={(e) => {
            this.setState({ c: e.currentTarget.value });
          }}
        />
        <span> 經朔距冬至</span>
        <input
          value={this.state.d}
          onChange={(e) => {
            this.setState({ d: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Print = BindMoonEclipse(this.state.a, this.state.b, this.state.c, this.state.d)
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
        <p></p>
        <table>
          <tr>
            <th></th>
            <th>食分</th>
            <th>食延刻數</th>
            <th>食甚時刻</th>            
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
        <h3>月食</h3>
        {this.input()}
        <button onClick={this.handle} className='button4-7'>交</button>
        {this.result()}
      </div>
    )
  }
}