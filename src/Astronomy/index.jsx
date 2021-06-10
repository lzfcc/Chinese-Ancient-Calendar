import React from 'react'
import BindTcorr from './AcrV'
import BindEqua2Eclp from './Equa2Eclp'
import Deg2Mansion from './Deg2Mansion'
import Mansion2Deg from './Mansion2Deg'
import BindLongi2Lati from './Longi2Lati'
import MoonLongi from './MoonLongi'
import Const from './Const'
import Deciaml2Angle from './Deciaml2Angle'
import SunEclipse from './SunEclipse'
import MoonEclipse from './MoonEclipse'
import Node2Cycle from './Node'
import Cycle2Node from './EcliRange'
import Regression from './Regression'
import Round from './Round'
import Round1 from './Round1'
import Round2 from './Round2'
import Hushigeyuan from './Hushigeyuan'
import Heron from './Heron'
import SolarChange from './SolarChange'
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
          <h2>躔離朓朒</h2>
          <BindTcorr />
          <h2>日度之什</h2>
          <Deg2Mansion />
          <p></p>
          <Mansion2Deg />
          <BindEqua2Eclp />
          <Round />
          <p></p>
          <Round2 />
          <p></p>
          <Round1 />
          <Hushigeyuan />
          <Heron />
          <h2>步晷漏</h2>
          <BindLongi2Lati />
          <h2>月度月緯</h2>
          <MoonLongi />
          <h2>交食之什</h2>
          <SunEclipse />
          <MoonEclipse />
          <Cycle2Node />
          <Node2Cycle />
          <Regression />
          <h2>現代天文計算</h2>
          <Deciaml2Angle />
          <Const />
          <SolarChange />
        </section>
        <hr />
        <article>
          <ReactMarkdown rehypePlugins={[rehypeRaw]} children={md} />
        </article>
      </>
    )
  }
}