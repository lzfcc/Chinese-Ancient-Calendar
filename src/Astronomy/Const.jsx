import React from 'react'
import { ConstWest } from '../core/astronomy_west'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      c: 1247,
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>公元年</span>
        <input className='width2'
          value={this.state.c}
          onChange={(e) => {
            this.setState({ c: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const { Print } = ConstWest(this.state.c)
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
        <h3>天文常數</h3>
        <p className='note'>計算當年天文常數<span className='decimal64'>.64</span></p>
        {this.input()}
        <button onClick={this.handle} className='button4-5'>每年都在變</button>
        {this.result()}
      </div>
    )
  }
}