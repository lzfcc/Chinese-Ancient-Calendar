import React from "react"
import Dayanqiuyi from "./Qiuyi"
import Gcdlcm from "./GcdLcm"
import Fraclcm from "./FracLcm"
import IndetermEqua1 from "./IndetermEqua1"
import IndetermEqua from "./IndetermEqua"
import Sunzi from "./Sunzi"
import ContinuedFrac from "./ContinuedFrac"
import ContinuedFrac1 from "./ContinuedFrac1"
import Denom from "./Denom"
import Zhang from "./Zhang"
import Origin from "./Origin"
import Origin2 from "./Origin2"
import ExhauDenom from './ExhauDenom'
import ExhauOrigin from './ExhauOrigin'
import ExhauConst from './ExhauConst'

export default class Converter extends React.Component {
  render() {
    return (
      <section className="modulo">
        <h2>大衍之什</h2>
        <Dayanqiuyi />
        <IndetermEqua1 />
        <Sunzi />
        <h2>調日法之什</h2>
        <IndetermEqua />
        <Denom />
        <ContinuedFrac />
        <p></p>
        <ContinuedFrac1 />
        <h2>章蔀之什</h2>
        <Gcdlcm />
        <Fraclcm />
        <Zhang />
        <h2>上元演紀之什</h2>
        <Origin2 />
        <Origin />
        <h2>從零開始造唐宋曆</h2>
        <ExhauDenom />
        <ExhauOrigin />
        <ExhauConst />
      </section>
    );
  }
}
