import React from 'react'
import { Pythagorean } from '../Cal/guqin'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: 81,
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
      const Print = Pythagorean(this.state.a)
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
      <div className='ans table2' style={{ whiteSpace: "nowrap" }}>
        <table>
          <tr>
            <th></th>
            <th>黃鐘C</th>
            <th>林鐘G</th>
            <th>太簇D</th>
            <th>南呂A</th>
            <th>姑洗E</th>
            <th>應鐘B</th>
            <th>蕤賓♯F</th>
            <th>大呂♯C</th>
            <th>夷則♯G</th>
            <th>夾鐘♯D</th>
            <th>无射♯A</th>
            <th>仲呂♯E</th>
            <th>少黃鐘𝄪B</th>
          </tr>
          {(this.state.output1 || []).map(row => {
            return (
              <tr>
                <td className='RowTitle'>{row.title}</td>
                {row.data.map(d => <td dangerouslySetInnerHTML={{ __html: d }}></td>)}
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
        <h4>五度相生律</h4>
        {this.input()}
        <button onClick={this.handle} className='button4-3'>三分損益</button><span className='Deci64'>n/d</span>
        {this.result()}
      </div>
    )
  }
}