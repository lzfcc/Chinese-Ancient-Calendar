import React from "react";
import { RoundH2LPrint } from "../Cal/equa_geometry";
export default class Equa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      R: 60.875,
      H: 10,
      c: 365.25
    };
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <p className='note'>輸入圓的半徑 r、弓形的高「矢」h、週天度。會圓術求法：半弦長 <code>c/2 = sqrt (r^2 - (r-h)^2)</code>，弧長 <code>l = h^2 / r + c</code>；三角函數求法：圓心角 <code>a = 2 arcsin(sqrt(2rh - h^2) / r)</code>，弧長 <code>l = (a / 360) πd </code>尤其需要注意的是，會圓術的標準是週天度 365.25，直徑 121.75，卽「週三徑一」，這個單位系是以 3 爲標準，而非圓周率 π（鄧可卉《授時曆中的弧矢割圓術再探》，《自然科學史研究》2007(2）)，所以在與三角函數對照時，需要進行參照系轉換，詳見源代碼</p>
        <span> 矢</span>
        <input className='width3'
          value={this.state.H}
          onChange={e => {
            this.setState({ H: e.currentTarget.value });
          }}
        />
        <span>半徑</span>
        <input className='width3'
          value={this.state.R}
          onChange={e => {
            this.setState({ R: e.currentTarget.value });
          }}
        />
        <span> 週天度</span>
        <input className='width3'
          value={this.state.c}
          onChange={e => {
            this.setState({ c: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Print = RoundH2LPrint(this.state.H, this.state.R, this.state.c)
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
      <div className='ans table2'>
        <table>
          <tr>
            <th></th>
            <th>弦長</th>
            <th>誤差</th>
            <th>弧長</th>
            <th>誤差</th>
            <th>圓心角</th>         
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
        <h3>會圓術、三角函數矢 ⇒ 弦</h3>
        {this.input()}
        <button onClick={this.handle} className='button4-8'>沈括</button>
        {this.result()}
      </div>
    );
  }
}
