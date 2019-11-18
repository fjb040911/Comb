import { Badge, Icon, Spin, Tabs } from 'antd';
import React, { Component } from 'react';
import classNames from 'classnames';
import NoticeList from './NoticeList';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
const { TabPane } = Tabs;
export default class NoticeIcon extends Component {
  static Tab = NoticeList;
  static defaultProps = {
    onItemClick: () => {},
    onPopupVisibleChange: () => {},
    onTabChange: () => {},
    onClear: () => {},
    onViewMore: () => {},
    loading: false,
    clearClose: false,
    emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
  };
  state = {
    visible: false,
  };
  onItemClick = (item, tabProps) => {
    const { onItemClick } = this.props;

    if (onItemClick) {
      onItemClick(item, tabProps);
    }
  };
  onClear = (name, key) => {
    const { onClear } = this.props;

    if (onClear) {
      onClear(name, key);
    }
  };
  onTabChange = tabType => {
    const { onTabChange } = this.props;

    if (onTabChange) {
      onTabChange(tabType);
    }
  };
  onViewMore = (tabProps, event) => {
    const { onViewMore } = this.props;

    if (onViewMore) {
      onViewMore(tabProps, event);
    }
  };

  getNotificationBox() {
    const { children, loading, clearText, viewMoreText } = this.props;

    if (!children) {
      return null;
    }

    const panes = React.Children.map(children, child => {
      if (!child) {
        return null;
      }

      const { list, title, count, tabKey, showClear, showViewMore } = child.props;
      const len = list && list.length ? list.length : 0;
      const msgCount = count || count === 0 ? count : len;
      const tabTitle = msgCount > 0 ? `${title} (${msgCount})` : title;
      return (
        <TabPane tab={tabTitle} key={title}>
          <NoticeList
            clearText={clearText}
            viewMoreText={viewMoreText}
            data={list}
            onClear={() => this.onClear(title, tabKey)}
            onClick={item => this.onItemClick(item, child.props)}
            onViewMore={event => this.onViewMore(child.props, event)}
            showClear={showClear}
            showViewMore={showViewMore}
            title={title}
            {...child.props}
          />
        </TabPane>
      );
    });
    return (
      <>
        <Spin spinning={loading} delay={300}>
          <Tabs className={styles.tabs} onChange={this.onTabChange}>
            {panes}
          </Tabs>
        </Spin>
      </>
    );
  }

  handleVisibleChange = visible => {
    const { onPopupVisibleChange } = this.props;
    this.setState({
      visible,
    });

    if (onPopupVisibleChange) {
      onPopupVisibleChange(visible);
    }
  };

  render() {
    const { className, count, popupVisible, bell } = this.props;
    const { visible } = this.state;
    const noticeButtonClass = classNames(className, styles.noticeButton);
    const notificationBox = this.getNotificationBox();
    const NoticeBellIcon = bell || <Icon type="bell" className={styles.icon} />;
    const trigger = (
      <span
        className={classNames(noticeButtonClass, {
          opened: visible,
        })}
      >
        <Badge
          count={count}
          style={{
            boxShadow: 'none',
          }}
          className={styles.badge}
        >
          {NoticeBellIcon}
        </Badge>
      </span>
    );

    if (!notificationBox) {
      return trigger;
    }

    const popoverProps = {};

    if ('popupVisible' in this.props) {
      popoverProps.visible = popupVisible;
    }

    return (
      <HeaderDropdown
        placement="bottomRight"
        overlay={notificationBox}
        overlayClassName={styles.popover}
        trigger={['click']}
        visible={visible}
        onVisibleChange={this.handleVisibleChange}
        {...popoverProps}
      >
        {trigger}
      </HeaderDropdown>
    );
  }
}
