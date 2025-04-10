import React from 'react'
import SingleSelectMenu from "../SingleSelectMenu";
import { TuningOptions } from "Cal/parameter/constants.mjs";
import { Tuning } from '../../Cal/guqin/guqin.mjs'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: '1',
      Freq: '432'
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>弦法
          <SingleSelectMenu
            Calendars={TuningOptions}
            onSelect={(selected) => {
              this.setState({ mode: selected });
            }}
            selected={this.state.mode}
          />
        </span>
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
      const { TuneName, Print } = Tuning(this.state.mode, this.state.Freq, this.state.n)
      this.setState({ output1: TuneName, output2: Print })
    } catch (e) {
      alert(e.message)
    }
  }

  result() {
    if (!this.state.output2) {
      return null
    }
    return (
      <div className='ans table2' style={{ whiteSpace: "nowrap" }}>
        <h3>{this.state.output1}</h3>
        <table>
          <tr>
            <th></th>
            <th><bc>準法</bc></th>
            <th>音名</th>
            <th>唱名</th>
            <th>頻率</th>
            <th>鄰弦音分</th>
            <th><bc>徽一</bc></th>
            <th>音名</th>
            <th>唱名</th>
            <th>頻率</th>
            <th>鄰弦音分</th>
            <th><bc>徽二</bc></th>
            <th>唱名</th>
            <th><bc>徽三</bc></th>
            <th>唱名</th>
            <th><bc>徽四</bc></th>
            <th>唱名</th>
            <th><bc>新法密率</bc>頻率</th>
          </tr>
          {(this.state.output2 || []).map(row => {
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
        <h3>品弦法</h3>
        {this.input()}
        <button onClick={this.handle} className='button4-1'>算</button><span className='Deci64'>n/d</span>
        {this.result()}
      </div>
    )
  }
}