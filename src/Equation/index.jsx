import React from 'react'
import Equa1 from './Equa1'
// import Sqrt1 from './Sqrt1'
// import Sqrt3 from './Sqrt3'
import Sn1 from './Sn1'
import Sn2 from './Sn2'
import Sn5 from './Sn5'
import Interpolate1 from './Interpolate1'
import Interpolate2 from './Interpolate2'
import Interpolate3 from './Interpolate3'
import Round from './Round'
import Round1 from './Round1'
import Round2 from './Round2'
import Heron from './Heron'
import Hushigeyuan from './Hushigeyuan'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import md1 from '../note/equation.md';

export default class Equation extends React.Component {
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
          <h2>垛積之什</h2>
          <Sn1 />
          <Sn5 />
          <Sn2 />
          <h2>內插之什</h2>
          <Interpolate1 />
          <p></p>
          <Interpolate2 />
          <Interpolate3 />
          <h2>方程之什</h2>
          <Equa1 />
          <h2>幾何之什</h2>
          <Round />
          <p></p>
          <Round2 />
          <p></p>
          <Round1 />
          <Hushigeyuan />
          <Heron />
          {/* <h2>開方之什</h2>
        <Sqrt1 />
        <Sqrt3 /> */}
        </section>
        <hr />
        <article>
          <ReactMarkdown rehypePlugins={[rehypeRaw]} children={md} />
        </article>
      </>
    )
  }
}