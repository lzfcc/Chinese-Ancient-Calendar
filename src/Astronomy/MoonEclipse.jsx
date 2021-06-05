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
        <span>經望：入交</span>
        <input
          value={this.state.a}
          onChange={e => {
            this.setState({ a: e.currentTarget.value });
          }}
        />
        <span> 入轉</span>
        <input
          value={this.state.b}
          onChange={e => {
            this.setState({ b: e.currentTarget.value });
          }}
        />
        <span> 小餘0.</span>
        <input
          value={this.state.c}
          onChange={e => {
            this.setState({ c: e.currentTarget.value });
          }}
        />
        <span> 距冬至日</span>
        <input
          value={this.state.d}
          onChange={e => {
            this.setState({ d: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const { Print1, Print2 } = BindMoonEclipse(this.state.a, this.state.b, this.state.c, this.state.d)
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
            <th>程度</th>
            <th>食分</th>
            <th>虧初刻數</th>
            <th>食甚</th>
            <th>復末</th>
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
            <th>程度</th>
            <th>食分</th>
            <th>虧初刻數</th>
            <th>食甚</th>
            <th>復末</th>
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
        <h3>月食</h3>
        {this.input()}
        <button onClick={this.handle} className='button4-7'>交</button>
        {this.result()}
      </div>
    )
  }
}