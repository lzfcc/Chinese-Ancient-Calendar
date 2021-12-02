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
      const { Print1, Print2 } = Meantone(this.state.a)
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
      <div className='ans table2' style={{ whiteSpace: "nowrap" }}>
        <table>
          <tr>
            <th></th>
            <th>C</th>
            <th>① G</th>
            <th>② D</th>
            <th>③ A</th>
            <th>④ E</th>
            <th>⑤ B</th>
            <th>⑥ ♯F</th>
            <th>⑦ ♯C</th>
            <th>⑧ ♯G</th>
            <th>⑨ ♯D</th>
            <th>⑩ ♯A</th>
            <th>⑪ ♯E</th>
            <th>⑫</th>
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
        <table>
          <tr>
            <th></th>
            <th>C</th>
            <th>① F</th>
            <th>② ♭B</th>
            <th>③ ♭E</th>
            <th>④ ♭A</th>
            <th>⑤ ♭D</th>
            <th>⑥ ♭G</th>
            <th>⑦ ♭C</th>
            <th>⑧ ♭F</th>
            <th>⑨ 𝄫B</th>
            <th>⑩ 𝄫E</th>
            <th>⑪ 𝄫A</th>
            <th>⑫ 𝄫D</th>
          </tr>
          {(this.state.output2 || []).map(row => {
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
        <h4>四分音差折中律</h4>
        {this.input()}
        <button onClick={this.handle} className='button4-3'>1/4</button><span className='Deci64'>n/d</span><span className='Deci64'>.64</span>
        {this.result()}
      </div>
    )
  }
}