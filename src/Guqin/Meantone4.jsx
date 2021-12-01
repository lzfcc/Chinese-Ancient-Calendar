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
      const Print = Meantone(this.state.a)
      this.setState({ output1: Print })
    } catch (e) {
      alert(e.message)
    }
  }

  result() {
    if (!this.state.output1) {
      return null
    }
    return (
      <div className='ans table2 right' style={{ whiteSpace: "nowrap" }}>
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
      </div>
    )
  }

  render() {
    return (
      <div>
        <h4>四分音差調和律</h4>
        {this.input()}
        <button onClick={this.handle} className='button4-3'>1/4</button><span className='Deci64'>n/d</span><span className='Deci64'>.64</span>
        {this.result()}
      </div>
    )
  }
}