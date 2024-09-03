import React, { useState } from 'react';
import { Modal, Form, Input, Switch, Select, Button, Upload, message, Table } from 'antd';
import type { ColumnsType, UploadFile } from 'antd/es';

interface DataTypeOptions {
  value: string;
  label: string;
}

interface DataItem {
  key: string;
  dataType: string;
  redisType: string;
  files: UploadFile[];
}

interface Props {
  onConfirm: (values: any) => void;
}

const TestDataConfig: React.FC<Props> = ({ onConfirm }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [isListType, setIsListType] = useState(false); // 控制是否为List类型，默认为false
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [dataList, setDataList] = useState<DataItem[]>([]);
  const [hideUploadButton, setHideUploadButton] = useState(false); // 控制是否隐藏上传按钮

  const showAddDataModal = () => {
    setVisible(true);
  };

  const hideAddDataModal = () => {
    setVisible(false);
  };

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

    // 如果是List类型且文件列表长度达到5，则隐藏上传按钮
    if (isListType && info.fileList.length >= 5) {
      form.setFieldsValue({ fileList: info.fileList });
      setHideUploadButton(true); // 设置状态以隐藏上传按钮
    }

    setFileList(info.fileList);
  };

  const handleDataTypeChange = (value: string) => {
    setIsListType(value === 'list');
    setFileList([]); // 清空文件列表
    setHideUploadButton(false); // 重新显示上传按钮
  };

  const checkDuplicate = (file: UploadFile) => {
    // 检查文件是否已经存在于文件列表中
    const fileName = file.name;
    const duplicate = fileList.some((f) => f.name === fileName);
    if (duplicate) {
      message.error(`文件 ${fileName} 已经上传，请选择其他文件.`);
      return false;
    }
    return true;
  };

  const dataTypeOptions: DataTypeOptions[] = [
    { value: 'account', label: '账号' },
    { value: 'product', label: '商品' },
    { value: 'store', label: '门店' },
  ];

  const redisTypeOptions: DataTypeOptions[] = [
    { label: '字符串', value: '字符串' },
    { label: '列表', value: '列表', default: true }, // 默认选中List
    { label: '集合', value: '集合' },
    { label: '有序集合', value: '有序集合' },
    { label: '哈希', value: '哈希' },
  ];

  const onFinish = (values: any) => {
    const newKey = values.key;
    const newDataType = values.dataType;
    const newRedisType = values.redisType;
    const newFiles = isListType ? values.fileList : [values.file];

    // 创建新的数据项
    const newDataItem: DataItem = {
      key: newKey,
      dataType: newDataType,
      redisType: newRedisType,
      files: newFiles,
    };

    // 将新数据项添加到数据列表中
    setDataList([...dataList, newDataItem]);

    // 清空表单
    form.resetFields();

    // 关闭弹窗
    hideAddDataModal();

    // 可选：调用外部回调函数
    onConfirm(newDataItem);
  };

  // 定义表格列
  const columns: ColumnsType<DataItem> = [
    {
      title: '配置数据类型',
      dataIndex: 'dataType',
      key: 'dataType',
      render: (dataType: string) => {
        const dataTypeName = dataTypeOptions.find(option => option.value === dataType)?.label || '';
        return dataTypeName;
      },
    },
    {
      title: '索引',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '数据存储类型',
      dataIndex: 'redisType',
      key: 'redisType',
    },
    {
      title: '上传文件',
      dataIndex: 'files',
      key: 'files',
      render: (files: UploadFile[]) => files.map((file) => file.name).join(', ')
    },
  ];

  return (
    <>
     <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <div style={{ marginBottom: '1rem', marginLeft: '1rem', marginRight: '1rem', marginTop: '1rem' }}>
      <Button type="primary" onClick={showAddDataModal}>
            新增基础数据
      </Button>
      </div>
      <div style={{ flex: 1 }}>
        <Table
          columns={columns}
          dataSource={dataList}
          pagination={false} // 关闭默认的分页
          rowKey="key" // 设置rowKey，确保每行数据唯一
          style={{
            marginLeft: 10,
            width: '100%', // 让表格宽度铺满父元素
            tableLayout: 'fixed', // 固定布局，确保列宽按设定分配
          }}      
        />
      </div>
    </div>
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
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="dataType"
          label="配置数据类型"
          initialValue="product" // 默认选中"产品"
          rules={[{ required: true, message: '请选择配置数据类型!' }]}
          style={{ marginBottom: 16 }}
        >
          <Select options={dataTypeOptions} />
        </Form.Item>

        <Form.Item
          name="key"
          label="Key"
          rules={[{ required: true, message: '请输入Key!' }]}
          style={{ marginBottom: 16 }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="redisType"
          label="数据类型"
          initialValue="list" // 默认选中List
          rules={[{ required: true, message: '请选择Redis数据类型!' }]}
          style={{ marginBottom: 16 }}
        >
          <Select options={redisTypeOptions} onChange={handleDataTypeChange} />
        </Form.Item>

        {/* 添加开关来控制是否启用多文件上传 */}
        <Form.Item
          name="enableMultipleUpload"
          valuePropName="checked"
          label="启用多文件上传"
          style={{ marginBottom: 16 }}
        >
          <Switch checked={isListType} onChange={() => setIsListType(!isListType)} />
        </Form.Item>

        {/* 根据isListType渲染不同的上传组件 */}
        {isListType ? (
          <Form.Item
            name="fileList"
            label="上传文件"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
            rules={[{ validator: (_, fileList) => fileList.length > 0 ? Promise.resolve() : Promise.reject('请上传文件!') }]}
            style={{ marginBottom: 16 }}
          >
            <Upload
              multiple
              listType="picture-card"
              onChange={handleUploadChange}
              beforeUpload={(file) => {
                // 检查文件是否重复
                if (!checkDuplicate(file)) {
                  return false;
                }
                return true;
              }}
              maxCount={5}
              onExceed={(files, fileList) => {
                message.warning(`您最多只能上传 5 个文件`);
              }}
            >
              {!hideUploadButton ? ( // 根据状态控制上传按钮的显示
                <div>
                  <Button>
                    {/* <Icon type="upload" />  */}
                    Click to Upload
                  </Button>
                </div>
              ) : null}
            </Upload>
          </Form.Item>
        ) : (
          <Form.Item
            name="file"
            label="上传文件"
            getValueFromEvent={(e) => e.file}
            rules={[{ validator: (_, file) => file ? Promise.resolve() : Promise.reject('请上传文件!') }]}
            style={{ marginBottom: 16 }}
          >
            <Upload
              onChange={handleUploadChange}
              beforeUpload={(file) => {
                // 检查文件是否重复
                if (!checkDuplicate(file)) {
                  return false;
                }
                return true;
              }}
            >
              <Button>
                {/* <Icon type="upload" />  */}
                Click to Upload
              </Button>
            </Upload>
          </Form.Item>
        )}
      </Form>
    </Modal>

    </>
  );
};

export default TestDataConfig;