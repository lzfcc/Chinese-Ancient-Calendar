import React from 'react'
import { Position2Pitch } from '../Cal/guqin'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: '9.6,3;9,4;s,2;9.6,3;l,10.8;zhuang;s,4;14,1;s,2;10.8,3;l,9;l,10.8;l,9;l,7.9;s,7;10,2;l,14;s,4;10.8,3;9,4;5;6;6;10,5;l,9;l,10;l,9;l,7.6;7.9,7;l,9;s,4;9,6;9,5;l,7.6;l,9;4;10,2;10.8,3;9,4;l,7.9;l,7;9,4;l,10.8;14,4;3;4;3;10.8,3;l,9;4;3;l,7.9;l,9;2;s,4;2;14,1;10.8,1;l,9;2;l,7.9;l,9;10,2;s,7;10,2;l,14;s,4',
      b: '1',
      c: '1',
      d: '4',
      f: '347.654321',
      g: '1',
      h: '0'
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
        <span> 宮弦頻率</span>
        <input
          className='width3'
          value={this.state.f}
          onChange={e => {
            this.setState({ f: e.currentTarget.value });
          }}
        />
        <span> 輸出模式</span>
        <input
          className='width1'
          value={this.state.g}
          onChange={e => {
            this.setState({ g: e.currentTarget.value });
          }}
        />
        <span> 嚴格模式</span>
        <input
          className='width1'
          value={this.state.h}
          onChange={e => {
            this.setState({ h: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Print = Position2Pitch(this.state.a, this.state.b, this.state.c, this.state.d, this.state.f, this.state.g, this.state.h)
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
        <p dangerouslySetInnerHTML={{ __html: this.state.output }}></p>
      </div>
    )
  }

  render() {
    return (
      <div>
        <h3>減字譜 ⇒ 唱名、頻率比、頻率</h3>
        {this.input()}
        <button onClick={this.handle} className='button4-5'>哇</button><span className='Deci64'>n/d</span>
        {this.result()}
      </div>
    )
  }
}