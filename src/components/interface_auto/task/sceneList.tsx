import React from 'react';
import { Table } from 'antd';

interface ScenesListProps {
  scenes: any[];
}

const ScenesList: React.FC<ScenesListProps> = ({ scenes }) => {
  const columns = [
    {
      title: '场景ID',
      dataIndex: 'sceneId',
      key: 'sceneId',
    },
    {
      title: '场景名称',
      dataIndex: 'sceneName',
      key: 'sceneName',
    },
    {
      title: '用例数',
      dataIndex: 'testCaseCount',
      key: 'testCaseCount',
    },
    {
      title: '创建人',
      dataIndex: 'author',
      key: 'author',
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={scenes}
      rowKey="sceneId"
      pagination={false}
      size="small"
      style={{ maxWidth: '90%', margin: 'auto' }}
    />
  );
};

export default ScenesList