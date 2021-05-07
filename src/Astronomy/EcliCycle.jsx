import React from 'react'
import { Cycle2Node } from '../Cal/astronomy_west'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: '404/465',
      b: '659/1242'
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>交食週期 5.</span>
        <input className='width3'
          value={this.state.a}
          onChange={e => {
            this.setState({ a: e.currentTarget.value });
          }}
        />
        <span>月　朔望月 29.</span>
        <input className='width3'
          value={this.state.b}
          onChange={e => {
            this.setState({ b: e.currentTarget.value });
          }}
        />
        <span>日</span>
      </span>
    );
  }

  handle() {
    try {
      const Print = Cycle2Node(this.state.a, this.state.b)
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
        <h3>交點月 ⇌ 交食週期</h3>
        {this.input()}
        <button onClick={this.handle} className='button4-7'>cycle2node</button><span className="decimal64">n/d</span><span className="decimal64">.64</span>
        {this.result()}
      </div>
    )
  }
}