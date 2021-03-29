import React from 'react'
import Equa1 from './Equa1'
import Sqrt1 from './Sqrt1'
import Sqrt3 from './Sqrt3'
import Sn1 from './Sn1'
import Sn2 from './Sn2'
import Sn5 from './Sn5'
import Interpolate1 from './Interpolate1'
import Interpolate2 from './Interpolate2'
import Interpolate3 from './Interpolate3'
import Round from './Round'
import Heron from './Heron'

export default class Equation extends React.Component {
  render() {
    return (
      <section className='modulo'>
        <div className='modulo'>
          <h2>開方之什</h2>
          <Sqrt1 />
          <Sqrt3 />
          <h2>方程之什</h2>
          <Equa1 />
          <h2>垛積之什</h2>
          <Sn1 />
          <Sn5 />
          <Sn2 />
          <h2>內插之什</h2>
          <Interpolate1 />
          <Interpolate2 />
          <Interpolate3 />
          <h2>幾何之什</h2>
          <Round />
          <h3>弧矢割圓術</h3>
          <p className='note'><v>授時曆</v>黃赤轉換，見「轉換」標籤。</p>
          <Heron />
        </div>
      </section>
    )
  }
}