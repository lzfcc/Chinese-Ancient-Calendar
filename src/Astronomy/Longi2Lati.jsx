import React from 'react'
import { BindLongi2Lati } from '../Cal/bind_astronomy'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Lati2: 365.2445,
      Lati3: 3400,
      Lati4: 34.475,
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>距冬至日數</span>
        <input className='width3'
          value={this.state.Lati1}
          onChange={(e) => {
            this.setState({ Lati1: e.currentTarget.value });
          }}
        />
        <span> 週天</span>
        <input className='width3'
          value={this.state.Lati2}
          onChange={(e) => {
            this.setState({ Lati2: e.currentTarget.value });
          }}
        />
        <span> 緯度</span>
        <input className='width3'
          value={this.state.Lati4}
          onChange={(e) => {
            this.setState({ Lati4: e.currentTarget.value });
          }}
        />
        <span> 公元年</span>
        <input className='width2'
          value={this.state.Lati3}
          onChange={(e) => {
            this.setState({ Lati3: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Print = BindLongi2Lati(this.state.Lati1, this.state.Lati4, this.state.Lati2, this.state.Lati3)
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
            <th>去極度</th>
            <th>赤緯</th>
            <th>誤差</th>
            <th>日出</th>
            <th>誤差</th>
            <th>晷長</th>
            <th>誤差</th>
          </tr>
          {(this.state.output || []).map((row) => {
            return (
              <tr>
                <td className='RowTitle'>{row.title}</td>
                {row.data.map((d) => {
                  return (<td>{Number(d) === 0 ? '-' : d}</td>)
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
        <h3>積日 ⇒ 去極度、赤緯、日出、晷長</h3>
        <p className='note'>黃道去極度 = 週天/4 - 赤緯。<v>崇玄</v>、<v>崇天</v>、<v>明天</v>、<v>觀天</v>、<v>紀元</v>使用各自的週天度，不受輸入的週天度影響。日出時刻 = 夜半漏 + 2.5 刻<n>一日百刻。</n>球面三角的日出、晷長有兩行，上行計入蒙氣差、日視半徑等修正因素，作爲古曆理論値；下行未加入修正</p>
        {this.input()}
        <button onClick={this.handle} className='button4-2'>longi2lati</button>
        {this.result()}
      </div>
    )
  }
}