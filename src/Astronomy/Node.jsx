import React from 'react'
import { Node2Cycle } from '../Cal/astronomy_west'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: 212222176,
      b: 5305958132
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>交點月 27.</span>
        <input className='width3'
          value={this.state.a}
          onChange={(e) => {
            this.setState({ a: e.currentTarget.value });
          }}
        />
        <span>日　朔望月 29.</span>
        <input className='width3'
          value={this.state.b}
          onChange={(e) => {
            this.setState({ b: e.currentTarget.value });
          }}
        />
        <span>日</span>
      </span>
    );
  }

  handle() {
    try {
      const Print = Node2Cycle(this.state.a, this.state.b)
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
        <p className='note'></p>
        {this.input()}
        <button onClick={this.handle} className='button4-7'>node2cycle</button>
        {this.result()}
      </div>
    )
  }
}