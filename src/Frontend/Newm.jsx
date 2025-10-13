import React from "react";
import { NameList } from "Cal/parameter/constants.mjs";
import MultiSelectMenu from "./MultiSelectMenu";
import MyWorker from "workers/worker_ancient.mjs?worker";

const TableRowNameMap = {
  MonthPrint: " ",
  NewmAvgScPrint: "經朔",
  NewmAvgDeciPrint: " ",
  NewmScPrint: "定朔",
  NewmNowlineDeciPrint: "注曆",
  NewmAcrDeciPrint: "交食",
  NewmDeci3Print: "三次",
  NewmDeci2Print: "二次",
  NewmDeci1Print: "線性",
  NewmEquaPrint: "赤道",
  NewmEclpPrint: "黃道",
  SyzygyScPrint: "望",
  SyzygyNowlineDeciPrint: "注曆",
  SyzygyDeciPrint: " ",
  TermUpNamePrint: "節氣",
  TermUpScPrint: "平氣",
  TermUpDeciPrint: " ",
  TermUpAcrScPrint: "定氣",
  TermUpAcrDeciPrint: " ",
  TermUpNowDeciPrint: "迭代",
  TermUpEquaPrint: "赤道",
  TermUpEclpPrint: "黃道",
  TermDownNamePrint: "節氣",
  TermDownScPrint: "恆氣",
  TermDownDeciPrint: " ",
  TermDownAcrScPrint: "定氣",
  TermDownAcrDeciPrint: " ",
  TermDownNowDeciPrint: "迭代",
  TermDownEquaPrint: "赤道",
  TermDownEclpPrint: "黃道"
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
      showTableList: false,
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

  _getFileName() {
    let calString = `${this.state.calendars}_${this.state.YearStart}`;
    if (this.state.YearEnd) {
      calString += `_${this.state.YearEnd}`;
    }
    calString += "_";
    const date = new Date();
    let dateString = date.getFullYear().toString();
    [
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
    ].forEach((num) => {
      dateString = dateString + num.toString().padStart(2, "0");
    });
    return calString + dateString;
  }

  renderCalendar() {
    return (
      <span>
        <MultiSelectMenu
          Calendars={NameList}
          onSelect={(selected) => {
            this.setState({ calendars: selected });
          }}
        />
      </span>
    );
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
        {/* {this.state.mode === '1' ? ( */}
        <span className="year-end">
          <span>—</span>
          <input
            value={this.state.YearEnd}
            onChange={(e) => {
              this.setState({ YearEnd: e.currentTarget.value });
            }}
          />
          <span>年</span>
        </span>
        {/* ) : null} */}
      </span>
    );
  }

  handleRetrieve() {
    const isAuto = (this.isAuto && this.isAuto.checked) || false;
    const isDetail = (this.isDetail && this.isDetail.checked) || false;
    if (this.state.calendars.length === 0 && isAuto === false) {
      alert("Please choose a calendar");
      return;
    }
    let YearStart = parseInt(this.state.YearStart);
    let YearEnd = parseInt(this.state.YearEnd);
    if (this.state.YearStart.length === 0 && this.state.YearEnd.length === 0) {
      const date = new Date();
      const year = date.getFullYear();
      YearStart = year;
      YearEnd = year;
      this.setState({ YearStart });
      this.setState({ YearEnd });
      return;
    }
    if (isAuto) {
      if (
        YearStart < -721 ||
        YearStart > 1913 ||
        YearEnd < -721 ||
        YearEnd > 1913
      ) {
        alert("Year range of AutoChoose mode: -721 to 1913");
        return;
      }
    } else {
      if (
        YearStart < -3807 ||
        YearStart > 9999 ||
        YearEnd < -3807 ||
        YearEnd > 9999
      ) {
        // -3808爲景初曆上元
        alert("Year range: -3807 to 9999");
        return;
      }
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
    const callWorker = (eventName) => {
      this.setState({ loading: true });
      this.worker.postMessage({
        eventName,
        YearStart,
        YearEnd,
        isAuto,
        isDetail,
        ...this.state,
      });
    };
    if (this.downloadRef && this.downloadRef.checked) {
      callWorker("Print");
      return;
    }
    if (this.state.calendars.length * (YearEnd - YearStart) > 200) {
      alert("內容過多，爲避免瀏覽器展示性能問題，請下載.md文件到本地");
      return;
    }
    callWorker("Newm");
    this.setState({
      showTableList: true,
    });
  }

  // renderLoading() {
  //   return this.state.loading ? (
  //     <div className="loading-view">
  //       <p className="loading-text">计算中，请稍候...</p>
  //     </div>
  //   ) : null;
  // }

  renderDownload() {
    return (
      <span>
        <input
          type="checkbox"
          name="download-file"
          ref={(ref) => {
            this.downloadRef = ref;
          }}
        />
        <label>保存爲.md文件</label>
      </span>
    );
  }

  renderAutoCal() {
    return (
      <span>
        <input
          type="checkbox"
          name="isAuto"
          ref={(ref) => {
            this.isAuto = ref;
          }}
        />
        <label>自動選擇當年曆法</label>
      </span>
    );
  }
  renderDetail() {
    return (
      <span style={{ marginLeft: '10px' }}>
        <input
          type="checkbox"
          name="isDetail"
          ref={(ref) => {
            this.isDetail = ref;
          }}
        />
        <label>詳細信息</label>
      </span>
    );
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
          }
        });
        // Return the array of spans and line breaks
        return elements;
      }
      // If yearInfo is not an array or is null/undefined, return an empty fragment
      return <></>;
    }
    // renderMonthInfo函數由ChatGPT-4生成
    const renderMonthInfo = (data) => {
      const isDetail = (this.isDetail && this.isDetail.checked) || false;
      if (isDetail === true) {
        return (
          <table style={{ border: 'none', textAlign: 'right' }}>
            <thead><tr><td></td><td>經朔 距冬至</td><td>入轉</td><td>入交</td><td>經望 距冬至</td><td>入轉</td><td>入交</td></tr></thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <td key={`cell-${rowIndex}-${cellIndex}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      } else {
        return null;
      }

    };
    const renderEcliInfo = (data) => {
      if ((data || []).length) {
        return (
          <table style={{ border: 'none', textAlign: 'right' }}>
            <thead><tr><td></td><td>食分</td><td>日出入</td><td>初虧</td><td>食甚</td><td>復圓</td><td>日出入</td><td>食甚日或月黃經</td><td>黃緯</td><td>赤經</td><td>赤緯</td></tr></thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <td key={`cell-${rowIndex}-${cellIndex}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      } else {
        return null;
      }
    };

    return (
      <section className="main-render">
        {(this.state.output || []).map((CalData, index) => {
          return CalData.map((calInfo, index2) => {
            return (
              <div key={`cal-${index}-${index2}`} className="single-cal">
                <h3>{calInfo.Era}</h3>
                <p>
                  {renderYearInfo(calInfo.YearInfo)}
                </p>
                {renderEcliInfo(calInfo.EcliInfo)}
                {renderMonthInfo(calInfo.MonthInfo)}
                <table>
                  <tbody>
                    <tr>{this.RenderTableContent(calInfo)}</tr>
                  </tbody>
                </table>
              </div>
            );
          });
        })}
      </section>
    );
  }

  // GPT。後端輸入「10+」，變成「10<span>+</span>」
  RenderTableContent(calInfo) {
    // Helper function to wrap symbols with a span
    const wrapSymbolsWithSpan = (text) => {
      // Define the symbols to wrap and their corresponding class names
      const symbols = {
        '+': 'NewmPlus',
        '-': 'SyzygySub',
        "●": 'eclipse-symbol',
        "◐": 'eclipse-symbol',
        "◔": 'eclipse-symbol'
      };
      // Split the text into parts by symbols and keep the separators (symbols)
      const parts = text.split(/(\+|\-|●|◐|◔)/g);
      // Transform parts into an array of strings or JSX elements
      return parts.map((part, index) => {
        // If the part is a symbol, return a JSX span element
        if (symbols[part]) {
          return <span key={index} className={symbols[part]}>{part}</span>;
        }
        // Otherwise, return the string as is
        return part;
      });
    }
    return Object.entries(calInfo).map(([key, value], rowIdx) => {
      if (Array.isArray(value) && value.length > 0 && TableRowNameMap[key]) {
        return (
          <tr key={rowIdx} className={key}>
            <th>{TableRowNameMap[key]}</th>
            {value.map((x, index) => (
              <td key={`${key}-${index}`}>
                {wrapSymbolsWithSpan(x)}
              </td>
            ))}
          </tr>
        );
      }
      return null;
    });
  }

  render() {
    return (
      <>
        <div className="one-row">
          <div>
            {this.renderCalendar()}
            {this.renderAutoCal()}
            {this.renderDetail()}
          </div>
          <div>
            {this.renderInput()}
            <button onClick={this.handleRetrieve} className="button1">
              天霝〻地霝〻
            </button>
            {this.renderDownload()}
          </div>
        </div>
        {this.renderTableList()}
      </>
    );
  }
}
