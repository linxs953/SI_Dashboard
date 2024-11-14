import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Select, Switch, Upload } from 'antd';
import { EditOutlined, DeleteOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { TablePaginationConfig } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import Editor from "@monaco-editor/react";
import axios from 'axios';
import { json } from 'stream/consumers';

interface RedisData {
  key: string;
  type: string;
  ttl: number;
  value: string | null;
  listValue: string[] | null;
  hashValue: { [key: string]: string } | null;
  setValue: string[] | null;
  zsetValue: ZSetMember[] | null;
}

interface ZSetMember {
  score: number;
  member: string;
}

interface FileUploadProps {
  value?: string | File | ArrayBuffer;
  onChange?: (value: string | File | ArrayBuffer) => void;
  form: any;
  setUploadFileName: (fileName: string) => void;
}

const domain = import.meta.env.VITE_API_URL;

const FileUploader: React.FC<FileUploadProps> = ({ value, onChange, form, setUploadFileName }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    const formValue = form.getFieldValue('value');
    const formType = form.getFieldValue('type');
    const fileName = form.getFieldValue('uploadFileName');
    
    if (fileName) {
      setFileList([{
        uid: `-${Date.now()}`,
        name: fileName,
        status: 'done',
        size: 0,
        type: ''
      }]);
      return;
    }

    // 检查是否为文件类型
    if (formValue) {
      try {
        if (formType === 'hash') {
          // 如果是 hash 类型，检查是否为文件
          const hashValue = form.getFieldValue('hashValue');
          if (hashValue?.type === 'hash-file' && hashValue?.fileName) {
            setFileList([{
              uid: `-${Date.now()}`,
              name: hashValue.fileName,
              status: 'done',
              size: 0,
              type: ''
            }]);
            setUploadFileName(hashValue.fileName);
          }
        } else if (formType === 'string') {
          // 如果是 string 类型，检查是否为文件
          const parsedValue = typeof formValue === 'string' ? JSON.parse(formValue) : formValue;
          if (parsedValue?.type === 'file' && parsedValue?.fileName) {
            setFileList([{
              uid: `-${Date.now()}`,
              name: parsedValue.fileName,
              status: 'done',
              size: 0,
              type: ''
            }]);
            setUploadFileName(parsedValue.fileName);
          }
        }
      } catch (e) {
        // 解析失败时不处理
        console.log('Parse file info error:', e);
      }
    }
  }, [form, setUploadFileName]);

  // 处理文件上传
  const handleUpload = async (file: File) => {
    try {
      const binaryContent = await file.arrayBuffer();
      
      // 更新文件列表显示
      const newFile: UploadFile = {
        uid: `-${Date.now()}`,
        name: file.name,
        status: 'done',
        size: file.size,
        type: file.type
      };
      setFileList([newFile]);

      // 现在可以安全地传递 ArrayBuffer
      onChange?.(binaryContent);
      setUploadFileName(file.name);

    } catch (error) {
      message.error('文件读取失败');
      console.error('文件上传错误:', error);
    }
  };

  // 处理文件删除
  const handleRemove = () => {
    setFileList([]);
    form.setFieldsValue({ value: undefined });
    onChange?.('');
    setUploadFileName(''); // 清除文件名
  };

  return (
    <div>
      {fileList.length === 0 ? (
        <Upload.Dragger
          accept="*/*"
          maxCount={1}
          showUploadList={false}
          beforeUpload={(file) => {
            handleUpload(file);
            return false;
          }}
        >
          <div className="upload-content">
            <p className="ant-upload-drag-icon">
              <PlusOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
            <p className="ant-upload-hint">支持所有文件类型</p>
          </div>
        </Upload.Dragger>
      ) : (
        <div 
          style={{ 
            border: '1px dashed #d9d9d9',
            borderRadius: '2px',
            padding: '8px 12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>{fileList[0].name}</span>
          <Button 
            type="link" 
            danger
            onClick={handleRemove}
          >
            删除
          </Button>
        </div>
      )}
    </div>
  );
};

const DataManage: React.FC = () => {
  const [uploadFileName, setUploadFileName] = useState<string>('');
  const [data, setData] = useState<RedisData[]>([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RedisData | null>(null);
  const [editorContent, setEditorContent] = useState<string>('');
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [addModalVisible, setAddModalVisible] = useState(false);

  const [form] = Form.useForm();

  // 添加一个 state 来跟踪当前选择的数据类型
  const [currentType, setCurrentType] = useState<string>('');

  const [isFile, setIsFile] = useState(false);

  // 获取Redis数据
  const fetchData = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${domain}/cache/keys`);
      const result = await response.json();
      if (result.code === 200) {
        // 将对象转换为数组格式
        const dataArray = Object.entries(result.data).map(([key, value]: [string, any]) => ({
          key,
          ...value
        }));
        setData(dataArray);
        setPagination({
          ...pagination,
          total: dataArray.length,
        });
      } else {
        message.error(result.message || '获取数据失败');
      }
    } catch (error) {
      message.error('获取数据失败');
      console.error('获取数据错误:', error);
    }
    setLoading(false);
  };

  // 处理表格变化
  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchData(newPagination.current || 1, newPagination.pageSize || 10);
  };

  // 添加一个工具函数来检测和解析JSON字符串
  const tryParseJSON = (str: string): { isJSON: boolean; value: any } => {
    try {
      const parsed = JSON.parse(str);
      return { isJSON: true, value: parsed };
    } catch (e) {
      return { isJSON: false, value: str };
    }
  };

  // 修改 handleEdit 函数
  const handleEdit = (record: RedisData) => {
    setEditingRecord(record);
    
    let initialValue = '';
    switch (record.type) {
      case 'hash':
        if (record.hashValue) {
          try {
            // 检查是否为文件类型
            if (record.hashValue.type === 'hash-file' && record.hashValue.fileName) {
              setIsFile(true);
              setUploadFileName(record.hashValue.fileName);
              // 设置完整的表单值
              form.setFieldsValue({
                key: record.key,
                type: record.type,
                value: record.hashValue.fileContent || '',
                ttl: record.ttl,
                uploadFileName: record.hashValue.fileName,
                hashValue: record.hashValue
              });
            } else {
              setIsFile(false);
              initialValue = JSON.stringify(record.hashValue, null, 2);
              // 设置表单值
              form.setFieldsValue({
                key: record.key,
                type: record.type,
                value: initialValue,
                ttl: record.ttl
              });
            }
          } catch (e) {
            setIsFile(false);
            initialValue = JSON.stringify(record.hashValue, null, 2);
            // 设置表单值
            form.setFieldsValue({
              key: record.key,
              type: record.type,
              value: initialValue,
              ttl: record.ttl
            });
          }
        }
        break;
      case 'string':
        if (record.value) {
          try {
            const parsedValue = JSON.parse(record.value);
            if (parsedValue.type === 'file' && parsedValue.fileName) {
              setIsFile(true);
              setUploadFileName(parsedValue.fileName);
              form.setFieldsValue({
                key: record.key,
                type: record.type,
                value: parsedValue.fileContent || '',
                ttl: record.ttl,
                uploadFileName: parsedValue.fileName
              });
            } else {
              setIsFile(false);
              initialValue = record.value;
              form.setFieldsValue({
                key: record.key,
                type: record.type,
                value: initialValue,
                ttl: record.ttl
              });
            }
          } catch (e) {
            setIsFile(false);
            initialValue = record.value;
            form.setFieldsValue({
              key: record.key,
              type: record.type,
              value: initialValue,
              ttl: record.ttl
            });
          }
        }
        break;
      case 'list':
        if (record.listValue) {
          setIsFile(false);
          const parsedList = record.listValue.map(item => {
            const { isJSON, value } = tryParseJSON(item);
            return isJSON ? value : item;
          });
          initialValue = JSON.stringify(parsedList, null, 2);
        } else {
          initialValue = '[]';
        }
        setEditorContent(initialValue);
        form.setFieldsValue({
          key: record.key,
          type: record.type,
          value: initialValue,
          ttl: record.ttl
        });
        break;
      case 'set':
        if (record.setValue) {
          setIsFile(false);
          const parsedSet = record.setValue.map(item => {
            const { isJSON, value } = tryParseJSON(item);
            return isJSON ? JSON.stringify(value) : item;
          });
          initialValue = parsedSet.join('\n');
          // 添加这行来设置表单值
          form.setFieldsValue({
            key: record.key,
            type: record.type,
            value: initialValue,
            ttl: record.ttl
          });
        }
        break;
      case 'zset':
        setIsFile(false);
        initialValue = record.zsetValue?.map(item => {
          const { isJSON, value } = tryParseJSON(item.member);
          return `${item.score} ${isJSON ? JSON.stringify(value) : item.member}`;
        }).join('\n') || '';
        // 添加这行来设置表单值
        form.setFieldsValue({
          key: record.key,
          type: record.type,
          value: initialValue,
          ttl: record.ttl
        });
        break;
    }
    
    // 最后统一打开弹窗
    setEditModalVisible(true);
  };

  // 修改 handleSave 函数
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      // 如果是文件类型，使用 FormData
      if (isFile) {
        const formData = new FormData();
        formData.append('key', values.key);
        formData.append('ttl', values.ttl === undefined ? '-1' : values.ttl.toString());

        // 添加文件内容
        let fileContent: string | ArrayBuffer = '';
        
        if (values.value instanceof ArrayBuffer) {
          // 新上传的文件
          fileContent = values.value;
        } else if (typeof values.value === 'string') {
          // 使用表单中的文件内容
          fileContent = values.value;
        } else if (editingRecord?.type === 'hash' && editingRecord.hashValue?.fileContent) {
          // 从原有记录中获取文件内容
          fileContent = editingRecord.hashValue.fileContent;
        } else if (editingRecord?.type === 'string' && editingRecord.value) {
          try {
            const parsedValue = JSON.parse(editingRecord.value);
            if (parsedValue.type === 'file' && parsedValue.fileContent) {
              fileContent = parsedValue.fileContent;
            }
          } catch (e) {
            console.error('Parse file content error:', e);
          }
        }

        // 确保有文件内容
        // if (!fileContent) {
        //   message.error('文件内容不能为空');
        //   return;
        // }

        // 创建 Blob 并添加到 FormData
        if (fileContent) {
          const blob = new Blob([fileContent]);
          formData.append('file', blob, uploadFileName);
          formData.append('fileName', uploadFileName);
        }

        
        // 根据类型设置不同的 type
        if (editingRecord?.type === 'hash') {
          formData.append('type', 'hash-file');
        } else {
          formData.append('type', 'string');
        }

        // 发送请求
        const response = await axios.put(`${domain}/cache/updatefile`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });

        if (response.status === 200 && response.data.code === 0) {
          message.success('保存成功');
          setEditModalVisible(false);
          fetchData(pagination.current || 1, pagination.pageSize || 10);
        } else {
          message.error(response.data.message || '保存失败');
        }
        return;
      }

      // 如果不是文件类型，使用 JSON
      const requestBody: {
        key: string;
        type: string;
        ttl: number;
        value?: string;
        listValue?: any[];
        hashValue?: any;
        setValue?: string[];
        zsetValue?: { score: number; member: string }[];
      } = {
        key: values.key,
        type: values.type,
        ttl: values.ttl === undefined ? -1 : Number(values.ttl),
      };

      // 根据类型处理不同的值
      switch (editingRecord?.type) {
        case 'string':
          // 如果是文件类型且已经有文件名但没有新上传的文件，保持原有值
          if (isFile && uploadFileName && !(values.value instanceof ArrayBuffer)) {
            requestBody.value = JSON.stringify({
              type: 'file',
              fileName: uploadFileName,
              fileContent: values.value
            });
          } else {
            requestBody.value = values.value;
          }
          break;
        case 'list':
          try {
            requestBody.listValue = JSON.parse(values.value).map(item => JSON.stringify(item));
          } catch (e) {
            message.error('JSON格式不正确');
            return;
          }
          break;
        case 'hash':
          if (isFile && uploadFileName && !(values.value instanceof ArrayBuffer)) {
            // 如果是文件类型的 hash，且没有新上传文件
            requestBody.hashValue = {
              type: 'hash-file',
              fileName: uploadFileName,
              fileContent: values.value
            };
          } else {
            try {
              requestBody.hashValue = JSON.parse(values.value);
            } catch (e) {
              message.error('JSON格式不正确');
              return;
            }
          }
          break;
        case 'set':
          requestBody.setValue = values.value
            .split('\n')
            .filter(Boolean)
            .map((item: string) => {
              const { isJSON, value } = tryParseJSON(item);
              return isJSON ? JSON.stringify(value) : item;
            });
          break;
        case 'zset':
          requestBody.zsetValue = values.value
            .split('\n')
            .filter(Boolean)
            .map((line: string) => {
              const [score, ...valueParts] = line.trim().split(/\s+/);
              const valueStr = valueParts.join(' ');
              const { isJSON, value } = tryParseJSON(valueStr);
              return {
                score: Number(score),
                member: isJSON ? JSON.stringify(value) : valueStr
              };
            });
          break;
      }

      // 发送 application/json 请求
      const response = await axios.put(`${domain}/cache/update`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 200 && response.data.code === 0) {
        message.success('保存成功');
        setEditModalVisible(false);
        fetchData(pagination.current || 1, pagination.pageSize || 10);
      } else {
        message.error(response.data.message || '保存失败');
      }
    } catch (error) {
      console.error('保存数据错误:', error);
      message.error('保存失败');
    }
  };

  // 添加格式化函数
  const formatListValue = (value: string): string => {
    try {
      // 尝试解析为 JSON
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.join('\n');
      }
    } catch (e) {
      // 如果不是 JSON，按照换行符分割
      return value.split(/[,，]/).map(item => item.trim()).filter(Boolean).join('\n');
    }
    return value;
  };

  const formatHashValue = (value: string): string => {
    try {
      // 尝试解析为 JSON
      const parsed = JSON.parse(value);
      if (typeof parsed === 'object' && parsed !== null) {
        return Object.entries(parsed)
          .map(([key, value]) => `${key} ${value}`)
          .join('\n');
      }
    } catch (e) {
      // 如果不是 JSON，尝试按照空格和换行符分割
      return value
        .split('\n')
        .map(line => {
          const trimmed = line.trim();
          if (!trimmed) return '';
          // 确保每行有仅有一个空格分隔符
          return trimmed.split(/\s+/).filter(Boolean).join(' ');
        })
        .filter(Boolean)
        .join('\n');
    }
    return value;
  };

  // 添加格式化 JSON 的函数
  const formatJSON = (str: string): string => {
    try {
      return JSON.stringify(JSON.parse(str), null, 2);
    } catch (e) {
      return str;
    }
  };

  // 修改 renderValueEditor 函数
  const renderValueEditor = (type: string) => {
    if (!type) return null;

    if (isFile) {
      return (
        <Form.Item name="value" noStyle>
          <FileUploader 
            form={form} 
            setUploadFileName={setUploadFileName}
            value={form.getFieldValue('value')}
          />
        </Form.Item>
      );
    }

    switch (type) {
      case 'string':
        return <Input.TextArea rows={4} placeholder="请输入字符串值" />;
      case 'list':
      case 'hash':
        return (
          <div style={{ border: '1px solid #d9d9d9', borderRadius: '2px' }}>
            <Editor
              height="200px"
              defaultLanguage="json"
              value={editorContent}
              onChange={(value) => {
                setEditorContent(value || '');
                form.setFieldsValue({ value: value });
              }}
              options={{
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                formatOnPaste: true,
                formatOnType: true,
              }}
            />
          </div>
        );
      case 'set':
        return <Input.TextArea 
          rows={4} 
          placeholder="请输入集合值，多个值请用换行分隔"
        />;
      case 'zset':
        return <Input.TextArea 
          rows={4} 
          placeholder="请输入有序集合值，格式：score value（每行一个）"
        />;
      default:
        return <Input />;
    }
  };

  // 新增处理新增数的函数
  const handleAdd = () => {
    setCurrentType('');
    setIsFile(false);
    setUploadFileName('');
    setEditorContent('');
    form.resetFields();
    form.setFieldsValue({ ttl: -1 }); // 设置默认 ttl 值
    setAddModalVisible(true);
  };

  // 修改新增弹窗的表单部分
  const handleTypeChange = (value: string) => {
    setCurrentType(value);
    if (isFile) {
      setIsFile(false);
    }
    setEditorContent('');
    form.setFieldsValue({ 
      value: undefined
    });
  };

  // 添加一个类型映射函数
  const getTypeText = (type: string): string => {
    const typeMap: { [key: string]: string } = {
      'string': '字符串',
      'list': '列表',
      'hash': '哈希表',
      'set': '集合',
      'zset': '有序集合'
    };
    return typeMap[type] || type;
  };

  const columns = [
    {
      title: '键名',
      dataIndex: 'key',
      key: 'key',
      width: '25%',
      ellipsis: true,
    },
    {
      title: '数据类型',
      dataIndex: 'type',
      key: 'type',
      width: '12%',
      render: (type: string) => getTypeText(type),
    },
    {
      title: '值',
      key: 'value',
      width: '40%',
      render: (_: any, record: RedisData) => {
        const getValue = () => {
          switch (record.type) {
            case 'hash':
              // 检查是否为文件类型的数据
              if (record.hashValue?.type === 'hash-file' && record.hashValue?.fileName) {
                return `文件: ${record.hashValue.fileName}`;
              }
              return JSON.stringify(record.hashValue);
            case 'string':
              // 检查是否为文件类型的数据
              try {
                const parsedValue = JSON.parse(record.value || '');
                if (parsedValue.type === 'file' && parsedValue.fileName) {
                  return parsedValue.fileName; // 如果是文件，返回文件名
                }
              } catch (e) {
                // 如果解析失败，说明是普通字符串
              }
              return record.value;
            case 'list':
              return record.listValue?.join(', ');
            case 'set':
              return record.setValue?.join(', ');
            case 'zset':
              return record.zsetValue?.map(item => 
                `${item.score} ${item.member}`
              ).join(', ');
            default:
              return '';
          }
        };

        const value = getValue();
        return (
          <div style={{ 
            height: '32px',
            overflow: 'hidden',
            padding: '4px 12px',
            backgroundColor: '#fafafa',
            borderRadius: '4px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}>
            <span style={{ 
              margin: 0,
              fontSize: '13px',
              fontFamily: "'SF Mono', Monaco, Menlo, Consolas, 'Ubuntu Mono', monospace",
              color: '#595959',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%'
            }}>
              {value}
            </span>
          </div>
        );
      },
    },
    {
      title: 'TTL',
      dataIndex: 'ttl',
      key: 'ttl',
      width: '10%',
      align: 'center' as const,
      render: (ttl: number) => (
        <span className="text-sm">
          {ttl === -1 ? '永久' : `${ttl}秒`}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: '13%',
      align: 'center' as const,
      render: (_: any, record: RedisData) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            style={{ marginRight: '20px' }}
            onClick={() => handleEdit(record)}
          />
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
          />
        </Space>
      ),
    },
  ];

  // 删除数据
  const handleDelete = async (key: string) => {
    try {
      const response = await axios.delete(`${domain}/cache/delete/${key}`);

      if (response.status === 200 && response.data.code === 0) {
        message.success('删除成功');
        fetchData(pagination.current || 1, pagination.pageSize || 10);
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  useEffect(() => {
    fetchData(1, 10);
  }, []);

  // 修改编辑弹窗的关闭处理
  const handleEditModalClose = () => {
    setEditModalVisible(false);
    setIsFile(false);
    setUploadFileName('');
    setEditorContent('');
    form.resetFields();
  };

  // 添加一个处理新增弹窗关闭的函数
  const handleAddModalClose = () => {
    setAddModalVisible(false);
    setCurrentType('');
    setIsFile(false);
    setUploadFileName('');
    setEditorContent(''); // 重置编辑器内容
    form.resetFields(); // 重置所有表单字段
  };

  return (
    <div className="pt-4 px-6" style={{ maxWidth: '80%' }}>
      <div className="my-6 ml-2" style={{ marginLeft: '3%',marginBottom: '2%',marginTop: '15px' }}>
        <Button 
          type="primary" 
          onClick={handleAdd}
          size="middle"
          className="px-4"
        >
          新增数据
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={data}
        rowKey="key"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          pageSizeOptions: ['10', '20', '50', '100'],
          className: 'mt-4',
        }}
        onChange={handleTableChange}
        loading={loading}
        size="middle"
        bordered
        scroll={{ x: '1200px', y: 'calc(100vh - 300px)' }}
        className="bg-white"
        rowClassName={() => 'hover:bg-gray-50'}
        style={{ width: '100%', marginLeft: '3%' }}
      />

      {/* 编辑弹窗 */}
      <Modal
        title="编辑数据"
        okText="更新"
        cancelText="取消"
        open={editModalVisible}
        onOk={handleSave}
        onCancel={handleEditModalClose}
        width={800}
        destroyOnClose
        className="p-4"
      >
        <Form 
          form={form} 
          layout="vertical"
          className="mt-4"
        >
          <Form.Item
            name="key"
            label="键名"
            rules={[{ required: true, message: '请输入键' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="数据类型"
            rules={[{ required: true, message: '请选择数据类型' }]}
          >
            <Input disabled />
          </Form.Item>

          {(editingRecord?.type === 'string' || editingRecord?.type === 'hash') && (
            <Form.Item
              label={
                <span className="flex items-center">
                  <span className="mr-2 font-medium">是否为文件</span>
                  <span className="text-gray-400 text-sm">（文件将以 Base64 格式存储）</span>
                </span>
              }
            >
              <Switch
                checked={isFile}
                onChange={(checked) => {
                  setIsFile(checked);
                  if (checked) {
                    form.setFieldsValue({ 
                      value: undefined 
                    });
                  } else {
                    form.setFieldsValue({ 
                      value: undefined,
                      uploadFileName: undefined
                    });
                  }
                }}
                checkedChildren="是"
                unCheckedChildren="否"
                className={isFile ? 'bg-blue-500' : ''}
              />
            </Form.Item>
          )}

          <Form.Item
            name="value"
            label="值"
            rules={[{ 
              required: true, 
              validator: async (_, value) => {
                // 如果是文件类型，检查是否已有上传的文件
                if (isFile) {
                  if (value instanceof ArrayBuffer || uploadFileName) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('请选择文件'));
                }
                // 非文件类型，检查是否有值
                if (!value && value !== 0) {
                  return Promise.reject(new Error('请输入值'));
                }
                return Promise.resolve();
              }
            }]}
          >
            {editingRecord && renderValueEditor(editingRecord.type)}
          </Form.Item>
          <Form.Item name="ttl" label="过期时间（秒，-1表示永久）">
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 新增弹窗 */}
      <Modal
        title="新增数据"
        okText="创建"
        cancelText="取消"
        open={addModalVisible}
        onOk={async () => {
          try {
            const values = await form.validateFields();
            const formData = new FormData();
            let payload = {};
            // 修改 requestBody 的类型定义和处理逻辑
            const requestBody: {
              key: string;
              type: string;
              ttl: number;
              value: string | null;
              listValue: any[] | null;  // 改为 any[] 以适应不同类型的数组
              hashValue: any | null;    // 改为 any 以适应对象或字符串
              setValue: any[] | null;   // 改为 any[] 以适应不同类型的数组
              zsetValue: any[] | null;  // 改为 any[] 以适应不同类型的数组
            } = {
              key: values.key,
              type: values.type,
              ttl: values.ttl === undefined ? -1 : values.ttl,
              value: null,
              listValue: null,
              hashValue: null,
              setValue: null,
              zsetValue: null
            };

            // 修改各个类型的处理逻辑
            switch (values.type) {
              case 'string':
                if (isFile && values.value instanceof ArrayBuffer) {
                  const blob = new Blob([values.value]);
                  formData.append('file', blob, uploadFileName);
                  formData.append("fileName", uploadFileName);
                  formData.append('key', values.key);
                  formData.append('type', `${values.type}`);
                  formData.append('ttl', values.ttl === undefined ? '-1' : values.ttl.toString());
                  
                  // 修改请求配置
                  const response = await axios.post(`${domain}/cache/setfile`, formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    }
                  });
                  if (response.status === 200 && response.data.code === 0) {
                    message.success('添加成功');
                    setAddModalVisible(false);
                    fetchData(pagination.current || 1, pagination.pageSize || 10);
                  }
                  return; // 文上传完成后直接返回
                } else {
                  requestBody.value = values.value;
                  payload = requestBody;
                }
                break;
              case 'list':
                try {
                  const listValue = JSON.parse(values.value);
                  requestBody.listValue = listValue;  // 直接赋值解析后的数组
                  payload = requestBody;
                } catch (e) {
                  message.error('JSON格式不正');
                  return;
                }
                break;
              case 'hash':
                if (isFile && values.value instanceof ArrayBuffer) {
                  // 如果是文件类型的 hash
                  const blob = new Blob([values.value]);
                  formData.append('file', blob, uploadFileName);
                  formData.append("fileName", uploadFileName);
                  formData.append('key', values.key);
                  formData.append('type', `${values.type}-file`);
                  formData.append('ttl', values.ttl === undefined ? '-1' : values.ttl.toString());
                  
                  // 修改请求配置
                  const response = await axios.post(`${domain}/cache/setfile`, formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    }
                  });
                  if (response.status === 200 && response.data.code === 0) {
                    message.success('添加成功');
                    setAddModalVisible(false);
                    fetchData(pagination.current || 1, pagination.pageSize || 10);
                  }
                  return; // 文件上传完成后直接返回
                } else {
                  // 如果是普通 hash
                  try {
                    const hashValue = JSON.parse(values.value);
                    requestBody.hashValue = hashValue;
                    payload = requestBody;
                  } catch (e) {
                    message.error('JSON格式不正确');
                    return;
                  }
                }
                break;
              case 'set':
                const setValue = values.value.split('\n')
                  .filter(Boolean)
                  .map((item: string) => {
                    const { isJSON, value } = tryParseJSON(item);
                    return isJSON ? JSON.stringify(value) : item;
                  });
                requestBody.setValue = setValue;  // 直接赋值数组
                payload = requestBody;
                break;
              case 'zset':
                const zsetValue = values.value.split('\n')
                  .filter(Boolean)
                  .map((line: string) => {
                    const [score, ...valueParts] = line.trim().split(/\s+/);
                    const valueStr = valueParts.join(' ');
                    const { isJSON, value } = tryParseJSON(valueStr);
                    return { 
                      score: Number(score), 
                      member: isJSON ? JSON.stringify(value) : valueStr 
                    };
                  });
                requestBody.zsetValue = zsetValue;  // 直接赋值数组
                payload = requestBody;
                break;
            }

            // 非文件类型的请求
            const response = await axios.post(`${domain}/cache/set`, payload, {
              headers: {
                'Content-Type': 'application/json',
              }
            });
            
            if (response.status === 200 && response.data.code === 0) {
              message.success('添加成功');
              setAddModalVisible(false);
              fetchData(pagination.current || 1, pagination.pageSize || 10);
            } else {
              message.error(response.data.message || '添加失���');
            }
          } catch (error) {
            console.error('添加数据错误:', error);
            message.error('添加失败');
          }
        }}
        onCancel={handleAddModalClose}
        width={800}
        destroyOnClose
        className="p-4"
      >
        <Form 
          form={form} 
          layout="vertical"
          className="mt-4"
        >
          <Form.Item
            name="key"
            label="键名"
            rules={[{ required: true, message: '请输入键名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="数据类型"
            rules={[{ required: true, message: '请选择数据类型' }]}
          >
            <Select 
              onChange={handleTypeChange}
              disabled={isFile}  // 当开启文件模式时禁用类型选择
            >
              <Select.Option value="string">String</Select.Option>
              <Select.Option value="list">List</Select.Option>
              <Select.Option value="set">Set</Select.Option>
              <Select.Option value="zset">Sorted Set</Select.Option>
              <Select.Option value="hash">Hash</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={
              <span className="flex items-center">
                <span className="mr-2 font-medium">是否为文件</span>
                <span className="text-gray-400 text-sm">（文件将以 Base64 格式存储）</span>
              </span>
            }
          >
            <div className="flex items-center">
              <Switch
                checked={isFile}
                onChange={(checked) => {
                  setIsFile(checked);
                  if (checked) {
                    // 启用文件上传模式
                    setCurrentType('hash');  // 改为 hash 类型
                    form.setFieldsValue({ 
                      type: 'hash',  // 设置表单类型为 hash
                      value: undefined, 
                      fileContent: undefined,
                      listValues: undefined
                    });
                  } else {
                    // 关闭文件上传模式，恢复之前的类型
                    const currentFormType = form.getFieldValue('type');
                    if (currentFormType === 'hash') {  // 修改判断条件
                      // 如果当前是 hash 类型，重置为空
                      form.setFieldsValue({ 
                        type: '',
                        value: undefined, 
                        fileContent: undefined,
                        listValues: undefined
                      });
                      setCurrentType('');  // 重置当前类型状态
                    }
                  }
                }}
                checkedChildren="是"
                unCheckedChildren="否"
                disabled={!currentType}
                className={`${isFile ? 'bg-blue-500' : ''} shadow-sm ${!currentType ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </div>
          </Form.Item>
          
          {currentType && ( // 只有类型时渲染值输入框
            <Form.Item
              name="value"
              label={isFile ? '文件' : (currentType === 'list' ? '列表值' : '值')}
              required
              tooltip={currentType === 'list' ? "可以添加多个列表项" : undefined}
              rules={[{ required: true, message: isFile ? '请选择文件' : '请输入值' }]}
            >
              {renderValueEditor(currentType)}
            </Form.Item>
          )}

          <Form.Item 
            name="ttl" 
            label="过期时间（秒，-1表示永久）"
            initialValue={-1}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataManage;
