import React from 'react'
import BindTcorr from './AcrV'
import BindEqua2Eclp from './Equa2Eclp'
import BindLongi2Lati from './Longi2Lati'
import MoonLongi from './MoonLongi'
import Const from './Const'
import Deciaml2Angle from './Deciaml2Angle'
import SunEclipse from './SunEclipse'
import MoonEclipse from './MoonEclipse'
import Node2Cycle from './Node'
import Cycle2Node from './EcliCycle'
// import  BindEqua2Eclp from './'
// import  BindEqua2Eclp from './' 
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import md1 from '../note/astronomy.md';

export default class Astronomy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      md: ''
    };
  }
  componentWillMount() {
    fetch(md1)
      .then(res => res.text())
      .then(text => this.setState({ md: text }))
  }
  render() {
    const { md } = this.state
    return (
      <>
        <section className='modulo'>
          <h2>躔離之什</h2>
          <BindTcorr />
          <h2>軌道之什</h2>
          <BindEqua2Eclp />
          <BindLongi2Lati />
          <MoonLongi />
          <h2>交食之什</h2>
          <SunEclipse />
          <MoonEclipse />
          <Cycle2Node />
          <Node2Cycle />
          <h2>現代天文計算</h2>
          <Deciaml2Angle />
          <Const />
        </section>
        <hr />
        <article>
          <ReactMarkdown rehypePlugins={[rehypeRaw]} children={md} />
        </article>
      </>
    )
  }
}