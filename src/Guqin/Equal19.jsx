import React from 'react'
import { EqualTemp } from '../Cal/guqin'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: 1,
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
      const { Print } = EqualTemp(this.state.a, 19)
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
      <div className='ans table2 table-vertical' style={{ whiteSpace: "nowrap" }}>
        <table>
          <tr>
            <th></th>
            <th></th>
            <th>① ♯1 𝄫2</th>
            <th>② ♭2</th>
            <th>③ 2</th>
            <th>④ ♯2 𝄫3</th>
            <th>⑤ ♭3</th>
            <th>⑥ 3</th>
            <th>⑦ ♯3 ♭4</th>
            <th>⑧ 4</th>
            <th>⑨ ♯4</th>
            <th>⑩ ♭5</th>
            <th>⑪ 5</th>
            <th>⑫ ♯5 𝄫6</th>
            <th>⑬ ♭6</th>
            <th>⑭ 6</th>
            <th>⑮ ♯6 𝄫7</th>
            <th>⑯ ♭7</th>
            <th>⑰ 7</th>
            <th>⑱ ♯7 ♭1</th>
            <th>⑲ 1</th>
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
        <h4>十九等程律</h4>
        {this.input()}
        <button onClick={this.handle} className='button4-3'>嚶嚶嚶</button><span className='Deci64'>.64</span>
        {this.result()}
      </div>
    )
  }
}