import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import gfm from 'remark-gfm'
import md1 from '../note/guqin.md'
import Cent from './Cent'
import Frequency from './Frequency'
import Justoni from './Justoni'
import Pythagorean from './Pythagorean'
import Pythagorean60 from './Pythagorean60'
import Hechengtian from './Hechengtian'
import Meantone4 from './Meantone4'
import Meantone3 from './Meantone3'
import Fret2Leng from './Fret2Leng'
import Leng2Fret from './Leng2Fret'
import Equal12 from './Equal12'
import Equal19 from './Equal19'
import Tuning from './Tuning'
import FretPitch from './FretPitch'
import BetweenFret from './BetweenFret'
import Position2Pitch from './Position2Pitch'

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
          <h2>基礎</h2>
          <Cent />
          <br />
          <Frequency />
          <Fret2Leng />
          <br />
          <Leng2Fret />
          <h2>生律之什</h2>
          <h3>五度律</h3>
          <Pythagorean />
          <Pythagorean60 />
          <h3>純律</h3>
          <Justoni />
          <h3>調律</h3>
          <Hechengtian />
          <Meantone4 />
          <Meantone3 />
          <h3>等程律</h3>
          <Equal12 />
          <Equal19 />
          <h2>品弦法</h2>
          <Tuning />
          <h2>徽位之什</h2>
          <FretPitch />
          <BetweenFret />
          <h2>打譜第一步</h2>
          <Position2Pitch />
        </section>
        <hr />
        <article>
          <ReactMarkdown rehypePlugins={[rehypeRaw, gfm]} children={md} />
        </article>
      </>
    )
  }
}