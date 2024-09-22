



import React, { useEffect, useState } from 'react';
import { Table, message, Modal, Button } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { SyncOutlined, ArrowLeftOutlined } from '@ant-design/icons';
interface ReportData {
  taskName: string;
  execId: string;
  taskId: string;
  sceneCount: number;
  status: '运行中' | '运行成功' | '运行失败';
  createTime: string;
  completeTime: string;
}

const domain = import.meta.env.VITE_API_URL;


const Reports: React.FC = () => {
  const [data, setData] = useState<ReportData[]>([]);
  const params = new URLSearchParams(window.location.search);
  const taskId = params.get('taskId');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

    // 在这里可以添加获取报告数据的逻辑
    const fetchReportData = async () => {
    try {
        setLoading(true)
        const response = await axios.get(`${domain}/task/getAllTaskRunRecord?taskId=${taskId}`);
        if (response.status != 200) {
            message.error('获取报告数据失败');
            return;
        }
        if (!response.data.taskRun) {
            response.data.taskRun = []
            message.warning('没有运行记录');
        }
        const formattedData = response.data.taskRun.map((item: any) => ({
        taskName: response.data.taskMeta.taskName,
        execId: item.runId,
        taskId: item.taskId,
        sceneCount: response.data.taskMeta.sceneCount,
        status: item.state === 0 ? '运行中' : 
                item.state === 1 ? '运行成功' : 
                item.state === 2 ? '运行失败' : item.status,
        createTime: item.createTime,
        completeTime: item.finishTime === ""? "/": item.finishTime
        }));
        setData(formattedData);
        setLoading(false)
    } catch (error) {
        setLoading(false)
        console.log(error)
        message.error('获取报告数据失败');
    }
    };
  useEffect(() => {
    if (!taskId) {
      Modal.warning({
        title: '警告' + taskId,
        content: '没有有效的任务ID',
        onOk: () => {
          // 使用 navigate 进行页面跳转
        //   navigate('/dashboard/task-config');
        },
      });
      return;
    }


    fetchReportData();
  }, [taskId]);

  const columns = [
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
    },
    {
      title: '执行ID',
      dataIndex: 'execId',
      key: 'execId',
    },
    {
      title: '场景数',
      dataIndex: 'sceneCount',
      key: 'sceneCount',
    },
    {
      title: '运行状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = '';
        switch (status) {
          case '运行中':
            color = '#808080';  // 灰色
            break;
          case '运行成功':
            color = '#52c41a';  // 绿色
            break;
          case '运行失败':
            color = '#f5222d';  // 红色
            break;
        }
        return <span style={{ backgroundColor: color, padding: '5px', borderRadius: '8px', color: 'white' }}>{status}</span>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '完成时间',
      dataIndex: 'completeTime',
      key: 'completeTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ReportData) => (
        <Button onClick={() => {
            navigate(`/dashboard/api/task/reportDetail?taskId=${taskId}&execId=${record.execId}`)
        }}>
          查看
        </Button>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', padding: '1rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          style={{ marginRight: '10px' }}
          onClick={() => navigate('/dashboard/api/task')}
        >
        </Button>
        <Button
          type='primary' 
          onClick={fetchReportData} 
          loading={loading} 
          disabled={loading}
          icon={<SyncOutlined />}

        >
          测试报告
        </Button>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="execId" 
          style={{ width: '100%' }}
          pagination={{ 
            position: ['bottomCenter'],
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            pageSize: 10
          }}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Reports;
