import { Drawer, Tabs, Descriptions, Badge } from 'antd';
import React from 'react';
const { TabPane } = Tabs;

const Dashboard = () => {
  return (
    <Descriptions bordered>
      <Descriptions.Item label="CPU">2%</Descriptions.Item>
      <Descriptions.Item label="内存">8%</Descriptions.Item>
      <Descriptions.Item label="磁盘">60%</Descriptions.Item>
      <Descriptions.Item label="IO">600</Descriptions.Item>
      <Descriptions.Item label="Status" span={3}>
        <Badge status="processing" text="Running" />
      </Descriptions.Item>
      <Descriptions.Item label="Config Info">
        Data disk type: MongoDB
        <br />
        Database version: 3.4
        <br />
        Package: dds.mongo.mid
        <br />
        Storage space: 10 GB
        <br />
        Replication factor: 3
        <br />
        Region: East China 1<br />
      </Descriptions.Item>
    </Descriptions>
  )
}
const Detail = props => {
  const { detailVisible, handleDetailVisible } = props;
  return (
    <Drawer
      title="主机详情"
      placement="right"
      closable={true}
      onClose={handleDetailVisible}
      visible={detailVisible}
      width={580}
    >
      <Tabs defaultActiveKey="1" >
        <TabPane tab="资源概况" key="1">
          <Dashboard/>
        </TabPane>
        <TabPane tab="服务版本(2)" key="2">
          上面的版本镜像列表
        </TabPane>
        <TabPane tab="客户容器(5)" key="3">
          客户列表
        </TabPane>
      </Tabs>
    </Drawer>
  );
};

export default Detail;
