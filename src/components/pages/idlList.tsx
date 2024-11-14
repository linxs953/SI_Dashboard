import React, { useState, useEffect } from 'react';
import { Table, Button, message, Space } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import styled from 'styled-components';
import AddIdlModal from '../models/IdlList/AddIdlModal';
import EditSpecModal from '../models/IdlList/EditSpecModal';
import EditIdlModal from '../models/IdlList/EditIdlModal';
import { ColumnsType } from 'antd/es/table';


const domain = import.meta.env.VITE_ENTRY_URL;


interface DataItem {
  id: number;
  version: string;
  type: string;
  name: string;
  description: string;
  spec: any;
  image: string;
  schedule_type: string;
  createTime?: string;
  updateTime?: string;
}

const ImageTag = styled.span`
  background-color: #e6f4ff;
  border: 1px solid #91caff;
  border-radius: 6px;
  padding: 6px 12px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  color: #0958d9;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  &::before {
    content: '';
    width: 16px;
    height: 16px;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%230958d9' d='M20.3 12.04l1.01 3.02c.2.71.2 1.47-.01 2.17a3.99 3.99 0 01-1.19 1.83l-2.46 2.46c-.51.51-1.15.89-1.83 1.19-.7.21-1.45.21-2.17.01l-3.02-1.01a4.01 4.01 0 01-1.11-.54l-2.97-1.92a4.01 4.01 0 01-.99-1.02l-1.92-2.97c-.21-.33-.39-.7-.54-1.11L3.1 9.17a4.01 4.01 0 010-4.01l1.01-3.02a4.01 4.01 0 011.19-1.83l2.46-2.46a4.01 4.01 0 014-.18l3.02 1.01c.41.15.78.33 1.11.54l2.97 1.92c.39.25.73.59.99 1.02l1.92 2.97c.21.33.39.7.54 1.11l1.01 3.02a4.01 4.01 0 010 4.01z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    opacity: 0.8;
  }
  
  &:hover {
    background-color: #bae0ff;
    border-color: #69b1ff;
    color: #003eb3;
    box-shadow: 0 2px 4px rgba(22,119,255,0.1);
    transition: all 0.2s ease;
  }
`;

const StyledWrapper = styled.div`
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  width: 98%;
  margin: 0 16px;
  
  .header {
    display: flex;
    margin-bottom: 24px;
  }

  .ant-table-wrapper {
    width: 100%;
    
    .ant-table {
      .ant-table-thead > tr > th {
        background: #f0f5ff;  // 浅蓝色表头背景
        font-weight: 600;
        padding: 16px;
        &:hover {
          background: #e6f0ff !important;
        }
      }
      
      .ant-table-tbody > tr > td {
        padding: 16px;
      }

      .ant-table-tbody > tr:hover > td {
        background: #f8f9ff;  // 悬浮时的背景色
      }
    }
  }
`;

// 修改类型映射函数中的颜色
const getTypeDisplay = (type: string): { text: string; bgColor: string; textColor: string } => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes('sync')) {
    return { 
      text: '同步器', 
      bgColor: 'rgba(22, 119, 255, 0.15)',  // 稍微加深背景色
      textColor: 'rgba(22, 119, 255, 0.85)'  // 降低文字不透明度
    };
  }
  if (lowerType.includes('runtime')) {
    return { 
      text: '执行器', 
      bgColor: 'rgba(82, 196, 26, 0.15)',
      textColor: 'rgba(82, 196, 26, 0.85)'
    };
  }
  if (lowerType.includes('loadtest')) {
    return { 
      text: '性能测试', 
      bgColor: 'rgba(250, 173, 20, 0.15)',
      textColor: 'rgba(250, 173, 20, 0.85)'
    };
  }
  return { 
    text: type, 
    bgColor: 'rgba(0, 0, 0, 0.08)',
    textColor: 'rgba(0, 0, 0, 0.45)'
  };
};

// 更新类型标签样式组件，增加圆角大小
const TypeTag = styled.span<{ bgColor: string; textColor: string }>`
  background-color: ${props => props.bgColor};
  color: ${props => props.textColor};
  padding: 4px 12px;
  border-radius: 12px;  // 增加圆角大小
  font-size: 12px;
  display: inline-block;
  font-weight: 400;
  letter-spacing: 0.5px;
  border: 1px solid transparent;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${props => props.textColor};
    opacity: 0.9;
  }
`;

const IdlList: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSpecModalVisible, setIsSpecModalVisible] = useState(false);
  const [currentSpec, setCurrentSpec] = useState('');
  const [currentEditingId, setCurrentEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DataItem | null>(null);
  const [editForm] = Form.useForm();

  const columns: ColumnsType<DataItem> = [
    {
      title: 'ID',
      dataIndex: 'id', 
      key: 'id',
      width: 80,
      fixed: 'left' as const,
      align: 'center'
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      align: 'center'
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      align: 'center',
      render: (type: string) => {
        const { text, bgColor, textColor } = getTypeDisplay(type);
        return (
          <TypeTag bgColor={bgColor} textColor={textColor}>
            {text}
          </TypeTag>
        );
      }
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      width: 100,
      align: 'center'
    },
    {
      title: '数据定义',
      dataIndex: 'spec',
      key: 'spec',
      width: 120,
      align: 'center',
      render: (spec: string, record: DataItem) => (
        <EditOutlined 
          style={{ cursor: 'pointer', color: '#1890ff' }}
          onClick={() => record.id && handleSpecEdit(spec, record.id)}
        />
      )
    },
    {
      title: '镜像',
      dataIndex: 'image',
      key: 'image',
      width: 150,
      ellipsis: true,
      align: 'center',
      render: (image: string) => (
        <ImageTag title={image}>
          {image}
        </ImageTag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 120,
      align: 'center'
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime', 
      key: 'updateTime',
      width: 120,
      align: 'center'
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      align: 'center',
      render: (_: any, record: DataItem) => (
        <Space size="middle">
          <Button 
            type="link" 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button type="link" danger>删除</Button>
        </Space>
      )
    }
  ];

  const fetchData = async () => {
    try {
      const response = await fetch(`${domain}/cluster/get?type=syncapi`);
      if (!response.ok) {
        throw new Error('获取数据失败');
      }
      const result = await response.json();
      
      const processedData = (result.data || []).map((item: any, index: number) => ({
        id: index + 1,
        version: item.version,
        type: item.type,
        name: item.idlName,
        description: item.idlDesc,
        spec: item.spec,
        image: item.image,
        schedule_type: item.schedule_type,
        createTime: new Date().toLocaleDateString(),
        updateTime: new Date().toLocaleDateString(),
      }));
      
      setData(processedData);
    } catch (error) {
      console.error('获取数据错误:', error);
      message.error('获取数据失败，请稍后重试');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const newItem: DataItem = {
        id: data.length + 1,
        version: values.version || '1.0.0',
        type: 'syncapi',
        name: values.name,
        description: values.description,
        spec: {},
        image: values.image || '',
        schedule_type: 'syncapi',
        createTime: new Date().toLocaleDateString(),
        updateTime: new Date().toLocaleDateString(),
      };
      
      setData([...data, newItem]);
      setIsModalVisible(false);
      form.resetFields();
      message.success('添加成功！');
      fetchData();
    } catch (error) {
      console.error('验证失败:', error);
    }
  };

  const handleSpecEdit = (spec: string, id: number | undefined) => {
    if (id === undefined) {
      message.error('记录ID不存在');
      return;
    }
    setCurrentSpec(spec);
    setCurrentEditingId(id);
    setIsSpecModalVisible(true);
  };

  const handleSpecSave = () => {
    if (currentEditingId) {
      setData(data.map(item => 
        item.id === currentEditingId 
          ? { ...item, spec: currentSpec, updateTime: new Date().toLocaleDateString() }
          : item
      ));
      setIsSpecModalVisible(false);
      message.success('保存成功！');
      fetchData();
    }
  };

  const handleEdit = (record: DataItem) => {
    setEditingRecord(record);
    editForm.setFieldsValue(record);
    setIsEditModalVisible(true);
  };

  const handleEditSave = async () => {
    try {
      const values = await editForm.validateFields();
      if (editingRecord) {
        setData(data.map(item =>
          item.id === editingRecord.id
            ? {
                ...item,
                ...values,
                updateTime: new Date().toLocaleDateString()
              }
            : item
        ));
        setIsEditModalVisible(false);
        message.success('编辑成功！');
        fetchData();
      }
    } catch (error) {
      console.error('验证失败:', error);
    }
  };

  return (
    <StyledWrapper>
      <div className="header">
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
          size="large"
        >
          新增
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="id"
        pagination={{
          pageSize: 10,
          showTotal: (total) => `共 ${total} 条`,
        }}
        bordered
      />

      <AddIdlModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleAdd}
        form={form}
      />

      <EditSpecModal
        visible={isSpecModalVisible}
        onCancel={() => setIsSpecModalVisible(false)}
        onOk={handleSpecSave}
        value={currentSpec}
        onChange={setCurrentSpec}
      />

      <EditIdlModal
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleEditSave}
        form={editForm}
        initialValues={editingRecord || undefined}
      />
    </StyledWrapper>
  );
};

export default IdlList;
