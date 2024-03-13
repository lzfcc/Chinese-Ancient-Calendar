import React from 'react'
import { bindCorrEllipse } from '../Cal/astronomy_bind'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Orb: 30,
      cRaw: 0
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>引數</span>
        <input className='width3'
          value={this.state.Orb}
          onChange={e => {
            this.setState({ Orb: e.currentTarget.value });
          }}
        />
        <span> 偏心率</span>
        <input className='width3'
          value={this.state.cRaw}
          onChange={e => {
            this.setState({ cRaw: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Print = bindCorrEllipse(this.state.Orb, this.state.cRaw)
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
      <div className='ans table2 right' style={{ whiteSpace: "pre-wrap" }}>
        <table>
          <tr>
            <th></th>
            <th>均數</th>
            <th>牛頓迭代</th>
            <th>誤差‱</th>
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
        <h3>幾何模型均數</h3>
        {this.input()}
        <button onClick={this.handle} className='button4-3'>日月之行</button>
        {this.result()}
      </div>
    )
  }
}