import React from 'react'
import { Regression } from '../Cal/astronomy_west.mjs'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: '2563758263',
      b: '2122216903',
      c: '5305949008'
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>週天都 365.</span>
        <input className='width3'
          value={this.state.a}
          onChange={e => {
            this.setState({ a: e.currentTarget.value });
          }}
        />
        <span>交點月 27.</span>
        <input className='width3'
          value={this.state.b}
          onChange={e => {
            this.setState({ b: e.currentTarget.value });
          }}
        />
        <span>朔望月 29.</span>
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
      const Print = Regression(this.state.a, this.state.b, this.state.c)
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
      <div className='ans'>
        <p>{this.state.output}</p>
      </div>
    )
  }

  render() {
    return (
      <div>
        <h3>交點退行速度</h3>
        {this.input()}
        <button onClick={this.handle} className='button4-7'>regression</button>
        {this.result()}
      </div>
    )
  }
}