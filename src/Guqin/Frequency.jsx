import React from 'react'
import { Frequency } from '../Cal/guqin'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select width3'>
        <span>音分</span>
        <input
          value={this.state.a}
          onChange={e => {
            this.setState({ a: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Print = Frequency(this.state.a)
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
        {this.input()}
        <button onClick={this.handle} className='button4-1'>cent2frq</button>
        {this.result()}
      </div>
    )
  }
}