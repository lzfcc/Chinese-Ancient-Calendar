import React from 'react'
import { Leng2Fret } from '../Cal/guqin'

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
        <span>弦長</span>
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
      const Print = Leng2Fret(this.state.a)
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
        <p>{this.state.output} 徽</p>
      </div>
    )
  }

  render() {
    return (
      <div>
        <p className='note'>輸入 0—1 之間的小數或分數</p>
        {this.input()}
        <button onClick={this.handle} className='button4-1'>leng2fret</button><span className='Deci64'>n/d</span>
        {this.result()}
      </div>
    )
  }
}