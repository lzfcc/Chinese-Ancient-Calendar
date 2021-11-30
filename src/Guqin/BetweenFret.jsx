import React from 'react'
import { BetweenFret } from '../Cal/guqin'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      b: '1',
      Temp: '5',
      n: '0',
      isSimple: '0'
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>弦法</span>
        <input
          className='width1'
          value={this.state.b}
          onChange={e => {
            this.setState({ b: e.currentTarget.value });
          }}
        />
        <span>律制</span>
        <input
          className='width1'
          value={this.state.Temp}
          onChange={e => {
            this.setState({ Temp: e.currentTarget.value });
          }}
        />
        <span> 宮弦</span>
        <input
          className='width1'
          value={this.state.n}
          onChange={e => {
            this.setState({ n: e.currentTarget.value });
          }}
        />
        <span> 簡潔</span>
        <input
          className='width1'
          value={this.state.isSimple}
          onChange={e => {
            this.setState({ isSimple: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Print = BetweenFret(this.state.b, this.state.Temp, this.state.n, this.state.isSimple)
      this.setState({ output1: Print })
    } catch (e) {
      alert(e.message)
    }
  }

  result() {
    if (!this.state.output1) {
      return null
    }
    return (
      <div className='ans table2' style={{ whiteSpace: "nowrap" }}>
        <div className='rowline'>
          <table>
            {(this.state.output1 || []).map(row => {
              return (
                <tr>
                  <td className='RowTitle'>{row.title}</td>
                  {row.data.map(d => <td dangerouslySetInnerHTML={{ __html: d }}></td>)}
                </tr>
              )
            })}
          </table>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        <h3>律內音</h3>
        <p className='note'>律制 1 徽法一、2 徽法二、3 徽法三、4 徽法四、5 準法、6 新法密率</p>
        {this.input()}
        <button onClick={this.handle} className='button4-1'>算算算</button><span className='Deci64'>n/d</span>
        {this.result()}
      </div>
    )
  }
}