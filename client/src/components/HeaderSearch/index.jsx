import { AutoComplete, Icon, Input } from 'antd';
import React, { Component } from 'react';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import styles from './index.less';
export default class HeaderSearch extends Component {
  static defaultProps = {
    defaultActiveFirstOption: false,
    onPressEnter: () => {},
    onSearch: () => {},
    onChange: () => {},
    className: '',
    placeholder: '',
    dataSource: [],
    defaultOpen: false,
    onVisibleChange: () => {},
  };

  static getDerivedStateFromProps(props) {
    if ('open' in props) {
      return {
        searchMode: props.open,
      };
    }

    return null;
  }

  inputRef = null;

  constructor(props) {
    super(props);
    this.state = {
      searchMode: props.defaultOpen,
      value: props.defaultValue,
    };
    this.debouncePressEnter = debounce(this.debouncePressEnter, 500, {
      leading: true,
      trailing: false,
    });
  }

  onKeyDown = e => {
    if (e.key === 'Enter') {
      this.debouncePressEnter();
    }
  };
  onChange = value => {
    if (typeof value === 'string') {
      const { onSearch, onChange } = this.props;
      this.setState({
        value,
      });

      if (onSearch) {
        onSearch(value);
      }

      if (onChange) {
        onChange(value);
      }
    }
  };
  enterSearchMode = () => {
    const { onVisibleChange } = this.props;
    onVisibleChange(true);
    this.setState(
      {
        searchMode: true,
      },
      () => {
        const { searchMode } = this.state;

        if (searchMode && this.inputRef) {
          this.inputRef.focus();
        }
      },
    );
  };
  leaveSearchMode = () => {
    this.setState({
      searchMode: false,
    });
  };
  debouncePressEnter = () => {
    const { onPressEnter } = this.props;
    const { value } = this.state;
    onPressEnter(value || '');
  };

  render() {
    const { className, defaultValue, placeholder, open, ...restProps } = this.props;
    const { searchMode, value } = this.state;
    delete restProps.defaultOpen; // for rc-select not affected

    const inputClass = classNames(styles.input, {
      [styles.show]: searchMode,
    });
    return (
      <span
        className={classNames(className, styles.headerSearch)}
        onClick={this.enterSearchMode}
        onTransitionEnd={({ propertyName }) => {
          if (propertyName === 'width' && !searchMode) {
            const { onVisibleChange } = this.props;
            onVisibleChange(searchMode);
          }
        }}
      >
        <Icon type="search" key="Icon" />
        <AutoComplete
          key="AutoComplete"
          {...restProps}
          className={inputClass}
          value={value}
          onChange={this.onChange}
        >
          <Input
            ref={node => {
              this.inputRef = node;
            }}
            defaultValue={defaultValue}
            aria-label={placeholder}
            placeholder={placeholder}
            onKeyDown={this.onKeyDown}
            onBlur={this.leaveSearchMode}
          />
        </AutoComplete>
      </span>
    );
  }
}
