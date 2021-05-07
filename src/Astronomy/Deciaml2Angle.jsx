import React from 'react'
import { Deciaml2Angle } from '../Cal/astronomy_west'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      f: 39,
      h1: 12,
      m1: 0,
      s1: 0,
      Day: 90,
      h: 12,
      m: 0,
      s: 0,
      year: 2021,
      height: 10,
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>冬至時刻</span>
        <input className='width1'
          value={this.state.h1}
          onChange={e => {
            this.setState({ h1: e.currentTarget.value });
          }}
        />
        <span>:</span>
        <input className='width1'
          value={this.state.m1}
          onChange={e => {
            this.setState({ m1: e.currentTarget.value });
          }}
        />
        <span>:</span>
        <input className='width1'
          value={this.state.s1}
          onChange={e => {
            this.setState({ s1: e.currentTarget.value });
          }}
        />
        <span> 距冬至日</span>
        <input className='width2'
          value={this.state.Day}
          onChange={e => {
            this.setState({ Day: e.currentTarget.value });
          }}
        />
        <span> 時刻</span>
        <input className='width1'
          value={this.state.h}
          onChange={e => {
            this.setState({ h: e.currentTarget.value });
          }}
        />
        <span>:</span>
        <input className='width1'
          value={this.state.m}
          onChange={e => {
            this.setState({ m: e.currentTarget.value });
          }}
        />
        <span>:</span>
        <input className='width1'
          value={this.state.s}
          onChange={e => {
            this.setState({ s: e.currentTarget.value });
          }}
        />
        <p></p>
        <span>緯度</span>
        <input className='width3'
          value={this.state.f}
          onChange={e => {
            this.setState({ f: e.currentTarget.value });
          }}
        />
        <span> 公元年</span>
        <input className='width2'
          value={this.state.year}
          onChange={e => {
            this.setState({ year: e.currentTarget.value });
          }}
        />
        <span> 表高</span>
        <input className='width2'
          value={this.state.height}
          onChange={e => {
            this.setState({ height: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Print = Deciaml2Angle(this.state.f, this.state.h1, this.state.m1, this.state.s1, this.state.Day, this.state.h, this.state.m, this.state.s, this.state.year, this.state.height)
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
      <div className='ans' style={{ whiteSpace: "pre-wrap" }}>
        <p>{this.state.output}</p>
      </div>
    )
  }

  render() {
    return (
      <div>
        <h3>任意時刻太陽高度、方位角、晷長</h3>
        {this.input()}
        <button onClick={this.handle} className='button4-1'>太強了</button><span className='decimal64'>.64</span>
        {this.result()}
      </div>
    )
  }
}