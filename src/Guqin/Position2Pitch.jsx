import React from 'react'
import { Position2Pitch } from '../Cal/guqin'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: '9.6,3;9,4;s,2;9.6,3;l,10.8;zhuang;s,4;14,1;s,2;10.8,3;l,9;l,10.8;l,9;l,7.9;s,7;10,2;l,14;s,4',
      b: '1',
      c: '1',
      d: '4'
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <textarea
          className='width6'
          value={this.state.a}
          onChange={e => {
            this.setState({ a: e.currentTarget.value });
          }}
        />
        <br />        
        <span> 調弦法</span>
        <input
          className='width1'
          value={this.state.b}
          onChange={e => {
            this.setState({ b: e.currentTarget.value });
          }}
        />
        <span> 律制</span>
        <input
          className='width1'
          value={this.state.c}
          onChange={e => {
            this.setState({ c: e.currentTarget.value });
          }}
        />
        <span> 宮弦</span>
        <input
          className='width1'
          value={this.state.d}
          onChange={e => {
            this.setState({ d: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Print = Position2Pitch(this.state.a, this.state.b, this.state.c, this.state.d)
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
        <h3>減字譜轉唱名</h3>        
        {this.input()}
        <button onClick={this.handle} className='button4-5'>哇</button><span className='Deci64'>.64</span><span className='Deci64'>n/d</span>
        {this.result()}
      </div>
    )
  }
}