import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  Popover,
  Row,
  Select,
  TimePicker,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import TableForm from './components/TableForm';
import FooterToolbar from './components/FooterToolbar';
import styles from './style.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ serverNode, loading }) => ({
  submitting: loading.effects['serverNode/submitAdvancedForm'],
  loading: loading.effects['serverNode/fetch'],
  servers: serverNode,
}))
class AdvancedForm extends Component {
  state = {
    width: '100%',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    console.log('-----------------')
    dispatch({
      type: 'serverNode/fetch',
    });
  }

  validate = () => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      console.log('values------->', values)
      if (!error) {
        // submit the values
        dispatch({
          type: 'serverNode/add',
          payload: values,
        });
      }
    });
  };
  onChange = async (data) => {
    console.log('onChange data----', data)
    const {
      dispatch,
    } = this.props;
    await dispatch({
      type: 'serverNode/add',
      payload: data,
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      submitting,
      servers
    } = this.props;
    const { width } = this.state;
    return (
      <>
        <PageHeaderWrapper content="管理服务器、二级域名、映射关系等">
          <Card bordered={false}>
            {getFieldDecorator('members', {
              initialValue: servers.serverList,
            })(<TableForm onChange={this.onChange}/>)}
          </Card>
        </PageHeaderWrapper>
      </>
    );
  }
}

export default Form.create()(AdvancedForm);
