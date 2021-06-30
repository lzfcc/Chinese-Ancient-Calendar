import React from 'react'
import { Tuning } from '../Cal/guqin'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: 440
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select width3'>
        <span>五弦頻率</span>
        <input
          value={this.state.a}
          onChange={e => {
            this.setState({ a: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Print = Tuning(this.state.a)
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
      <div className='ans table2' style={{ whiteSpace: "nowrap" }}>
        <table>
          <tr>
            <th></th>
            <th>準法律</th>
            <th>鄰弦音分</th>
            <th>徽法律</th>
            <th>鄰弦音分</th>
            <th>新法密率</th>
            <th>鄰弦音分</th>
          </tr>
          {(this.state.output || []).map(row => {
            return (
              <tr>
                <td className='RowTitle'>{row.title}</td>
                {row.data.map(d => <td>{d}</td>)}
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
        <h3>正調調弦法</h3>
        {this.input()}
        <button onClick={this.handle} className='button4-1'>哇</button><span className='Deci64'>n/d</span>
        {this.result()}
      </div>
    )
  }
}