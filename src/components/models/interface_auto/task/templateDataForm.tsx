import React, { useEffect, useState, useRef } from 'react';
import { Form, message, Modal, Button, Space, Tooltip, Spin } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { Editor, loader } from '@monaco-editor/react';
import { ClockCircleOutlined, SyncOutlined } from '@ant-design/icons';
import * as monaco from 'monaco-editor';

// 在组件外部设置 Monaco Editor 的 CDN 路径
loader.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs' } });

interface DependInfo {
  extra: string;
}

interface TemplateDataFormProps {
  form: FormInstance;
  dependInfo: DependInfo;
  onExtraChange: (value: DependInfo) => void;
}

export const TemplateDataForm: React.FC<TemplateDataFormProps> = ({ 
  form, 
  dependInfo, 
  onExtraChange, 
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    form.setFieldsValue({
      templateData: dependInfo.extra
    });
    setHasUnsavedChanges(false);
  }, [dependInfo, form]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      form.setFieldsValue({
        templateData: value
      });
      setHasUnsavedChanges(value !== dependInfo.extra);
    }
  };

  const handleEditorBeforeMount = (monaco: typeof import('monaco-editor')) => {
    // 不需要在这里创建模型，Monaco 会自动处理
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    setIsEditorReady(true);
  };

  const handleUpdate = () => {
    const currentValue = form.getFieldValue('templateData');
    onExtraChange({
      ...dependInfo,
      extra: currentValue
    });
    setHasUnsavedChanges(false);
    message.success('数据模板已更新');
  };

  // 弹窗逻辑处理
  const handleModalOk = () => {
    const currentValue = form.getFieldValue('templateData');
    onExtraChange({
      ...dependInfo,
      extra: currentValue
    });
    setIsModalVisible(false);
    message.success('数据模板保存成功');
  };

  const handleModalCancel = () => {
    form.setFieldsValue({
      templateData: dependInfo.extra
    });
    setIsModalVisible(false);
  };

  // 修改：处理编辑器加载中的函数
  const handleEditorLoading = () => (
    <div style={{ 
      height: '300px', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      background: 'rgba(0, 0, 0, 0.05)', 
      borderRadius: '4px'
    }}>
      <Spin tip="编辑器正在初始化中..." size="large" fullscreen={true}>
        <div style={{ 
          padding: '0 20px', 
          whiteSpace: 'nowrap',
          lineHeight: '300px'  // 使文本垂直居中
        }}></div>
      </Spin>
    </div>
  );

  return (
    <>
      <Form form={form} layout="vertical">
        <Form.Item
          name="templateData"
          label={
            <Space>
              <span>模板数据</span>
              {hasUnsavedChanges && (
                <Tooltip title="有未保存的更改">
                  <ClockCircleOutlined style={{ color: '#faad14' }} />
                </Tooltip>
              )}
              {hasUnsavedChanges && (
                <Tooltip title="更新模板">
                  <Button type="link" size="small" icon={<SyncOutlined />} onClick={handleUpdate} />
                </Tooltip>
              )}
            </Space>
          }
        >
          <Editor
            language="json"
            theme="vs-light"
            onChange={handleEditorChange}
            value={form.getFieldValue('templateData') || ''}
            options={{
              minimap: { enabled: false },
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              tabSize: 2,
              readOnly: !isEditorReady,
            }}
            height="300px"
            beforeMount={handleEditorBeforeMount}
            onMount={handleEditorDidMount}
            loading={handleEditorLoading()}
          />
        </Form.Item>
      </Form>
      <Modal
        title="保存更改"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="保存"
        cancelText="取消"
      >
        <p>您是否要保存对模板数据的更改？</p>
      </Modal>
    </>
  );
};
