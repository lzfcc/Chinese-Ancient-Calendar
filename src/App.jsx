import React from 'react'
import Newm from './Newm'
import Day from './Day'
import Modulo from './Modulo'
import Equation from './Equation'
import Astronomy from './Astronomy'
import Time from './Time'
import Guqin from './Guqin'
import Hexo from './Hexo'
import Intro from './Intro'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.tabTitles = ['朔閏表', '曆書', '同餘', '招差', '天文', '時間', '琴律', '筮占', '簡介']
    this.state = {
      activeTab: 8,
    };
  }

  renderTabs() {
    return (<span className="section-select-container">
      {this.tabTitles.map((title, index) => (<span className={"section-select" + (this.state.activeTab === index ? ' active' : '')} onClick={e => {
        if (this.state.activeTab === index) {
          return
        }
        this.setState({
          activeTab: index,
          output: '',
          loading: false,
        })
      }} >{title}</span>))}
    </span>)
  }

  renderTabContent() {
    if (this.state.activeTab === 0) {
      return (
        <Newm />
      )
    } else if (this.state.activeTab === 1) {
      return (
        <Day />
      )
    } else if (this.state.activeTab === 2) {
      return (
        <Modulo />
      )
    } else if (this.state.activeTab === 3) {
      return (
        <Equation />
      )
    } else if (this.state.activeTab === 4) {
      return (
        <Astronomy />
      )
    } else if (this.state.activeTab === 5) {
      return (
        <Time />
      )
    } else if (this.state.activeTab === 6) {
      return (
        <Guqin />
      )
    } else if (this.state.activeTab === 7) {
      return (
        <Hexo />
      )
    } else if (this.state.activeTab === 8) {
      return (
        <Intro />
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
