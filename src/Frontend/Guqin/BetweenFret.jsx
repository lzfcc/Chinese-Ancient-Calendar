import React from 'react'
import SingleSelectMenu from "../SingleSelectMenu";
import { TuningOptions, GenList } from "Cal/parameter/constants.mjs";
import { BetweenFret } from '../../Cal/guqin/guqin.mjs'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: '',
      temp: '',
      n: '0',
      isSimple: '0'
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
        <span>律制
          <SingleSelectMenu
            Calendars={GenList}
            onSelect={(selected) => {
              this.setState({ temp: selected });
            }}
            selected={this.state.temp}
          />
        </span>
        <span> 宮弦</span>
        <input
          className='width1'
          value={this.state.n}
          onChange={e => {
            this.setState({ n: e.currentTarget.value });
          }}
        />
        <span className="checkbox-group">
          <label className={`checkbox-label ${this.state.isSimple === "1" ? 'active' : ''}`}>
            <input
              type="checkbox"
              className='hidden-input'
              checked={this.state.isSimple === "1"}
              onChange={e => this.setState({ isSimple: e.target.checked ? "1" : "0" })}
            />
            <span className="custom-checkbox">簡潔</span>
          </label>
        </span>
      </span>
    );
  }

  handle() {
    try {
      const Print = BetweenFret(this.state.mode, this.state.temp, this.state.n, this.state.isSimple)
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
        <div className='rowline'>
          <table>
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
      </div>
    )
  }

  render() {
    return (
      <div>
        <h3>律內音</h3>
        {this.input()}
        <button onClick={this.handle} className='button4-1'>算算算</button><span className='Deci64'>n/d</span>
        {this.result()}
      </div>
    )
  }
}