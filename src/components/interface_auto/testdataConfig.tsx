import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Select, Upload, message, Table } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { UploadProps } from 'antd/es/upload';

interface DataType {
  value: string;
  label: string;
}

interface TaskData {
  taskId: string;
  taskName: string;
  dataType: string;
  files: File[];
}

interface TestConfigData {
  total: number;
  data: TaskData[];
}

const TestDataConfig: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [taskData, setTaskData] = useState<TaskData>({
    taskId: '',
    taskName: '',
    dataType: '',
    files: [],
  });
  const [dataTypes, setDataTypes] = useState<DataType[]>([]);
  const [testData, setTestData] = useState<TestConfigData>({ total: 0, data: [] });
  const [currentPage, setCurrentPage] = useState(1);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchData(currentPage);
    fetchDataType();
  }, []);

  const fetchDataType = async () => {
    try {
      const response = await axios.get('/data-types');
      const types = response.data.map((type: { value: string; label: string }) => ({
        value: type.value,
        label: type.label,
      }));
      setDataTypes(types);
    } catch (error) {
      console.error('Error fetching data types:', error);
    }
  };

  const fetchData = async (page: number) => {
    try {
      const response = await axios.get<TestConfigData>(`/test-config?page=${page}`);
      setTestData(response.data);
    } catch (error) {
      console.error('Error fetching test config data:', error);
    }
  };

  const handleAdd = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // Assume the API endpoint for creating a new task
      await axios.post('/test-config', values);
      message.success('Task created successfully');
      setIsModalVisible(false);
      fetchData(currentPage); // Refresh the list
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  const handleFileChange = (info: UploadProps['onChange']) => {
    if (Array.isArray(info.fileList)) {
      const fileList = info.fileList.filter((file) => file.status !== 'removed');
      setTaskData({ ...taskData, files: fileList });
    }
  };

  const beforeUpload = (file: File) => {
    setTaskData({ ...taskData, files: [...taskData.files, file] });
    return false; // Prevent default upload
  };

  const columns = [
    {
      title: '任务ID',
      dataIndex: 'taskId',
      key: 'taskId',
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      key: 'dataType',
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        <PlusOutlined /> 新增
      </Button>
      <Modal
        title="新增任务"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" onFinish={handleOk}>
          <Form.Item
            label="任务名称"
            name="taskName"
            rules={[{ required: true, message: '请输入任务名称!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="数据类型"
            name="dataType"
            rules={[{ required: true, message: '请选择数据类型!' }]}
          >
            <Select placeholder="请选择数据类型" options={dataTypes} />
          </Form.Item>
          {taskData.dataType === '文件' && (
            <Form.Item label="文件列表">
              <Upload
                listType="picture-card"
                showUploadList={{ showRemoveIcon: true }}
                beforeUpload={beforeUpload}
                onChange={handleFileChange}
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>上传</div>
                </div>
              </Upload>
            </Form.Item>
          )}
        </Form>
      </Modal>
      <Table
        columns={columns}
        dataSource={testData.data}
        pagination={{
          current: currentPage,
          pageSize: 10,
          total: testData.total,
          onChange: (page) => {
            setCurrentPage(page);
            fetchData(page);
          },
        }}
      />
    </div>
  );
};

export default TestDataConfig;