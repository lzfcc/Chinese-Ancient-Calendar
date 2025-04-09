import React from 'react'
import SingleSelectMenu from "../SingleSelectMenu";
import { TuningOptions, GenList } from "Cal/parameter/constants.mjs";
import { FretPitch } from '../../Cal/guqin/guqin.mjs'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: '',
      temp: '',
      n: '0'
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
      </span>
    );
  }

  handle() {
    try {
      const { Print1, Print2, Print3, Name1Print, Name2Print } = FretPitch(this.state.mode, this.state.temp, this.state.n)
      this.setState({ output1: Print1, output2: Name1Print, output3: Print2, output4: Name2Print, output5: Print3 })
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
          <h3>按音</h3>
          <table>
            <tr>
              <th></th>
              <th>散</th>
              <th>卜卜</th>
              <th>卜</th>
              <th>13</th>
              <th>12</th>
              <th>11</th>
              <th>10</th>
              <th>9</th>
              <th>8</th>
              <th>7</th>
              <th>6</th>
              <th>5</th>
              <th>4</th>
              <th>3</th>
              <th>2</th>
              <th>1</th>
              <th>卜</th>
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
        <div className='table-narrow'>
          <table>
            {(this.state.output2 || []).map(row => {
              return (
                <tr>
                  {row.data.map(d => <td dangerouslySetInnerHTML={{ __html: d }}></td>)}
                </tr>
              )
            })}
          </table>
        </div>
        <div className='rowline'>
          <h3>泛音</h3>
          <table>
            <tr>
              <th></th>
              <th>卜卜</th>
              <th>卜</th>
              <th>13</th>
              <th>12</th>
              <th>11</th>
              <th>10</th>
              <th>9</th>
              <th>8</th>
              <th>7</th>
              <th>6</th>
              <th>5</th>
              <th>4</th>
              <th>3</th>
              <th>2</th>
              <th>1</th>
              <th>卜</th>
            </tr>
            {(this.state.output3 || []).map(row => {
              return (
                <tr>
                  <td className='RowTitle'>{row.title}</td>
                  {row.data.map(d => <td dangerouslySetInnerHTML={{ __html: d }}></td>)}
                </tr>
              )
            })}
          </table>
        </div>
        <div className='table-narrow'>
          <table>
            {(this.state.output4 || []).map(row => {
              return (
                <tr>
                  {row.data.map(d => <td dangerouslySetInnerHTML={{ __html: d }}></td>)}
                </tr>
              )
            })}
          </table>
        </div>

        <div className='rowline'>
          <h3>七限純律</h3>
          <table>
            <tr>
              <th></th>
              <th>◆6</th>
              <th>◆5</th>
              <th>◆4</th>
              <th>◆3</th>
              <th>◆2</th>
              <th>◆1</th>
            </tr>
            {(this.state.output5 || []).map(row => {
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
        <h3>徽位音</h3>
        <p className='note'></p>
        {this.input()}
        <button onClick={this.handle} className='button4-1'>算算算</button><span className='Deci64'>n/d</span>
        {this.result()}
      </div>
    )
  }
}