import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, List, Popconfirm, message } from 'antd';
import { EditOutlined, PlayCircleFilled, FilePdfFilled, PlusOutlined,DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import NewDataModal from '../components/interface_auto/task/createModal';
import axios from 'axios';

const domain = import.meta.env.VITE_API_URL

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
  const navgate = useNavigate();


  // 假设这是一个获取任务列表的API调用
  const fetchTasks = async () => {
    // 这里可以替换为真实的API请求
    const url = `${domain}/task/getList?page=1&pageSize=10`
    const response = await axios.get(url)
    if (response.status === 200) {
      if (!response.data.data) {
        setTasks([])
        return
      }
      let  data: Task[] = [
      ]
      response.data.data.map(task => {
        data.push({
          taskId: task.taskId,
          name: task.taskName,
          scenes: task.scenes.length,
          creator: task.author,
          createdAt: task.createAt,
          updatedAt: task.updateAt,
        })
      })
      setTasks(data);
    }
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
            // type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.taskId)}
          />
          <Button
            // type="primary"
            icon={<PlayCircleFilled />}
            onClick={() => handleRun(record.taskId)}
          />
          <Button
            // type="primary"
            icon={<FilePdfFilled />}
            onClick={() => handleReport(record.taskId)}
          />
          <Button
            // type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.taskId)}
          />
        </Space>
      ),
    },
  ];

//  编辑任务
  const handleEdit = (taskId: string) => {
    navgate(`/dashboard/api/task/edit?taskId=${taskId}`);
  };

//   运行任务
  const handleRun = async (taskId: string) => {
    // 假设这里调用一个运行任务的API
    console.log(`Running task ${taskId}`);
    const url = `${domain}/task/run/${taskId}`
    const response = await axios.post(url)
    if (response.status === 200) {
      message.success("运行成功")
    }
  };

//   查看任务报告
  const handleReport = (taskId: string) => {
    navgate(`/dashboard/api/task/reports?taskId=${taskId}`);
  };

  const handleDelete = async (taskId: string) => {
    console.log(`Deleting task ${taskId}`);
    const url = `${domain}/task/delete?taskId=${taskId}`
    const response = await axios.delete(url)
    if (response.status === 200) {
      message.success("删除成功")
      await fetchTasks()
    }
    
  };

//   新增按钮触发弹窗
  const showModal = () => {
    setIsModalVisible(true);
  };


  const newModalOk = () => {
    setIsModalVisible(false)
    fetchTasks()
  }

  const newModalCancel = () => {
    setIsModalVisible(false)
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
        onOk={newModalOk}
        onCancel={newModalCancel}
        // fetchData={fetchTasks}
        // closeModel={handleNewTaskCancel}
        newModalFormSpec={[
          {
            disable: false,
            itemErrorMsg: "请输入任务名称",
            itemLabel: "任务名称",
            itemName: "taskName",
            itemStyle: {width: '530px', marginBottom: '16px'  },
            type: "input",
          },
          {
            disable: false,
            itemErrorMsg: "创建人不能为空",
            itemLabel: "创建人",
            itemName: "author",
            itemStyle: {width: '530px', marginBottom: '16px'  },
            type: "input",
          }
        ]}
        searchPlaceholder={"请输入场景名称"}
      />
    </div>
  );
};

export default TaskList