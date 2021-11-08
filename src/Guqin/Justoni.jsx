import React from 'react'
import { Justoni } from '../Cal/guqin'

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
        <span>黃鐘</span>
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
      const Print = Justoni(this.state.a)
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
      <div className='ans table2 right table-vertical' style={{ whiteSpace: "nowrap" }}>
        <table>
          <tr>
            <th></th>
            <th>黃鐘C</th>
            <th>林鐘G</th>            
            <th>太簇D</th>
            <th>南呂A</th>
            <th>姑洗E</th>
            <th>應鐘B-</th>
            <th>蕤賓#F-</th>
            <th>大呂#C-</th>
            <th>bE+</th>
            <th>bB+</th>
            <th>仲呂F+</th>
            <th>淸黃鐘C+</th>
            <th></th>
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
        <h3>純律</h3>
        {this.input()}
        <button onClick={this.handle} className='button4-3'>幽蘭</button><span className='Deci64'>n/d</span>
        {this.result()}
      </div>
    )
  }
}