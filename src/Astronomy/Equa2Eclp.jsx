import React from 'react'
import { BindEqua2Eclp } from '../Cal/bind_astronomy'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Eclp2: 365.244,
      Eclp3: 1000,
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>度數</span>
        <input className='width3'
          value={this.state.Eclp1}
          onChange={e => {
            this.setState({ Eclp1: e.currentTarget.value });
          }}
        />
        <span> 週天</span>
        <input className='width3'
          value={this.state.Eclp2}
          onChange={e => {
            this.setState({ Eclp2: e.currentTarget.value });
          }}
        />
        <span> 公元年</span>
        <input className='width2'
          value={this.state.Eclp3}
          onChange={e => {
            this.setState({ Eclp3: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const { Range, Print } = BindEqua2Eclp(this.state.Eclp1, this.state.Eclp2, this.state.Eclp3)
      this.setState({ outputEclp: Print, outputEclp1: Range })
    } catch (e) {
      alert(e.message)
    }
  }

  result() {
    if (!this.state.outputEclp) {
      return null
    }
    return (
      <div className='ans table2 right'>
        <p>{this.state.outputEclp1}</p>
        <table>
          <tr>
            <th></th>
            <th>赤 ⇒ 黃</th>
            <th>黃-赤</th>
            <th>誤差</th>            
            <th>黃 ⇒ 赤</th>
            <th>赤-黃</th>
            <th>誤差</th>
            <th>赤緯</th>
            <th>誤差1</th>
          </tr>
          {(this.state.outputEclp || []).map(row => {
            return (
              <tr>
                <td className='RowTitle'>{row.title}</td>
                {row.data.map(d => {
                  return (<td>{d}</td>)
                })}
              </tr>
            )
          })}
        </table>
      </div>
    )
  }

  render() {
    return (
      <div>
        <h3>赤經 ⇌ 極黃經</h3>
        <p className='note'>第一行「球面三角」是黃赤經轉換的公式，第二行「三角割圓」是用三角函數代替會圓術的弧矢割圓術，<v>授時</v>弧矢割圓術用的是會圓術。弧矢割圓術是近似三角形、勾股定理、會圓術的組合，前兩者都是精確公式，只有會圓術是近似公式，那麼從理論上來講，如果用三角函數代替會圓術，就能得到和球面三角完全一致的結果，實際上也是這樣的。度數從冬至起算，二至到二分：赤大於黃；二分到二至：黃大於赤。只有<v>紀元</v>有黃轉赤公式，其餘只能赤轉黃，我用與<v>紀元</v>相同的求反函數思路，補出各宋系曆法的黃轉赤公式。最後一欄的赤緯是直接根據赤道度或黃道度算出來的，下面的赤緯是根據距離冬至日數算出來的，要考慮日躔，而表格法曆法在製表時已經考慮了日躔，所以此處不能加上表格法曆法的赤緯。小數點後 4 位的精度是 0.36”</p>
        {this.input()}
        <button onClick={this.handle} className='button4-6'>Eclp&Equa</button>
        {this.result()}
      </div>
    )
  }
}