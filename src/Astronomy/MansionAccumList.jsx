import React from 'react'
import { bindMansionAccumList } from '../Cal/astronomy_bind'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: 'Shoushi',
      b: 1281,
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>曆法</span>
        <input className='width3'
          value={this.state.a}
          onChange={e => {
            this.setState({ a: e.currentTarget.value });
          }}
        />
        <span> 年份</span>
        <input className='width3'
          value={this.state.b}
          onChange={e => {
            this.setState({ b: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const { EclpAccumPrint, EquaAccumPrint } = bindMansionAccumList(this.state.a, this.state.b)
      this.setState({ EclpAccumPrint, EquaAccumPrint })
    } catch (e) {
      alert(e.message)
    }
  }

  result() {
    if (!this.state.EclpAccumPrint) {
      return null
    }
    return (
      <div className='ans table2'>
        <h3>黃道宿鈐</h3>
        <table>
          {this.state.EclpAccumPrint.map(row => {
            return (
              <tr>
                {row.map(d => {
                  return <td style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: d }}></td>
                })}
              </tr>
            );
          })}
        </table>
        <h3>赤道宿鈐</h3>
        <table>
          {this.state.EquaAccumPrint.map(row => {
            return (
              <tr>
                {row.map(d => {
                  return <td style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: d }}></td>
                })}
              </tr>
            );
          })}
        </table>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.input()}
        <button onClick={this.handle} className='button4-6'>黃赤宿鈐</button>
        {this.result()}
      </div>
    )
  }
}