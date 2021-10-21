import React from 'react'
import { Tuning } from '../Cal/guqin'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: 440,
      b: 1
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>五弦頻率</span>
        <input
          className='width3'
          value={this.state.a}
          onChange={e => {
            this.setState({ a: e.currentTarget.value });
          }}
        />
        <span> 弦式</span>
        <input
          className='width1'
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
      const { Print } = Tuning(this.state.a, this.state.b)
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
        <h3>調弦法</h3>
        <p className='note'>正弄調：1 正調，2 蕤賓調，3 慢角，4 慢宮，5 清商；側弄調：7 側商（準法律闕），8 淒涼（又名黃鐘調。準法律待定），9 无媒（準法律待定），10 閒弦（準法律待定）</p>
        {this.input()}
        <button onClick={this.handle} className='button4-1'>暈</button><span className='Deci64'>n/d</span>
        {this.result()}
      </div>
    )
  }
}