import React from "react";
import "./index.css";

export default class MenuSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      dropDownVisible: false
    };
    this.inputRef = null;
  }

  render() {
    if (Object.keys(this.props.calMap).length <= 0) {
      return;
    }
    return (
      <div
        className={
          "chosen-container chosen-container-multi" +
          (this.setState.dropDownVisible
            ? " chosen-with-drop chosen-container-active"
            : "")
        }
        title=""
      >
        <ul
          className="chosen-choices"
          onClick={() => {
            this.inputRef && this.inputRef.focus();
            this.setState({ dropDownVisible: true });
          }}
        >
          {this.state.selected.map((calKey, index) => {
            return (
              <li className="search-choice">
                <span>{this.props.calMap[calKey]}</span>
                <div
                  className="search-choice-close"
                  data-option-array-index={index}
                  onClick={(event) => {
                    const selected = this.state.selected;
                    const deleteIndex = selected.indexOf(calKey);
                    selected.splice(deleteIndex, 1);
                    this.setState({ selected, dropDownVisible: false });
                    this.props.onSelect && this.props.onSelect(selected)
                  }}
                ></div>
              </li>
            );
          })}

          <li className="search-field">
            <input
              ref={(ref) => {
                this.inputRef = ref;
              }}
              className="chosen-search-input default"
              type="text"
              autoComplete="off"
              // placeholder="What's in your mind?"
              onKeyDown={(event) => {
                if (event.code === 'Backspace') {
                  const selected = this.state.selected;
                  selected.pop();
                  this.setState({ selected, dropDownVisible: false });
                  this.props.onSelect && this.props.onSelect(selected)
                }
              }}
              value={''}
            />
          </li>
        </ul>
        {this.state.dropDownVisible && (
          <select
            data-placeholder="Type 'C' to view"
            multiple
            className="chosen-select-no-results"
            tabIndex="-1"
            onChange={(event) => {
              const value = event.target.value;
              const selected = this.state.selected;
              if (!selected.includes(value)) {
                selected.push(value);
              }
              this.setState({ selected, dropDownVisible: false });
              this.props.onSelect && this.props.onSelect(selected)
            }}
          >
            {Object.entries(this.props.calMap).map(([calKey, calName], index) => {
              const disabled = this.state.selected.includes(calKey);
              return <option disabled={disabled} value={calKey}>{calName}</option>;
            })}
          </select>
        )}
      </div>
    );
  }
}
