import React, { useState } from 'react';
import { Button, Table, Tag, Space, Typography, Card, Tooltip, Badge } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import ApiRuntimeModal from '../model/config/ApiRuntimeModal';
import {TaskFormData}  from "../../types/apiruntime"
const { Title, Text } = Typography;

// 状态样式映射
const statusConfig = {
  pending: { 
    color: '#faad14',
    icon: <ClockCircleOutlined style={{ fontSize: '16px' }} />,
    text: '待执行',
    background: '#fff7e6'
  },
  running: { 
    color: '#1890ff',
    icon: <ClockCircleOutlined spin style={{ fontSize: '16px' }} />,
    text: '执行中',
    background: '#e6f7ff'
  },
  success: { 
    color: '#52c41a',
    icon: <ClockCircleOutlined style={{ fontSize: '16px' }} />,
    text: '成功',
    background: '#f6ffed'
  },
  failed: { 
    color: '#ff4d4f',
    icon: <ClockCircleOutlined style={{ fontSize: '16px' }} />,
    text: '失败',
    background: '#fff1f0'
  }
};

// 类型定义
interface TaskItem {
  id: string;
  name: string;
  description?: string;
  scenes: string[];
  status: 'pending' | 'running' | 'success' | 'failed';
  createdAt: string;
}

const ApiRuntimeListPage: React.FC = () => {
  // 状态管理
  const [modalVisible, setModalVisible] = useState(false);
  const [tasks, setTasks] = useState<TaskItem[]>([
    // 初始测试数据
    {
      id: '1',
      name: '用户登录测试',
      description: '基础身份验证测试场景，包含登录、注册等基本功能验证',
      scenes: ['登录流程', '注册流程', '密码重置'],
      status: 'success',
      createdAt: '2023-10-01 10:00'
    },
    {
      id: '2',
      name: '支付流程测试',
      description: '订单支付全流程测试，覆盖多种支付方式',
      scenes: ['微信支付', '支付宝', '银行卡支付'],
      status: 'running',
      createdAt: '2023-10-01 11:30'
    },
    {
      id: '3',
      name: '商品下单测试',
      description: '商品购买下单流程测试',
      scenes: ['商品选择', '购物车', '订单确认'],
      status: 'pending',
      createdAt: '2023-10-01 14:20'
    }
  ]);

  // 表格列定义
  const columns: ColumnsType<TaskItem> = [
    {
      title: '任务名称',
      dataIndex: 'name',
      key: 'name',
      width: '35%',
      render: (text, record) => (
        <div style={{ 
          padding: '12px 0',
          cursor: 'pointer',
        }}>
          <Text strong style={{ fontSize: '15px', display: 'block', marginBottom: '4px' }}>
            {text}
          </Text>
          {record.description && (
            <Text type="secondary" style={{ fontSize: '13px', display: 'block' }}>
              {record.description}
            </Text>
          )}
        </div>
      )
    },
    {
      title: '测试场景',
      dataIndex: 'scenes',
      key: 'scenes',
      width: '25%',
      render: (scenes: string[]) => (
        <Space wrap>
          {scenes.map((scene, index) => (
            <Tag 
              key={index}
              style={{ 
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: '#f5f5f5',
                border: 'none',
                fontSize: '12px'
              }}
            >
              {scene}
            </Tag>
          ))}
        </Space>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (status: TaskItem['status']) => {
        const config = statusConfig[status];
        return (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '6px 12px',
            borderRadius: '16px',
            backgroundColor: config.background,
            color: config.color,
            fontSize: '13px',
          }}>
            <span style={{ marginRight: '6px' }}>{config.icon}</span>
            {config.text}
          </div>
        );
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '15%',
      render: (time: string) => (
        <Text type="secondary" style={{ fontSize: '13px' }}>{time}</Text>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: '10%',
      render: () => (
        <Space size={16}>
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Tooltip title="编辑任务">
            <Button 
              type="text" 
              icon={<EditOutlined />}
              style={{ color: '#52c41a' }}
            />
          </Tooltip>
          <Tooltip title="删除任务">
            <Button 
              type="text" 
              icon={<DeleteOutlined />}
              style={{ color: '#ff4d4f' }}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  // 处理新建任务提交
  const handleCreateTask = async (values: TaskFormData) => {
    const newTask: TaskItem = {
      id: Date.now().toString(),
      name: values.taskInfo.name,
      description: values.taskInfo.description,
      scenes: values.scenes,
      status: 'pending',
      createdAt: new Date().toLocaleString()
    };

    setTasks([...tasks, newTask]);
    setModalVisible(false);
  };

  return (
    <div style={{ 
      padding: '24px 32px',
      backgroundColor: '#f0f2f5',
      // minHeight: '100vh',
      width: '100%',
      // height: '100%'
    }}>
      <Card
        variant="outlined"
        style={{ 
          borderRadius: '12px',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
        }}
      >
        <div style={{ 
          marginBottom: 24,
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <Title level={4} style={{ margin: 0, marginBottom: '8px' }}>测试任务列表</Title>
            <Text type="secondary">管理和监控所有API测试任务</Text>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
            size="large"
            style={{
              height: '40px',
              padding: '0 24px',
              borderRadius: '6px',
              boxShadow: '0 2px 0 rgba(0, 0, 0, 0.045)'
            }}
          >
            新建任务
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={tasks}
          rowKey="id"
          size="middle"
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
            style: {
              marginTop: '24px'
            }
          }}
          style={{ 
            backgroundColor: '#fff',
          }}
        />
      </Card>

      <ApiRuntimeModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
};

export default ApiRuntimeListPage;