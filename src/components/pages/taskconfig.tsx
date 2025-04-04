import React from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Space,
  Select,
  InputNumber,
  Switch,
  Collapse,
  Typography,
  message,
  Divider,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { TaskConfig } from '../../types/taskconfig';

const { Panel } = Collapse;
const { Title } = Typography;

const methodOptions = ['GET', 'POST', 'PUT', 'DELETE'].map(m => ({ label: m, value: m }));
const assertionTypes = ['status', 'body', 'headers'].map(t => ({ label: t, value: t }));
const operators = ['equals', 'contains', 'exists', 'regex'].map(o => ({ label: o, value: o }));

const TaskConfigPage: React.FC = () => {
  const [form] = Form.useForm<TaskConfig>();
  
  const handleSubmit = async (values: TaskConfig) => {
    try {
      console.log('Task config:', values);
      message.success('Task configuration saved successfully');
    } catch (error) {
      message.error('Failed to save task configuration');
    }
  };

  const ApiForm: React.FC<{ field: any; index: number }> = ({ field, index }) => (
    <Card
      title={`API ${index + 1}`}
      size="small"
      extra={
        <Form.Item noStyle>
          <MinusCircleOutlined
            onClick={() => {
              const scenarios = form.getFieldValue('scenarios');
              const scenarioIndex = field.name.split('.')[1];
              scenarios[scenarioIndex].apis.splice(index, 1);
              form.setFieldsValue({ scenarios });
            }}
          />
        </Form.Item>
      }
    >
      <Form.Item
        label="Name"
        name={[field.name, 'name']}
        rules={[{ required: true, message: 'Please input API name' }]}
      >
        <Input placeholder="API Name" />
      </Form.Item>

      <Form.Item
        label="URL"
        name={[field.name, 'url']}
        rules={[{ required: true, message: 'Please input API URL' }]}
      >
        <Input placeholder="https://api.example.com/endpoint" />
      </Form.Item>

      <Form.Item
        label="Method"
        name={[field.name, 'method']}
        rules={[{ required: true }]}
      >
        <Select options={methodOptions} />
      </Form.Item>

      <Form.List name={[field.name, 'dependencies']}>
        {(deps, { add, remove }) => (
          <>
            <Title level={5}>Dependencies</Title>
            {deps.map((dep, idx) => (
              <Space key={dep.key} align="baseline">
                <Form.Item
                  name={[dep.name, 'sourceId']}
                  rules={[{ required: true, message: 'Source API required' }]}
                >
                  <Input placeholder="Source API ID" />
                </Form.Item>
                <Form.Item
                  name={[dep.name, 'path']}
                  rules={[{ required: true, message: 'JSON path required' }]}
                >
                  <Input placeholder="$.response.data" />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(idx)} />
              </Space>
            ))}
            <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
              Add Dependency
            </Button>
          </>
        )}
      </Form.List>

      <Form.List name={[field.name, 'assertions']}>
        {(assertions, { add, remove }) => (
          <>
            <Title level={5}>Assertions</Title>
            {assertions.map((assertion, idx) => (
              <Space key={assertion.key} align="baseline">
                <Form.Item
                  name={[assertion.name, 'type']}
                  rules={[{ required: true }]}
                >
                  <Select options={assertionTypes} placeholder="Type" />
                </Form.Item>
                <Form.Item name={[assertion.name, 'path']}>
                  <Input placeholder="$.data.id" />
                </Form.Item>
                <Form.Item
                  name={[assertion.name, 'operator']}
                  rules={[{ required: true }]}
                >
                  <Select options={operators} placeholder="Operator" />
                </Form.Item>
                <Form.Item name={[assertion.name, 'expected']}>
                  <Input placeholder="Expected value" />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(idx)} />
              </Space>
            ))}
            <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
              Add Assertion
            </Button>
          </>
        )}
      </Form.List>

      <Form.List name={[field.name, 'exports']}>
        {(exports, { add, remove }) => (
          <>
            <Title level={5}>Export Data</Title>
            {exports.map((exp, idx) => (
              <Space key={exp.key} align="baseline">
                <Form.Item
                  name={[exp.name, 'name']}
                  rules={[{ required: true, message: 'Export name required' }]}
                >
                  <Input placeholder="Variable name" />
                </Form.Item>
                <Form.Item
                  name={[exp.name, 'path']}
                  rules={[{ required: true, message: 'JSON path required' }]}
                >
                  <Input placeholder="$.response.data" />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(idx)} />
              </Space>
            ))}
            <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
              Add Export
            </Button>
          </>
        )}
      </Form.List>
    </Card>
  );

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Create Task Configuration</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          strategy: {
            retryCount: 3,
            retryInterval: 5,
            timeout: 30,
            priority: 1,
            autoRun: false,
          },
          scenarios: [{
            name: '',
            apis: [],
          }],
        }}
      >
        <Card title="Basic Information">
          <Form.Item
            name="name"
            label="Task Name"
            rules={[{ required: true, message: 'Please input task name' }]}
          >
            <Input placeholder="Enter task name" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} placeholder="Enter task description" />
          </Form.Item>
        </Card>

        <Card title="Task Strategy" style={{ marginTop: 16 }}>
          <Space wrap>
            <Form.Item
              name={['strategy', 'retryCount']}
              label="Retry Count"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} />
            </Form.Item>

            <Form.Item
              name={['strategy', 'retryInterval']}
              label="Retry Interval (s)"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} />
            </Form.Item>

            <Form.Item
              name={['strategy', 'timeout']}
              label="Timeout (s)"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} />
            </Form.Item>

            <Form.Item
              name={['strategy', 'priority']}
              label="Priority"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} max={10} />
            </Form.Item>

            <Form.Item name={['strategy', 'schedule']} label="Schedule">
              <Input placeholder="Cron expression" />
            </Form.Item>

            <Form.Item
              name={['strategy', 'autoRun']}
              label="Auto Run"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Space>
        </Card>

        <Form.List name="scenarios">
          {(scenarios, { add, remove }) => (
            <div style={{ marginTop: 16 }}>
              <Collapse>
                {scenarios.map((scenario, index) => (
                  <Panel
                    header={
                      <Form.Item
                        noStyle
                        shouldUpdate={(prev, curr) =>
                          prev.scenarios?.[index]?.name !==
                          curr.scenarios?.[index]?.name
                        }
                      >
                        {() => {
                          const name = form.getFieldValue([
                            'scenarios',
                            index,
                            'name',
                          ]);
                          return `Scenario ${index + 1}${name ? `: ${name}` : ''}`;
                        }}
                      </Form.Item>
                    }
                    key={scenario.key}
                    extra={
                      scenarios.length > 1 && (
                        <MinusCircleOutlined
                          onClick={(e) => {
                            e.stopPropagation();
                            remove(index);
                          }}
                        />
                      )
                    }
                  >
                    <Form.Item
                      name={[scenario.name, 'name']}
                      label="Scenario Name"
                      rules={[{ required: true, message: 'Please input scenario name' }]}
                    >
                      <Input placeholder="Enter scenario name" />
                    </Form.Item>

                    <Form.Item
                      name={[scenario.name, 'description']}
                      label="Description"
                    >
                      <Input.TextArea
                        rows={2}
                        placeholder="Enter scenario description"
                      />
                    </Form.Item>

                    <Divider>APIs</Divider>

                    <Form.List name={[scenario.name, 'apis']}>
                      {(apis, { add: addApi }) => (
                        <Space direction="vertical" style={{ width: '100%' }}>
                          {apis.map((api, apiIndex) => (
                            <ApiForm
                              key={api.key}
                              field={api}
                              index={apiIndex}
                            />
                          ))}
                          <Button
                            type="dashed"
                            onClick={() => addApi()}
                            icon={<PlusOutlined />}
                            style={{ width: '100%' }}
                          >
                            Add API
                          </Button>
                        </Space>
                      )}
                    </Form.List>
                  </Panel>
                ))}
              </Collapse>
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
                style={{ width: '100%', marginTop: 16 }}
              >
                Add Scenario
              </Button>
            </div>
          )}
        </Form.List>

        <Form.Item style={{ marginTop: 16 }}>
          <Button type="primary" htmlType="submit">
            Save Task Configuration
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default TaskConfigPage;
