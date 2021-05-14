import React from 'react'
import { BindMoonLongiLati } from '../Cal/bind_astronomy'

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
        <span>入交日</span>
        <input className='width3'
          value={this.state.a}
          onChange={e => {
            this.setState({ a: e.currentTarget.value });
          }}
        />
        <span> 月黃經</span>
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
      <div className='ans table2 right'>
        <table>
          <tr>
            <th></th>
            <th>正交黃經</th>       
            <th>赤經</th>
            <th>極白經</th>
            <th>白-黃</th>
            <th>赤白差</th>
            <th>去極度</th>
            <th>黃緯</th>
            <th>赤緯</th>
          </tr>
          {(this.state.output || []).map(row => {
            return (
              <tr style={{ whiteSpace: "pre-wrap" }}>
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
        <h3>月極黃經 ⇒ 極白經、赤經、黃緯</h3>
        {this.input()}
        <button onClick={this.handle} className='button4-8'>月行九道</button><span className='decimal64'>？</span>
        {this.result()}
      </div>
    )
  }
}