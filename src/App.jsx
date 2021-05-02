import React from 'react'
import Newm from './Newm'
import Day from './Day'
import Modulo from './Modulo'
import Equation from './Equation'
import Astronomy from './Astronomy'
import Time from './Time'
import Intro from './Intro'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.tabTitles = ['簡介', '朔閏表', '曆書', '同餘', '方程', '天文', '時間']
    this.state = {
      calendars: [],
      YearStart: '',
      YearEnd: '',
      // YearMode: '0',
      AutoMode: 0,
      output: '',
      activeTab: 0,
    };
  }

  renderTabs() {
    return (<span className="section-select-container">
      {this.tabTitles.map((title, index) => (<span className={"section-select" + (this.state.activeTab === index ? ' active' : '')} onClick={e => {
        if (this.state.activeTab === index) {
          return
        }
        // if (index === 2) {
        //   alert('[五星] 預計2023年推出，敬請期待～')
        //   return
        // }
        this.setState({
          activeTab: index,
          // AutoMode: 0,
          output: '',
          loading: false,
        })
      }} >{title}</span>))}
    </span>)
  }

  renderTabContent() {
    if (this.state.activeTab === 0) {
      return (
        <Intro />
      )
    } else if (this.state.activeTab === 1) {
      return (
        <Newm />
      )
    } else if (this.state.activeTab === 2) {
      return (
        <Day />
      )
    } else if (this.state.activeTab === 3) {
      return (
        <Modulo />
      )
    } else if (this.state.activeTab === 4) {
      return (
        <Equation />
      )
    } else if (this.state.activeTab === 5) {
      return (
        <Astronomy />
      )
    } else if (this.state.activeTab === 6) {
      return (
        <Time />
      )
    }
  }

  render() {
    return (
      <div className='App'>
        {this.renderTabs()}
        {/* {this.renderLoading()} */}
        {/* {this.renderMode()} */}
        {this.renderTabContent()}
      </div>
    );
  }
}
