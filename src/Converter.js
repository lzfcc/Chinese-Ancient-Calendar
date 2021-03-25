import React from 'react'
import { Ecliptic2Equator } from './Shangshu-calendar/convert_ecliptic2equator'
import { Clock } from './Shangshu-calendar/convert_decimal2clock'
import { Jd2Date1, Date2Jd } from '../src/Shangshu-calendar/convert_jd2date'
import { Angle2Dial,Dial2Angle } from '../src/Shangshu-calendar/convert_angle2dial'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      jd: '',
      yy: '',
      mm: '',
      dd: '',
      h: '0',
      m: '0',
      s: '0',
      ms: '000',
      Ecliptic2: 2565,
      Dial2: 2565,
      Angle2: 2565,
      outputJd: null,
      outputDate: null,
    }
    this.handleEcliptic = this.handleEcliptic.bind(this)
    this.handleDial = this.handleDial.bind(this)
    this.handleAngle = this.handleAngle.bind(this)
    this.handleClock = this.handleClock.bind(this)
    this.handleJd = this.handleJd.bind(this)
    this.handleDate = this.handleDate.bind(this)
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
      </span>
    );
  }


  InputClock() {
    return (
      <span className='year-select'>
        <span>日分 0.</span>
        <input className='width3'
          value={this.state.clock}
          onChange={(e) => {
            this.setState({ clock: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  InputJd() {
    return (
      <span className='year-select'>
        <span>儒略日</span>
        <input className='width4'
          value={this.state.jd}
          onChange={(e) => {
            this.setState({ jd: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  InputDate() {
    return (
      <span className='year-select'>
        <input className='width2'
          value={this.state.yy}
          onChange={(e) => {
            this.setState({ yy: e.currentTarget.value });
          }}
        />
        <span>年</span>
        <input className='width1'
          value={this.state.mm}
          onChange={(e) => {
            this.setState({ mm: e.currentTarget.value });
          }}
        />
        <span>月</span>
        <input className='width1'
          value={this.state.dd}
          onChange={(e) => {
            this.setState({ dd: e.currentTarget.value });
          }}
        />
        <span>日</span>
        <input className='width1'
          value={this.state.h}
          onChange={(e) => {
            this.setState({ h: e.currentTarget.value });
          }}
        />
        <span>h</span>
        <input className='width1'
          value={this.state.m}
          onChange={(e) => {
            this.setState({ m: e.currentTarget.value });
          }}
        />
        <span>m</span>
        <input className='width1'
          value={this.state.s}
          onChange={(e) => {
            this.setState({ s: e.currentTarget.value });
          }}
        />
        <span>s</span>
        <input className='width2'
          value={this.state.ms}
          onChange={(e) => {
            this.setState({ ms: e.currentTarget.value });
          }}
        />
        <span>ms</span>
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
      const { Print } = Ecliptic2Equator(this.state.Ecliptic1, this.state.Ecliptic2)
      this.setState({ outputEcliptic: Print })
    } catch (e) {
      alert(e.message)
    }
  }

  handleClock() {
    try {
      const { Print } = Clock(this.state.clock)
      this.setState({ outputClock: Print })
    } catch (e) {
      alert(e.message)
    }
  }
  handleJd() {
    try {
      const { Result } = Jd2Date1(this.state.jd)
      this.setState({ outputJd: Result })
    } catch (e) {
      alert(e.message)
    }
  }

  handleDate() {
    try {
      const { Result } = Date2Jd(this.state.yy, this.state.mm, this.state.dd, this.state.h, this.state.m, this.state.s, this.state.ms)
      this.setState({ outputDate: Result })
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
      <div className='ans' style={{whiteSpace: 'pre-wrap'}}>
        <p>{this.state.outputEcliptic}</p>
      </div>
    )
  }
  ResultClock() {
    if (!this.state.outputClock) {
      return null
    }
    return (
      <div className='ans' style={{whiteSpace: 'pre-wrap'}}>
        <p>{this.state.outputClock}</p>
      </div>
    )
  }
  ResultJd() {
    if (!this.state.outputJd) {
      return null
    }
    return (
      <div className='ans'>
        <p>{this.state.outputJd}</p>
      </div>
    )
  }

  ResultDate() {
    if (!this.state.outputDate) {
      return null
    }
    return (
      <div className='ans'>
        <p>{this.state.outputDate}</p>
      </div>
    )
  }

  render() {
    return (
      <section className='modulo'>
        <h2>單位之什</h2>
        <h3>日分 ⇒ 辰刻加時</h3>
        {this.InputClock()}
        <button onClick={this.handleClock} className='button4-1'>decimal2clock</button>
        {this.ResultClock()}
        <h3>儒略日 ⇌ 日期</h3>
        {this.InputJd()}
        <button onClick={this.handleJd} className='button4-8'>JD2date</button>
        {this.ResultJd()}
        <p></p>
        {this.InputDate()}
        <button onClick={this.handleDate} className='button4-8'>date2JD</button>
        {this.ResultDate()}
        <h2>天文之什</h2>        
        <h3>赤度 ⇌ 黃度</h3>
        <p className='note'>週天需用該曆法的恆星年長度，可前往源碼倉庫査詢；若不需要絕對精確，可用近似値：四分： .25，魏晉、北系 .2463，南系 .26，唐系 .2565，宋系.257，授時系 .2575。度數從冬至起算，二分到二至：黃大於赤，二至到二分：赤大於黃。提供兩個數值，按需選用卽可。</p>
        {this.InputEcliptic()}
        <button onClick={this.handleEcliptic} className='button4-6'>ecliptic&equator</button>
        {this.ResultEcliptic()}
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