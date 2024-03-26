import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import gfm from 'remark-gfm'
import md1 from '../note/hexo.md'
import HexoZhuxi from './HexoZhuxi'
import HexoZhuxiB from './HexoZhuxiB'
import HexoQinghua from './HexoQinghua'


export default class Astronomy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      md: ''
    };
  }
  UNSAFE_componentWillMount() {
    fetch(md1)
      .then(res => res.text())
      .then(text => this.setState({ md: text }))
  }
  render() {
    const { md } = this.state
    return (
      <>
        <section className='modulo'>
          <h2>筮占</h2>
          <HexoZhuxi />
          <HexoZhuxiB />
          <HexoQinghua />
        </section>
        <hr />
        <article>
          <ReactMarkdown rehypePlugins={[rehypeRaw, gfm]} children={md} />
        </article>
      </>
    )
  }
}