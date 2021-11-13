import React from 'react'
import { Tuning } from '../Cal/guqin'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      b: '1',
      Freq: '432',
      n: '0'
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span> 調弦法</span>
        <input
          className='width1'
          value={this.state.b}
          onChange={e => {
            this.setState({ b: e.currentTarget.value });
          }}
        />
        <span> 基準頻率</span>
        <input
          className='width2'
          value={this.state.Freq}
          onChange={e => {
            this.setState({ Freq: e.currentTarget.value });
          }}
        />
        <span> 宮弦</span>
        <input
          className='width1'
          value={this.state.n}
          onChange={e => {
            this.setState({ n: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Print = Tuning(this.state.b, this.state.Freq, this.state.n)
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
            <th>唱名</th>
            <th>頻率</th>
            <th>鄰弦音分</th>
            <th>徽法律</th>
            <th>唱名</th>
            <th>頻率</th>
            <th>鄰弦音分</th>
            <th>新法密率頻率</th>
          </tr>
          {(this.state.output || []).map(row => {
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
        <h3>調弦法</h3>
        <p className='note'>正弄調：1 正調，2 蕤賓，3 清商，4 慢角，5 慢宮；側弄調：6 徽法淒涼（楚商），7 黃鐘，8 无媒，9 間弦一，10 徽法間弦二，11 徽法平調，12 徽法側商，13 徽法側羽，14 徽法側蜀，15 徽法側楚</p>
        {this.input()}
        <button onClick={this.handle} className='button4-1'>暈</button><span className='Deci64'>n/d</span>
        {this.result()}
      </div>
    )
  }
}