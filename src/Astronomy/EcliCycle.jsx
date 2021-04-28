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
          onChange={(e) => {
            this.setState({ a: e.currentTarget.value });
          }}
        />
        <span>月　朔望月 29.</span>
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
        <p className='note'>我的獨創發明：<code>Node = Lunar * EcliCycle / (1/2 + EcliCycle)</code>以皇極驗之，可見皇極之交點月正以此公式化之。<v>大明</v>以前無交點月，只有交食週期，我藉此全部統一爲用交點月進行計算，非常方便。可輸入小數或分數，算出來的小數可通過「同餘」標籤中的「連分數」化爲漸進分數<span className="decimal64">frac</span><span className="decimal64">.64</span></p>
        {this.input()}
        <button onClick={this.handle} className='button4-7'>node2cycle</button>
        {this.result()}
      </div>
    )
  }
}