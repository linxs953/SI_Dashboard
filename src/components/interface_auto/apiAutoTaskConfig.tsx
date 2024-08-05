import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, List, Popconfirm, message } from 'antd';
import { EditOutlined, PlayCircleFilled, FilePdfFilled, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface Task {
  taskId: string;
  name: string;
  scenes: number;
  creator: string;
  createdAt: string;
  updatedAt: string;
}

interface Scene {
  sceneId: string;
  name: string;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedScenes, setSelectedScenes] = useState<Scene[]>([]);
  const [isSelectModalVisible, setIsSelectModalVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<Scene[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const navgate = useNavigate();
  const [form] = Form.useForm();


  // 假设这是一个获取任务列表的API调用
  const fetchTasks = async () => {
    // 这里可以替换为真实的API请求
    const response: Task[] = [
      { taskId: "1", name: 'Task 1', scenes: 5, creator: 'Alice', createdAt: '2023-01-01', updatedAt: '2023-01-02' },
      { taskId: "2", name: 'Task 2', scenes: 3, creator: 'Bob', createdAt: '2023-01-03', updatedAt: '2023-01-04' },
    ];
    setTasks(response);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const columns = [
    {
      title: '任务ID',
      dataIndex: 'taskId',
      key: 'taskId',
    },
    {
      title: '任务名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '场景数',
      dataIndex: 'scenes',
      key: 'scenes',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (record: Task) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.taskId)}
          />
          <Button
            type="primary"
            icon={<PlayCircleFilled />}
            onClick={() => handleRun(record.taskId)}
          />
          <Button
            type="primary"
            icon={<FilePdfFilled />}
            onClick={() => handleReport(record.taskId)}
          />
        </Space>
      ),
    },
  ];

//  编辑任务
  const handleEdit = (taskId: string) => {
    navgate(`/dashboard/task/edit?task=${taskId}`);
  };

//   运行任务
  const handleRun = async (taskId: string) => {
    // 假设这里调用一个运行任务的API
    console.log(`Running task ${taskId}`);
  };

//   查看任务报告
  const handleReport = (taskId: string) => {
    navgate(`/dashboard/task/reports?task=${taskId}`);
  };

//   新增按钮触发弹窗
  const showModal = () => {
    setIsModalVisible(true);
  };

//   新增Modal---取消操作
  const handleNewTaskCancel = () => {
    form.resetFields();
    setSelectedScenes([]);
    setIsModalVisible(false);
  };

//   新增Modal -- 提交创建任务
  const handleNewTaskOk = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();

      // 请求Api成功后关闭弹窗,刷新列表
      form.resetFields();
      setIsModalVisible(false);
      fetchTasks();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };


//   新增Modal添加场景
  const handleAddScenes = () => {
    setIsSelectModalVisible(true);
  };

//   关闭选择场景Modal
  const handleSelectCancel = () => {
    setIsSelectModalVisible(false);
  };

//   选择场景Modal --- 加载到列表
  const handleSelectOk = () => {
    setIsSelectModalVisible(false);
  };

//   选择场景Modal --- 设置输入框的关键词
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

//   选择场景Modal --- 点击搜索按钮, 获取数据填充到列表中
  const handleSearchSubmit = () => {
    // 假设这是搜索API调用
    const results: Scene[] = [
      { sceneId: "1", name: "Scene 1" },
      { sceneId: "2", name: "Scene 2" },
      { sceneId: "3", name: "Scene 3" },
    ].filter((scene) =>
      scene.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setSearchResults(results);
    setTotal(results.length);
  };

//   选择弹窗Modal --- 搜索结果翻页
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handlePageSizeChange = (current: number, size: number) => {
    setPageSize(size);
  };

  const handleSelectScene = (scene: Scene) => {
    if (!selectedScenes.some(s => s.sceneId === scene.sceneId)) {
      setSelectedScenes([...selectedScenes, scene]);
    } else {
      message.warning("此场景已添加!");
    }
  };

//   移除场景
  const handleRemoveScene = (scene: Scene) => {
    setSelectedScenes(selectedScenes.filter(s => s.sceneId !== scene.sceneId));
  };

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        新增任务
      </Button>
      <Modal
        title="新建任务"
        open={isModalVisible}
        onOk={handleNewTaskOk}
        onCancel={handleNewTaskCancel}
        okText="提交"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="任务ID"
            name="taskId"
            initialValue={tasks.length + 1}
            rules={[
              {
                required: false,
                message: '请输入任务ID!',
              },
            ]}
          >
            <Input disabled placeholder="自动分配" />
          </Form.Item>
          <Form.Item
            label="任务名称"
            name="name"
            rules={[
              {
                required: true,
                message: '请输入任务名称!',
              },
            ]}
          >
            <Input placeholder="请输入任务名称" />
          </Form.Item>
          <Form.Item
            label="场景列表"
            name="scenes"
            rules={[
              {
                required: true,
                message: '请选择场景列表!',
              },
            ]}
          >
            <Button type="primary" onClick={handleAddScenes}>添加场景</Button>
            <List
              header={<div>已选择的场景:</div>}
              bordered
              dataSource={selectedScenes}
              renderItem={(scene) => (
                <List.Item>
                  <List.Item.Meta title={scene.name} description={`场景ID: ${scene.sceneId}`} />
                  <Popconfirm
                    title="确定要移除此场景吗?"
                    onConfirm={() => handleRemoveScene(scene)}
                  >
                    <a>移除</a>
                  </Popconfirm>
                </List.Item>
              )}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="选择场景"
        open={isSelectModalVisible}
        onOk={handleSelectOk}
        onCancel={handleSelectCancel}
        okText="确定"
        cancelText="取消"
      >
        <Form layout="vertical">
          <Form.Item label="搜索场景">
            <Input.Search
              placeholder="输入关键词搜索"
              value={searchKeyword}
              onChange={handleSearch}
              onSearch={handleSearchSubmit}
            />
          </Form.Item>
          <List
            header={<div>搜索结果:</div>}
            bordered
            dataSource={searchResults.slice((page - 1) * pageSize, page * pageSize)}
            pagination={{
              current: page,
              pageSize,
              total,
              onChange: handlePageChange,
              onShowSizeChange: handlePageSizeChange,
            }}
            renderItem={(scene) => (
              <List.Item>
                <List.Item.Meta title={scene.name} description={`场景ID: ${scene.sceneId}`} />
                <Button type="primary" onClick={() => handleSelectScene(scene)}>选择</Button>
              </List.Item>
            )}
          />
        </Form>
      </Modal>
      <Table columns={columns} dataSource={tasks} rowKey="taskId" />
    </div>
  );
};

export default TaskList