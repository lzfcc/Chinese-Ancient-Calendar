import React from 'react'
import { HexoQinghuaPrint } from '../Cal/hexo.mjs'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.handle = this.handle.bind(this)
  }

  handle() {
    try {
      const Print1 = HexoQinghuaPrint()
      this.setState({ output: Print1 })
    } catch (e) {
      alert(e.message)
    }
  }

  result() {
    if (!this.state.output) {
      return null
    }
    return (
      <div className='ans table2 table-vertical' style={{ whiteSpace: "nowrap" }}>
        <table>
          <tr>
            <th>爻</th>            
            <th>數</th>
            <th>本卦</th>
            <th>變卦</th>
          </tr>
          {(this.state.output || []).map(row => {
            return (
              <tr>
                {row.data.map(d => {
                  return (<td style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: d }}></td>)
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
        <h4>清華簡《筮法》</h4>
        <button onClick={this.handle} className='button4-3'>點之前虔誠。解卦靠自己</button>
        {this.result()}
      </div>
    )
  }
}