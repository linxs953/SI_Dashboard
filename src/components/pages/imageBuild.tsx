import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Form, message, Typography, Popconfirm } from 'antd';
import axios from 'axios';
import { BuildOutlined, CloudServerOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import ImageBuildModal from '../model/config/ImageBuildModal';
import service from '../../hooks/axios';

const { Title } = Typography;

interface ImageBuildSpec {
  type: number;
  spec: object;    
}


interface ImageBuildRecord {
  id: string;
  repoUrl: string;
  repoType: 'github' | 'gitlab' | 'bitbucket';
  imageName: string;
  version?: string;
  branch: string;
  repoAuth: string;
  buildStatus: 'success' | 'failed' | 'building' | 'none';
  lastBuildTime?: string;
}

// 状态标签样式
const statusStyles = {
  success: { color: '#52c41a' },
  failed: { color: '#ff4d4f' },
  building: { color: '#1890ff' },
  none: { color: '#d9d9d9' }
};

const ImageBuild: React.FC = () => {
  // 预设数据
  // const mockData: ImageBuildRecord[] = [
  //   {
  //     id: '1',
  //     repoUrl: 'git@github.com:kubernetes/dashboard.git',
  //     repoType: 'github',
  //     imageName: 'k8s-dashboard',
  //     version: 'v2.7.0',
  //     branch: 'main',
  //     repoAuth: 'GITHUB_TOKEN=ghp_xxxxxxxxxxxx',
  //     buildStatus: 'success',
  //     lastBuildTime: '2025-01-27 20:30:15'
  //   },
  //   {
  //     id: '2',
  //     repoUrl: 'git@gitlab.com:gitlab-org/gitlab-runner.git',
  //     repoType: 'gitlab',
  //     imageName: 'gitlab-runner',
  //     version: 'v15.8.0',
  //     branch: 'master',
  //     repoAuth: 'GITLAB_TOKEN=glpat_xxxxxxxxxxxx',
  //     buildStatus: 'building',
  //     lastBuildTime: '2025-01-27 20:55:30'
  //   },
  //   {
  //     id: '3',
  //     repoUrl: 'git@github.com:prometheus/prometheus.git',
  //     repoType: 'github',
  //     imageName: 'prometheus',
  //     version: 'v2.45.0',
  //     branch: 'main',
  //     repoAuth: 'GITHUB_TOKEN=ghp_xxxxxxxxxxxx',
  //     buildStatus: 'failed',
  //     lastBuildTime: '2025-01-27 19:45:20'
  //   },
  //   {
  //     id: '4',
  //     repoUrl: 'git@github.com:grafana/grafana.git',
  //     repoType: 'github',
  //     imageName: 'grafana',
  //     version: 'v10.2.0',
  //     branch: 'main',
  //     repoAuth: 'GITHUB_TOKEN=ghp_xxxxxxxxxxxx\nGRAFANA_TOKEN=gf_xxxxxxxxxxxx',
  //     buildStatus: 'success',
  //     lastBuildTime: '2025-01-27 18:15:40'
  //   }
  // ];

  const [records, setRecords] = useState<ImageBuildRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ImageBuildRecord | null>(null);
  const [form] = Form.useForm();
  // 从仓库URL中提取仓库名
  const extractRepoName = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      // 移除空字符串
      const validParts = pathParts.filter(part => part);
      if (validParts.length >= 2) {
        // 获取最后一个部分作为仓库名，并移除.git后缀
        const repoName = validParts[validParts.length - 1].replace(/\.git$/, '');
        return repoName.trimEnd();
      }
    } catch (error) {
      console.error('URL解析错误:', error);
    }
    return '';
  };

  // 监听仓库地址变化
  const handleRepoUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueWithoutSpaces = e.target.value.replace(/ /g, ''); // 移除所有空格
    form.setFieldsValue({ repoUrl: valueWithoutSpaces }); // 更新表单值
    const url = valueWithoutSpaces;
    
    if (url && url.trim()) {
      try {
        new URL(url); // 验证URL格式
        const repoName = extractRepoName(url);
        if (repoName) {
          form.setFieldsValue({ repoUrl: valueWithoutSpaces }); // 更新表单值
          form.setFieldValue('imageName', decodeURIComponent(repoName.toLowerCase()));
        }
      } catch (error) {
        // URL格式无效，不进行处理
        console.log(error)
      }
    }
  };

  // 监听仓库类型变化
  const handleRepoTypeChange = (_: string) => {
    // 清空相关字段
    form.setFieldsValue({
      repoUrl: '',
      repoAuth: '',
      imageName: '',
      branch: ''
    });
  };

  // 获取构建记录列表
  const fetchRecords = async () => {
    try {
      setLoading(true);
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      setRecords([]);
    } catch (error) {
      console.error('获取构建记录失败:', error);
      message.error('获取构建记录失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // 新增或编辑记录
  const handleSubmit = async (vv: ImageBuildRecord) => {
    try {
      console.log(vv)
      // const values = await form.validateFields();
      const isEditing = !!editingRecord;
      
      const createSpec: ImageBuildSpec = {
        type: 1,
        spec: vv
      };
      const updateSpec: ImageBuildSpec = {
        type: 1,
        spec: {
          ...vv, 
          // id: (editingRecord as ImageBuildRecord).id 
        }
      };
      const data = isEditing ? updateSpec : createSpec;

      const resp = await service({
        url: '/resource/dispatch',
        data: data,
        method: "POST",
      })

      
      if (resp.status !== 200) {
        message.error('操作失败');
        return
      }

      if (resp.data.code > 400) {
        message.error('创建任务失败');
        return
      }
      message.success(isEditing ? '更新成功' : '创建成功');
      form.resetFields();
      setEditingRecord(null)
      setModalVisible(false);
      fetchRecords();
    } catch (error) {
      message.error("创建任务异常")
      console.log(error)
      // if (error.response?.data?.message) {
      //   message.error(error.response.data.message);
      // } else {
      //   message.error(error.message || '操作失败');
      // }
    }
  };

  // 触发构建
  const handleBuild = async (record: ImageBuildRecord) => {
    try {
      await axios.post('/api/image-build/build', { id: record.id });
      message.success('构建任务已提交');
      fetchRecords();
    } catch (error) {
      console.log(error)
      message.error('触发构建失败');
    }
  };

  // 删除记录
  const handleDelete = async (record: ImageBuildRecord) => {
    try {
      await axios.delete(`/api/image-build/${record.id}`);
      message.success('删除成功');
      fetchRecords();
    } catch (error) {
      console.log(error)
      message.error('删除失败');
    }
  };

  // 打开编辑模态框
  const handleEdit = (record: ImageBuildRecord) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // 表格列定义
  const columns = [
    {
      title: '仓库地址',
      dataIndex: 'repoUrl',
      key: 'repoUrl',
      ellipsis: true,
      width: '20%',
    },
    {
      title: '仓库类型',
      dataIndex: 'repoType',
      key: 'repoType',
      width: '10%',
      render: (type: string) => {
        const typeMap = {
          github: 'GitHub',
          gitlab: 'GitLab',
          bitbucket: 'Bitbucket'
        };
        return typeMap[type as keyof typeof typeMap] || type;
      }
    },
    {
      title: '镜像名称',
      dataIndex: 'imageName',
      key: 'imageName',
      width: '15%',
    },
    {
      title: '版本号',
      dataIndex: 'version',
      key: 'version',
      width: '10%',
    },
    {
      title: '分支名',
      dataIndex: 'branch',
      key: 'branch',
      width: '10%',
    },
    {
      title: '构建状态',
      dataIndex: 'buildStatus',
      key: 'buildStatus',
      width: '10%',
      render: (status: string) => {
        const statusMap = {
          success: '成功',
          failed: '失败',
          building: '构建中',
          none: '未构建'
        };
        return (
          <span style={statusStyles[status as keyof typeof statusStyles]}>
            {statusMap[status as keyof typeof statusStyles] || '未知'}
          </span>
        );
      },
    },
    {
      title: '最后构建时间',
      dataIndex: 'lastBuildTime',
      key: 'lastBuildTime',
      width: '15%',
    },
    {
      title: '操作',
      key: 'action',
      width: '200px',
      render: (_: unknown, record: ImageBuildRecord) => (
        <Space size={4}>
          <Button
            type="link"
            size="middle"
            style={{
              padding: '4px 8px',
              height: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              color: record.buildStatus === 'building' ? '#999' : '#1890ff'
            }}
            icon={<BuildOutlined style={{ fontSize: '16px' }} />}
            onClick={() => handleBuild(record)}
            disabled={record.buildStatus === 'building'}
          >
            构建
          </Button>
          <Button
            type="link"
            size="middle"
            style={{
              padding: '4px 8px',
              height: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              color: '#1890ff'
            }}
            icon={<EditOutlined style={{ fontSize: '16px' }} />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条记录吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="middle"
              danger
              style={{
                padding: '4px 8px',
                height: 'auto',
                display: 'inline-flex',
                alignItems: 'center'
              }}
              icon={<DeleteOutlined style={{ fontSize: '16px' }} />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ 
      height: '100vh',
      margin: '-24px -24px -24px -24px',
      background: '#f0f2f5',
      overflow: 'auto',
      flex: 1,
      width: '100%'
    }}>
      <div style={{ 
        margin: '24px',
        background: '#fff', 
        borderRadius: '4px', 
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
        minHeight: 'calc(100vh - 48px)',
        display: 'flex',
        flexDirection: 'column',
        width: 'auto'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '16px 24px',
          borderBottom: '1px solid #f0f0f0',
          width: '100%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CloudServerOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
            <Title level={4} style={{ margin: 0 }}>镜像构建</Title>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingRecord(null);
              form.resetFields();
              setModalVisible(true);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: '32px',
              padding: '0 16px',
              borderRadius: '4px',
              gap: '4px'
            }}
          >
            新增构建任务
          </Button>
        </div>

        <div style={{ 
          padding: '24px',
          flex: 1,
          width: '100%',
          overflow: 'auto'
        }}>
          <Table
            columns={columns}
            dataSource={records}
            rowKey="id"
            loading={loading}
            size="middle"
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              size: "default",
              position: ['bottomRight']
            }}
            style={{ 
              width: '100%',
              minWidth: '100%'
            }}
            scroll={{ x: 1200 }}
          />
        </div>
      </div>

      <ImageBuildModal
        visible={modalVisible}
        editingRecord={editingRecord}
        form={form}
        onSubmit={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        handleRepoUrlChange={handleRepoUrlChange}
        handleRepoTypeChange={handleRepoTypeChange}
      />
    </div>
  );
};

export { type ImageBuildRecord };
export default ImageBuild;
