import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, List, Popconfirm, message } from 'antd';
import { EditOutlined, PlayCircleFilled, FilePdfFilled, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import NewDataModal from './task/createModal';

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

  const fetch = async (page?: number, pageSize?: number) => {

  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <div style={{ marginBottom: '1rem', marginLeft: '1rem', marginRight: '1rem', marginTop: '1rem' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          新增任务
        </Button>
      </div>
      <div style={{ flex: 1 }}>
        <Table columns={columns} dataSource={tasks} rowKey="taskId" style={{ width: '100%' }} />
      </div>
      <NewDataModal
        visible={isModalVisible}
        title={"新建任务"}
        searchTitle={"搜索场景"}
        fetchData={fetch}
        closeModel={handleNewTaskCancel}
        newModalFormSpec={[
          {
            disable: false,
            itemErrorMsg: "请输入任务名称",
            itemLabel: "任务名称",
            itemName: "taskName",
            itemStyle: {width: '450px', marginBottom: '16px'  },
            type: "input",
          }
        ]}
        searchPlaceholder={"请输入场景名称"}
      />
    </div>
  );
};

export default TaskList