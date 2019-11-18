import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Menu,
  Row,
  Select,
  message,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import UpdateForm from './components/UpdateForm';
import Upgrade from './components/Upgrade';
import { findIndex } from 'lodash';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = ['error', 'processing', 'default'];
const status = ['未启动', '运行中', '关闭'];

const MoreBtn = ({ item, upgradeAndAction }) => (
  <Dropdown
    overlay={
      <Menu onClick={({ key }) => upgradeAndAction(key, item)}>
        <Menu.Item key="upgrade">升级</Menu.Item>
        {item.state === 1 ? <Menu.Item key="stop">停止</Menu.Item> : <Menu.Item key="start">启动</Menu.Item>}
      </Menu>
    }
  >
    <a>
      更多 <Icon type="down" />
    </a>
  </Dropdown>
);

/* eslint react/no-multi-comp:0 */
@connect(({ customer, loading }) => ({
  customer,
  loading: loading.models.customer,
  loadingVersionList: loading.effects['customer/fetchVersionList'],
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    upgradeModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    selectedCust: {},
  };

  columns = [
    {
      title: '客户名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'describe',
    },
    {
      title: '域名',
      dataIndex: 'domain',
    },
    {
      title: '节点:端口',
      dataIndex: 'serverfPort',
      render(val, cl) {
        console.log('serverfPort---', cl)
        if (!cl.server) {
          return <i style={{ color: 'red', fontStyle: 'normal' }}>节点未找到</i>
        }
        return <React.Fragment>{cl.server.name}(<i style={{color: 'rgba(0,0,0,0.45)', fontStyle: 'normal'}}>{cl.server.ip}:{cl.port}</i>)</React.Fragment>;
      },
    },
    {
      title: '版本',
      dataIndex: 'versionName',
    },
    {
      title: '状态',
      dataIndex: 'state',
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>配置</a>
          <Divider type="vertical" />
          <MoreBtn key="more" item={record} upgradeAndAction={this.upgradeAndAction} />
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/fetchServerList',
    });
    dispatch({
      type: 'customer/fetch',
    });
  }

  upgradeAndAction = (key, item) => {
    console.log('editAndDelete---', key, item)
    const { dispatch } = this.props;
    if (key === 'upgrade') {
      this.setState({
        selectedCust: item,
      })
      this.toFetchVersionList(item.server._id)
      this.handleUpgradeModalVisible()
    } else {
      // 开启或者关闭
      dispatch({
        type: 'customer/updateContainerState',
        payload: { cust: item._id, action: key },
      })
    }
  }

  toFetchVersionList = (server) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/fetchVersionList',
      payload: server,
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'customer/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'customer/fetch',
      payload: {},
    });
  };


  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'customer/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    if (flag) {
      const { dispatch, customer } = this.props;
      console.log('handleModalVisible---', flag, customer)
      // 首次打开需要去请求一下版本信息
      if (customer.serverList && customer.serverList.length > 0) {
        dispatch({
          type: 'customer/fetchVersionList',
          payload: customer.serverList[0]._id,
        });
      }
    }
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpgradeModalVisible = () => {
    this.setState({
      upgradeModalVisible: !this.state.upgradeModalVisible,
    });
  };

  handleAdd = fields => {
    const { dispatch, customer } = this.props;
    console.log(customer.versionList, '--handleAdd---', fields)
    const itemIndex = findIndex(customer.versionList, (item) => {
      console.log(fields.serverVersion, '--item----->', item)
      return item.Id === fields.serverVersion
    })
    console.log('add itemIndex---->', itemIndex)
    if (itemIndex !== -1) {
      fields.versionName = customer.versionList[itemIndex].RepoTags[0]
    }
    console.log(fields)
    dispatch({
      type: 'customer/add',
      payload: fields,
    });
    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpgrade = toVersion => {
    const { dispatch } = this.props;
    const { selectedCust } = this.state
    console.log('handleUpgrade---', toVersion, selectedCust);
    dispatch({
      type: 'customer/toUpgradeServer',
      payload: {
        cust: selectedCust._id,
        action: 'upgrade',
        data: {
          serverVersion: toVersion.Id,
          versionName: toVersion.RepoTags[0],
        },
      },
    });
    message.success('升级成功');
    this.handleUpgradeModalVisible();
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={8} sm={24}>
            <FormItem label="客户名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select
                  placeholder="请选择"
                  style={{
                    width: '100%',
                  }}
                >
                  <Option value="0">全部</Option>
                  <Option value="1">关闭</Option>
                  <Option value="2">运行中</Option>
                  <Option value="2">异常</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
                onClick={this.handleFormReset}
              >
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    const {
      customer: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, upgradeModalVisible } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const upgradeMethods = {
      handleUpgrade: this.handleUpgrade,
      handleUpgradeModalVisible: this.handleUpgradeModalVisible,
    };
    return (
      <PageHeaderWrapper content="管理代理商、服务访问、版本使用等" extraContent={[<Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>新建</Button>]}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm serverList={this.props.customer.serverList}
                    loadingVersionList={this.props.loadingVersionList}
                    versionList={this.props.customer.versionList}
                    {...parentMethods} modalVisible={modalVisible} />
        <Upgrade data={this.props.customer.versionList}
                 upgradeModalVisible={upgradeModalVisible}
                 {...upgradeMethods}
                 loadingVersionList={this.props.loadingVersionList}/>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
