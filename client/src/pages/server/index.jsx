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
  message, Popconfirm,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import UpdateForm from './components/UpdateForm';
import styles from './style.less';
import Detail from './components/Detail';

const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

/* eslint react/no-multi-comp:0 */
@connect(({ serverNode, loading }) => ({
  submitting: loading.effects['serverNode/submitAdvancedForm'],
  loading: loading.effects['serverNode/fetch'],
  servers: serverNode,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    detailVisible: false,
  };

  columns = [
    {
      title: '节点名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'describe',
    },
    {
      title: 'IP',
      dataIndex: 'ip',
    },
    {
      title: '状态',
      dataIndex: 'state',
      filters: [
        {
          text: status[0],
          value: '0',
        },
        {
          text: status[1],
          value: '1',
        },
        {
          text: status[2],
          value: '2',
        },
        {
          text: status[3],
          value: '3',
        },
      ],

      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Popconfirm title="是否要删除此节点？" onConfirm={() => this.remove(record)}>
            <a>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a onClick={() => { this.viewMore(record) } }>更多</a>
        </Fragment>
      ),
    },
  ];

  viewMore = (item) => {
    this.handleDetailVisible()
  }

  remove(node) {
    console.log('node---', node)
    const { dispatch } = this.props;
    dispatch({
      type: 'serverNode/remove',
      payload: node._id,
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'serverNode/fetch',
    });
  }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'serverNode/add',
      payload: {
        name: fields.name,
        describe: fields.describe,
        ip: fields.ip,
      },
    });
    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'listAndtableList/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });
    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  handleDetailVisible = () => {
    this.setState({ detailVisible: !this.state.detailVisible })
  }

  render() {
    const {
      servers: { serverList },
      loading,
    } = this.props;
    const { modalVisible, detailVisible } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <PageHeaderWrapper content="管理服务器、二级域名、映射关系等" extraContent={[<Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>新建</Button>]}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <StandardTable
              loading={loading}
              data={serverList}
              columns={this.columns}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible}/>
        <Detail handleDetailVisible={this.handleDetailVisible} detailVisible={detailVisible}/>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
