import React from "react";
import MyWorker from "workers/worker_modern.mjs?worker";

const TableRowNameMap = {
  MonthPrint: " ",
  NewmScPrint: "定朔",
  NewmMmddPrint: "公曆",
  NewmUT1DeciPrint: "UT1",
  NewmEquaPrint: "赤道",
  NewmEclpPrint: "黃道",
  SyzygyScPrint: "定望",
  SyzygyMmddPrint: "公曆",
  SyzygyUT1DeciPrint: "UT1",
  TermUpNamePrint: "節氣",
  TermUpAcrScPrint: "定氣",
  TermUpAcrMmddPrint: "公曆",
  TermUpAcrDeciPrint: "UT1",
  TermUpEquaPrint: "赤道",
  TermUpEclpPrint: "黃道",
  TermDownNamePrint: "節氣",
  TermDownAcrScPrint: "定氣",
  TermDownAcrMmddPrint: "公曆",
  TermDownAcrDeciPrint: "UT1",
  TermDownEquaPrint: "赤道",
  TermDownEclpPrint: "黃道",
  showTableList: false,
};
export default class Newm extends React.Component {
  constructor(props) {
    super(props);
    this.handleRetrieve = this.handleRetrieve.bind(this);
    this.state = {
      calendars: [],
      YearStart: "",
      YearEnd: "",
      output: "",
      Longitude: 116.428,
    };
  }

  componentDidMount() {
    this.worker = new MyWorker();
    this.worker.addEventListener("message", ({ data }) => {
      if (data instanceof Blob) {
        // 约定：存为文件时 web worker 发送 Blob 对象
        this.setState({ output: [] });
        var fileName = `calendar_${this._getFileName()}.md`;
        var a = document.createElement("a");
        a.download = fileName;
        a.href = URL.createObjectURL(data);
        a.click();
        URL.revokeObjectURL(a.href);
        a = null;
      } else {
        // 约定：页面展示时 web worker 发送 Object 对象
        this.setState({ output: data });
      }
      this.setState({ loading: false });
    });
  }

  componentWillUnmount() {
    this.worker.terminate();
  }

  renderInput() {
    return (
      <span className="year-select">
        <input
          value={this.state.YearStart}
          onChange={(e) => {
            this.setState({ YearStart: e.currentTarget.value });
          }}
        />
        <span className="year-end">
          <span>—</span>
          <input
            value={this.state.YearEnd}
            onChange={(e) => {
              this.setState({ YearEnd: e.currentTarget.value });
            }}
          />
          <span>年&nbsp;&nbsp;</span>
        </span>
        <span>地理經度</span>
        <input
          className="width3"
          value={this.state.Longitude}
          onChange={(e) => {
            this.setState({ Longitude: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handleRetrieve() {
    let YearStart = parseInt(this.state.YearStart);
    let YearEnd = parseInt(this.state.YearEnd);
    const Longitude = parseFloat(this.state.Longitude);
    if (this.state.YearStart.length === 0 && this.state.YearEnd.length === 0) {
      const date = new Date();
      const year = date.getFullYear();
      YearStart = year;
      YearEnd = year;
      this.setState({ YearStart });
      this.setState({ YearEnd });
      return;
    }
    if (
      YearStart < -2498 ||
      YearStart > 2499 ||
      YearEnd < -2498 ||
      YearEnd > 2499
    ) {
      alert("Year range: -2499 to 2499");
      return;
    }
    if (Number.isNaN(YearStart) && Number.isNaN(YearEnd)) {
      alert("illegal input!");
      return;
    }
    if (Number.isNaN(YearEnd)) {
      if (this.state.YearEnd.length === 0) {
        YearEnd = YearStart;
        this.setState({ YearEnd });
      } else {
        alert("illegal end year!");
        return;
      }
    } else if (Number.isNaN(YearStart)) {
      if (this.state.YearStart.length === 0) {
        YearStart = YearEnd;
        this.setState({ YearStart });
      } else {
        alert("illegal start year!");
        return;
      }
    }
    if (YearStart > YearEnd) {
      [YearStart, YearEnd] = [YearEnd, YearStart];
      this.setState({ YearStart });
      this.setState({ YearEnd });
    }
    if (YearEnd - YearStart > 200) {
      alert("內容過多，爲避免瀏覽器展示性能問題，請減少年數");
      return;
    }
    const callWorker = (eventName) => {
      this.setState({ loading: true });
      this.worker.postMessage({
        eventName,
        YearStart,
        YearEnd,
        Longitude,
        ...this.state,
      });
    };
    callWorker("Newm");
    this.setState({
      showTableList: true,
    });
  }

  renderTableList() {
    // Only display the section if showTableList is true
    if (!this.state.showTableList) {
      return null;
    }
    // Helper function to render YearInfo as JSX
    const renderYearInfo = (yearInfo) => {
      // Check if yearInfo is an array and not null or undefined
      if (Array.isArray(yearInfo)) {
        // Initialize an array to hold all spans and line breaks
        const elements = [];
        // Process each object in the array
        yearInfo.forEach((obj, objIndex) => {
          if (obj) { // Make sure the object is not null or undefined
            // Process each key-value pair in the object
            Object.entries(obj).forEach(([key, value], keyIndex) => {
              // Add the span for the key-value pair
              elements.push(
                <span key={`${key}-${objIndex}-${keyIndex}`} className={key}>
                  {value}
                </span>
              );
              // Add a space after the span (except after the last key-value pair)
              if (keyIndex < Object.entries(obj).length - 1) {
                elements.push(' ');
              }
            });
            // Add a line break after the object (except after the last object)
            if (objIndex < yearInfo.length - 1) {
              elements.push(<br key={`br-${objIndex}`} />);
            }
          }
        });
        // Return the array of spans and line breaks
        return elements;
      }
      // If yearInfo is not an array or is null/undefined, return an empty fragment
      return <></>;
    }
    return (
      <section className="main-render">
        <p>此處提供現代天文學朔閏表，採用的模型是：DE441（-2499–1599）440（1600–2499）曆表、Vondrak 等歲差模型、IAU2000A 章動模型、Stephenson, Morrison 等 ΔT 公式。</p>
        {(this.state.output || []).map((CalData, index) => {
          return CalData.map((calInfo, index2) => {
            return (
              <div key={`cal-${index}-${index2}`} className="single-cal">
                <h3>{calInfo.Era}</h3>
                <p>
                  {renderYearInfo(calInfo.YearInfo)}
                </p>
                <table>
                  <tbody>
                    {this.RenderTableContent(calInfo)}
                  </tbody>
                </table>
              </div>
            );
          });
        })}
      </section>
    );
  }

  RenderTableContent(calInfo) {
    return Object.entries(calInfo).map(([key, value]) => {
      if (Array.isArray(value) && value.length > 0 && TableRowNameMap[key]) {
        return (
          <tr className={key}>
            {[<th>{TableRowNameMap[key]}</th>].concat(
              value.map((x) => (
                <td>{x}</td>
              ))
            )}
          </tr>
        );
      }
      return null;
    });
  }

  render() {
    return (
      <>
        <h2>DE440/1 朔閏表</h2>
        {this.renderInput()}
        <button onClick={this.handleRetrieve} className="button1">
          密合天行
        </button>
        {this.renderTableList()}
      </>
    );
  }
}
