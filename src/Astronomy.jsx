import React from 'react'
import { Ecliptic2Equator } from './Shangshu-calendar/astronomy_ecliptic2equator'
import { Longi2Lati } from './Shangshu-calendar/astronomy_longi2lati'
import { Angle2Dial,Dial2Angle } from '../src/Shangshu-calendar/astronomy_angle2dial'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Ecliptic2: 2565,
      Dial2: 2565,
      Angle2: 2565,
      Lati2: 2565,
      Ecliptic3: 1000,
      Lati3: 1000,
    }
    this.handleEcliptic = this.handleEcliptic.bind(this)
    this.handleLati = this.handleLati.bind(this)
    this.handleDial = this.handleDial.bind(this)
    this.handleAngle = this.handleAngle.bind(this)
  }

  InputDial() {
    return (
      <span className='year-select'>
        <span>天頂距<n>度</n></span>
        <input className='width3'
          value={this.state.Dial1}
          onChange={(e) => {
            this.setState({ Dial1: e.currentTarget.value });
          }}
        />
        <span> 週天<n>度</n> 365.</span>
        <input className='width3'
          value={this.state.Dial2}
          onChange={(e) => {
            this.setState({ Dial2: e.currentTarget.value });
          }}
        />
      </span>
    );
  }
  InputAngle() {
    return (
      <span className='year-select'>
        <span>晷長<n>尺</n></span>
        <input className='width3'
          value={this.state.Angle1}
          onChange={(e) => {
            this.setState({ Angle1: e.currentTarget.value });
          }}
        />
        <span> 週天<n>度</n> 365.</span>
        <input className='width3'
          value={this.state.Angle2}
          onChange={(e) => {
            this.setState({ Angle2: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  InputEcliptic() {
    return (
      <span className='year-select'>
        <span>度數</span>
        <input className='width3'
          value={this.state.Ecliptic1}
          onChange={(e) => {
            this.setState({ Ecliptic1: e.currentTarget.value });
          }}
        />
        <span> 週天 365.</span>
        <input className='width3'
          value={this.state.Ecliptic2}
          onChange={(e) => {
            this.setState({ Ecliptic2: e.currentTarget.value });
          }}
        />
        <span> 公元年</span>
        <input className='width3'
          value={this.state.Ecliptic3}
          onChange={(e) => {
            this.setState({ Ecliptic3: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  InputLati() {
    return (
      <span className='year-select'>
        <span>黃度</span>
        <input className='width3'
          value={this.state.Lati1}
          onChange={(e) => {
            this.setState({ Lati1: e.currentTarget.value });
          }}
        />
        <span> 週天 365.</span>
        <input className='width3'
          value={this.state.Lati2}
          onChange={(e) => {
            this.setState({ Lati2: e.currentTarget.value });
          }}
        />
        <span> 公元年</span>
        <input className='width3'
          value={this.state.Lati3}
          onChange={(e) => {
            this.setState({ Lati3: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handleDial() {
    try {
      const { Print } = Angle2Dial(this.state.Dial1, this.state.Dial2)
      this.setState({ outputDial: Print })
    } catch (e) {
      alert(e.message)
    }
  }
  handleAngle() {
    try {
      const { Print } = Dial2Angle(this.state.Angle1, this.state.Angle2)
      this.setState({ outputAngle: Print })
    } catch (e) {
      alert(e.message)
    }
  }

  handleEcliptic() {
    try {
      const { Range, Print } = Ecliptic2Equator(this.state.Ecliptic1, this.state.Ecliptic2, this.state.Ecliptic3)
      this.setState({ outputEcliptic: Print, outputEcliptic1: Range })
    } catch (e) {
      alert(e.message)
    }
  }
  handleLati() {
    try {
      const {  Print } = Longi2Lati(this.state.Lati1, this.state.Lati2, this.state.Lati3)
      this.setState({ outputLati: Print })
    } catch (e) {
      alert(e.message)
    }
  }

  ResultDial() {
    if (!this.state.outputDial) {
      return null
    }
    return (
      <div className='ans'>
        <p>{this.state.outputDial}</p>
      </div>
    )
  }
  ResultAngle() {
    if (!this.state.outputAngle) {
      return null
    }
    return (
      <div className='ans'>
        <p>{this.state.outputAngle}</p>
      </div>
    )
  }
  ResultEcliptic() {
    if (!this.state.outputEcliptic) {
      return null
    }
    return (
      <div className='ans InputDecompose InputDecompose1'>
        <p>{this.state.outputEcliptic1}</p>
        <table>
          <tr>
            <th></th>
            <th>赤度⇒黃度</th>
            <th>赤轉黃誤差</th>
            <th>黃度⇒赤度</th>            
            <th>黃轉赤誤差</th>
          </tr>
          {(this.state.outputEcliptic || []).map((row) => {
            return (
              <tr>
                <td className='RowTitle'>{row.title}</td>
                {row.data.map((d) => {
                  return (<td className=''>{d}</td>)
                })}
              </tr>
            )
          })}
        </table>
        <p></p>
      </div>
    )
  }
  ResultLati() {
    if (!this.state.outputLati) {
      return null
    }
    return (
      <div className='ans InputDecompose InputDecompose1'>
        <p></p>
        <table>
          <tr>
            <th></th>
            <th>去極度</th>
            <th>赤緯</th>
            <th>誤差</th>
          </tr>
          {(this.state.outputLati || []).map((row) => {
            return (
              <tr>
                <td className='RowTitle'>{row.title}</td>
                {row.data.map((d) => {
                  return (<td className=''>{d}</td>)
                })}
              </tr>
            )
          })}
        </table>
        <p></p>
      </div>
    )
  }
  render() {
    return (
      <section className='modulo'>
        <h3>赤度 ⇌ 黃度</h3>
        <p className='note'>週天需用該曆法的恆星年長度，可前往源碼倉庫査詢；若不需要絕對精確，可用近似値：四分： .25，魏晉、北系 .2463，南系 .26，唐系 .2565，宋系.257，授時系 .2575。度數從冬至起算，二至到二分：赤大於黃；二分到二至：黃大於赤。崇玄、崇天、明天、觀天、紀元使用各自的週天度，不受輸入的週天度影響。</p>
        {this.InputEcliptic()}
        <button onClick={this.handleEcliptic} className='button4-6'>ecliptic&equator</button>
        {this.ResultEcliptic()}
        <h3>黃經 ⇒ 赤緯</h3>
        <p className='note'>黃道去極度 = 週天/4 - 赤緯。<v>崇玄</v>、<v>崇天</v>、<v>明天</v>、<v>觀天</v>、<v>紀元</v>使用各自的週天度，不受輸入的週天度影響。<v>儀天</v>的自變量是距二至日數，而非實行度，所以結果與其他曆法有差異。<span className='decimal64'>.64</span></p>
        {this.InputLati()}
        <button onClick={this.handleLati} className='button4-2'>longi2lati</button>
        {this.ResultLati()}
        <h3>天頂距 ⇌ 晷長</h3>
        <p className='note'>晷長單位爲尺，表高 8 尺。有效晷長範圍：0—50 尺，有效天頂距範圍：0—85 度。天頂距<n>戴日之北度</n> = 黃道去極度 - (象限 - 緯度)，象限 = 恆星年/4，<u>陽城</u>緯度<n>北極出地高度</n> 34.475<span className='decimal64'>.64</span></p>
        {this.InputDial()}
        <button onClick={this.handleDial} className='button4-5'>angle2length</button>
        {this.ResultDial()}
        <p></p>
        {this.InputAngle()}
        <button onClick={this.handleAngle} className='button4-5'>length2angle</button>
        {this.ResultAngle()}
      </section>
    )
  }
}