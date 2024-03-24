import React from 'react'
import { ConstWest } from '../Cal/astronomy_west'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      c: 2176525,
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>儒略日</span>
        <input className='width2'
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
        {this.input()}
        <button onClick={this.handle} className='button4-5'>每年都在變</button><span className='Deci64'>.64</span>
        {this.result()}
      </div>
    )
  }
}