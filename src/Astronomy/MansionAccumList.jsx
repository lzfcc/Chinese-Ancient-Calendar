import React from 'react'
import { NameDayList } from '../Cal/para_constant'
import MenuSelect from '../MenuSelect'
import { bindMansionAccumList } from '../Cal/astronomy_bind'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      calendars: [],
      Year: 1281,
    }
    this.handle = this.handle.bind(this)
  }

  handle() {
    try {
      const { EclpAccumPrint, EquaAccumPrint } = bindMansionAccumList(this.state.calendars, this.state.Year)
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
  renderCalendar() {
    let cals = NameDayList
    return (
      <span className='calendar-select'>
        <MenuSelect
          calMap={cals}
          onSelect={selected => {
            this.setState({ calendars: selected })
          }}
        />
      </span>
    );
  }
  renderInput() {
    return (
      <span className='year-select'>
        <input
          value={this.state.Year}
          onChange={e => {
            this.setState({ Year: e.currentTarget.value });
          }}
        />
        <span>年</span>
      </span>
    );
  }

  render() {
    return (
      <div>
        {this.renderCalendar()}
        {this.renderInput()}
        <button onClick={this.handle} className='button4-6'>黃赤宿鈐</button>
        {this.result()}
      </div>
    )
  }
}