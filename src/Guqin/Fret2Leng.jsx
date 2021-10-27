import React from 'react'
import { Fret2LengPrint } from '../Cal/guqin'

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
        <span>徽位</span>
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
      const Print = Fret2LengPrint(this.state.a)
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
        <h3>徽位 ⇌ 弦長</h3>
        <p className='note'>支持 13.111，13 1/9，118/9 等格式</p>
        {this.input()}
        <button onClick={this.handle} className='button4-1'>fret2leng</button><span className='Deci64'>n/d</span>
        {this.result()}
      </div>
    )
  }
}