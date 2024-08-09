import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, Upload, message } from 'antd';
import type { UploadFile } from 'antd/es/upload';


interface DataTypeOptions {
  value: string;
  label: string;
}

interface Props {
  onConfirm: (values: any) => void;
}

const TestDataConfig: React.FC<Props> = ({ onConfirm }) => {
  const [visible, setVisible] = useState(false);

  const showAddDataModal = () => {
    setVisible(true);
  };

  const hideAddDataModal = () => {
    setVisible(false);
  };

  const [form] = Form.useForm();

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    form.resetFields();
    hideAddDataModal();
  };

  const handleUploadChange = (info: { file: UploadFile; fileList: UploadFile[] }) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件上传成功.`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败.`);
    }
  };

  const dataTypeOptions: DataTypeOptions[] = [
    { value: 'account', label: '账号' },
    { value: 'product', label: '商品' },
    { value: 'store', label: '门店' },
  ];

  const redisTypeOptions: DataTypeOptions[] = [
    { value: 'string', label: 'String' },
    { value: 'list', label: 'List' },
    { value: 'set', label: 'Set' },
    { value: 'zset', label: 'ZSet' },
    { value: 'hash', label: 'Hash' },
  ];

  return (
    <>
      <Button type="primary" onClick={showAddDataModal}>
        新增
      </Button>
      <Modal
        title="新增数据配置"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          name="add_data_form"
          onFinish={onConfirm}
        >
          <Form.Item
            name="dataType"
            label="配置数据类型"
            rules={[{ required: true, message: '请选择配置数据类型!' }]}
          >
            <Select options={dataTypeOptions} />
          </Form.Item>

          <Form.Item
            name="key"
            label="Key"
            rules={[{ required: true, message: '请输入Key!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="redisType"
            label="数据类型"
            rules={[{ required: true, message: '请选择Redis数据类型!' }]}
          >
            <Select options={redisTypeOptions} />
          </Form.Item>

          <Form.Item
            name="fileList"
            label="上传文件"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
          >
            <Upload
              multiple
              listType="picture-card"
              onChange={handleUploadChange}
              beforeUpload={() => false}
            >
              <div>
                <Button>
                  {/* <Icon type="upload" />  */}
                  Click to Upload
                </Button>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TestDataConfig;