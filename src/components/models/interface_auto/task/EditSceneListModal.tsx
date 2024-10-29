import React, { useState, useEffect } from 'react';
import { Modal, Button, message, Popconfirm } from 'antd';
import { MenuOutlined, DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';

interface EditSceneListModalProps {
  visible: boolean;
  sceneList: SceneInfo[];
  onCancel: () => void;
  onOk: (scenes: SceneInfo[]) => void;
}

// 使用 styled-components 定义样式组件
const DraggableItem = styled.div`
  padding: 12px 16px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  margin-bottom: 8px;
  background: #fff;
  display: flex;
  align-items: center;
  cursor: move;
  transition: all 0.3s;
  user-select: none;
  position: relative;

  &:nth-child(even) {
    background: #fafafa;
  }

  &:hover {
    border-color: #1890ff;
    background: #f5f5f5 !important;
    transform: translateX(4px);
  }

  &.dragging {
    background: #f0f0f0 !important;
    border-color: #1890ff;
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
    transform: scale(1.02);
  }

  .anticon-menu {
    opacity: 0.5;
    transition: all 0.3s;
  }

  &:hover .anticon-menu {
    opacity: 1;
    color: #1890ff;
  }
`;

const ListContainer = styled.div`
  position: relative;
  min-height: 100px;
  max-height: 60vh;
  overflow-y: auto;
  padding: 16px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #f0f0f0;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #d9d9d9;
    border-radius: 3px;

    &:hover {
      background-color: #bfbfbf;
    }
  }

  &::-webkit-scrollbar-track {
    background-color: #f5f5f5;
  }
`;

// 添加新的样式组件
const IndexNumber = styled.div`
  margin-right: 16px;
  color: #8c8c8c;
  width: 24px;
  height: 24px;
  line-height: '24px';
  text-align: center;
  background: #f0f0f0;
  border-radius: 50%;
  font-size: 12px;
  transition: all 0.2s;

  ${DraggableItem}:hover & {
    background: #1890ff;
    color: #fff;
  }
`;

const SceneName = styled.div`
  flex: 1;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 8px;
`;

const EditSceneListModal: React.FC<EditSceneListModalProps> = ({
  visible,
  sceneList,
  onCancel,
  onOk,
}) => {
  const [scenes, setScenes] = useState(sceneList);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (visible) {
      setScenes(sceneList);
    }
  }, [visible, sceneList]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.currentTarget.classList.add('dragging');
    // 设置拖动时的半透明效果
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedIndex(null);
    e.currentTarget.classList.remove('dragging');
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newScenes = [...scenes];
    const [draggedItem] = newScenes.splice(draggedIndex, 1);
    newScenes.splice(dropIndex, 0, draggedItem);
    setScenes(newScenes);
  };

  const handleDelete = (index: number) => {
    const newScenes = [...scenes];
    newScenes.splice(index, 1);
    setScenes(newScenes);
  };

  const handleSave = () => {
    if (scenes.length === 0) {
      message.warning('场景列表不能为空');
      return;
    }
    onOk(scenes);
  };

  if (!visible) return null;

  return (
    <Modal
      title="场景列表"
      open={visible}
      onCancel={onCancel}
      width={600}
      maskClosable={false}
      keyboard={false}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          保存
        </Button>,
      ]}
    >
      <ListContainer>
        {scenes.map((item, index) => (
          <DraggableItem
            key={item.sceneId}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <MenuOutlined style={{ marginRight: 16 }} />
            <IndexNumber>{index + 1}</IndexNumber>
            <SceneName>{item.sceneName}</SceneName>
            <Popconfirm
              title="确定要删除该场景吗？"
              onConfirm={() => handleDelete(index)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                danger
                style={{ marginLeft: 8 }}
              />
            </Popconfirm>
          </DraggableItem>
        ))}
      </ListContainer>
    </Modal>
  );
};

export default EditSceneListModal;