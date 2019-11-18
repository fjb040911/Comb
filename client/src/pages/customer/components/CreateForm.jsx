import { Form, Input, Modal, Select, DatePicker } from 'antd';
import React from 'react';

const FormItem = Form.Item;
const { Option } = Select;

const CreateForm = props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  const prefixSelector = form.getFieldDecorator('server', {
    initialValue: (props.serverList[0] ? props.serverList[0]._id : null),
  })(
    <Select>
      {props.serverList.map((item) => {
        return <Option key={item._id} value={item._id}><React.Fragment>{item.name}(<i style={{color: 'rgba(0,0,0,0.45)', fontStyle: 'normal'}}>{item.ip}</i>)</React.Fragment></Option>
      })}
    </Select>,
  );

  return (
    <Modal
      destroyOnClose
      title="新建客户"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 15,
        }}
        label="客户名称"
      >
        {form.getFieldDecorator('name', {
          rules: [
            {
              required: true,
              message: '请输入至少1-40个字符的名称！',
              min: 1,
              max: 40,
            },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 15,
        }}
        label="描述"
      >
        {form.getFieldDecorator('describe', {
          rules: [
            {
              required: true,
              message: '请输入至少五个字符的规则描述！',
              min: 5,
            },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 15,
        }}
        label="访问域名"
      >
        {form.getFieldDecorator('domain', {
          rules: [
            {
              required: true,
              message: '请输入二级域名！',
            },
          ],
        })(<Input addonBefore="http://" addonAfter=".callfeel.com" placeholder="请输入" />)}
      </FormItem>
      <FormItem
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 15,
        }}
        label="部署节点" >
        {prefixSelector}
      </FormItem>
      <FormItem
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 15,
        }}
        label="服务版本" >
        {form.getFieldDecorator('serverVersion', {
          rules: [
            {
              required: true,
              message: '请选择服务版本！',
            },
          ],
          initialValue: (props.versionList && props.versionList[0]) ? props.versionList[0].Id : '',
        })(
          <Select loading={props.loadingVersionList}>
            {
              props.versionList.map((item) => {
                return <Option key={item.Id} value={item.Id}>{item.RepoTags[0]}</Option>
              })
            }
          </Select>,
        )}
      </FormItem>
      <FormItem
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 15,
        }}
        label="有效期至">
        {form.getFieldDecorator('expiryDate', {
          rules: [{ type: 'object', required: true, message: '请选择时间!' }],
        })(<DatePicker />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create()(CreateForm);
