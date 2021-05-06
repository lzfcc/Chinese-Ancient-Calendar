import React from 'react'
import { BindEquator2Ecliptic } from '../Cal/bind_astronomy'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Ecliptic2: 365.244,
      Ecliptic3: 1000,
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>度數</span>
        <input className='width3'
          value={this.state.Ecliptic1}
          onChange={e => {
            this.setState({ Ecliptic1: e.currentTarget.value });
          }}
        />
        <span> 週天</span>
        <input className='width3'
          value={this.state.Ecliptic2}
          onChange={e => {
            this.setState({ Ecliptic2: e.currentTarget.value });
          }}
        />
        <span> 公元年</span>
        <input className='width2'
          value={this.state.Ecliptic3}
          onChange={e => {
            this.setState({ Ecliptic3: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const { Range, Print } = BindEquator2Ecliptic(this.state.Ecliptic1, this.state.Ecliptic2, this.state.Ecliptic3)
      this.setState({ outputEcliptic: Print, outputEcliptic1: Range })
    } catch (e) {
      alert(e.message)
    }
  }

  result() {
    if (!this.state.outputEcliptic) {
      return null
    }
    return (
      <div className='ans table2 right'>
        <p>{this.state.outputEcliptic1}</p>
        <table>
          <tr>
            <th></th>
            <th>赤 ⇒ 黃</th>
            <th>黃-赤</th>
            <th>誤差1</th>
            <th>誤差2</th>            
            <th>黃 ⇒ 赤</th>
            <th>赤-黃</th>
            <th>誤差1</th>
            <th>誤差2</th>
            <th>赤緯</th>
            <th>誤差1</th>
          </tr>
          {(this.state.outputEcliptic || []).map(row => {
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
        <p className='note'>第一行「球面三角」是黃赤經轉換的公式，第二行「三角割圓」是用三角函數代替會圓術的弧矢割圓術，<v>授時</v>弧矢割圓術用的是會圓術。弧矢割圓術是近似三角形、勾股定理、會圓術的組合，前兩者都是精確公式，只有會圓術是近似公式，那麼從理論上來講，如果用三角函數代替會圓術，就能得到和球面三角完全一致的結果，事實上並不是這麼回事，我猜測，這應該是極黃經與黃經坐標的區別，弧矢割圓術的模型是極黃經，而球面三角是現代天文學的黃經。我已經排除了單位系的問題（詳見會圓術，會圓術的系數是 3，一般意義上幾何的系數是 π），應該比較可靠。度數從冬至起算，二至到二分：赤大於黃；二分到二至：黃大於赤。只有<v>紀元</v>有黃轉赤公式，其餘只能赤轉黃，我用與<v>紀元</v>相同的求反函數思路，補出各宋系曆法的黃轉赤公式。小數點後 4 位的精度就是 0.36”</p>
        {this.input()}
        <button onClick={this.handle} className='button4-6'>ecliptic&equator</button>
        {this.result()}
      </div>
    )
  }
}