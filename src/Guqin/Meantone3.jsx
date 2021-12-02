import React from 'react'
import { Meantone } from '../Cal/guqin'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: '1',
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>始發律</span>
        <input className='width2'
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
      const { Print2 } = Meantone(this.state.a, 3)
      this.setState({ output1: Print2 })
    } catch (e) {
      alert(e.message)
    }
  }

  result() {
    if (!this.state.output1) {
      return null
    }
    return (
      <div className='ans table2' style={{ whiteSpace: "nowrap" }}>
        <table>
          <tr>
            <th></th>
            <th>1</th>
            <th>① 4</th>
            <th>② ♭7</th>
            <th>③ ♭3</th>
            <th>④ ♭6</th>
            <th>⑤ ♭2</th>
            <th>⑥ ♭5</th>
            <th>⑦ ♯7 ♭8</th>
            <th>⑧ ♯3 ♭4</th>
            <th>⑨ ♯6 𝄫7</th>
            <th>⑩ ♯2 𝄫3</th>
            <th>⑪ ♯5 𝄫6</th>
            <th>⑫ ♯1 𝄫2</th>
            <th>⑬ ♯4</th>
            <th>⑭ 7</th>
            <th>⑮ 3</th>
            <th>⑯ 6</th>
            <th>⑰ 2</th>
            <th>⑱ 5</th>
            <th>⑲ 8</th>
          </tr>
          {(this.state.output1 || []).map(row => {
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
        <h4>三分音差折中律</h4>
        {this.input()}
        <button onClick={this.handle} className='button4-3'>1/3</button><span className='Deci64'>n/d</span><span className='Deci64'>.64</span>
        {this.result()}
      </div>
    )
  }
}