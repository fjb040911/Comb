import { Button, Modal, List, Card, Popconfirm } from 'antd';
import React, { Component } from 'react';


class Upgrade extends Component {
  render() {
    const { upgradeModalVisible, handleUpgradeModalVisible, data, loadingVersionList, handleUpgrade } = this.props;
    return (
      <Modal
        width={640}
        bodyStyle={{
          padding: '32px 40px 48px',
        }}
        destroyOnClose
        title="升级服务"
        visible={upgradeModalVisible}
        onCancel={() => handleUpgradeModalVisible()}
      >
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={data}
          loading={loadingVersionList}
          renderItem={item => (
            <List.Item>
              <Card title={item.RepoTags[0]} style={{ width: 150 }} extra={
                <Popconfirm title="是否升级该用户的容器？" okText="升级" cancelText="取消" onConfirm={() => handleUpgrade(item)}>
                <a>升级</a>
                </Popconfirm>
              }>Release Note</Card>
            </List.Item>
          )}
        />
      </Modal>
    );
  }
}

export default Upgrade;
