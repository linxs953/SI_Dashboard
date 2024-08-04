import React from 'react';
import { Modal } from 'antd';

interface ConfirmDeleteModalProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  content?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isVisible, onConfirm, onCancel, title = '确认删除?', content = '是否确认删除?' }) => {
  return (
    <Modal
      title={title}
      open={isVisible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="确定"
      cancelText="取消"
    >
      {content}
    </Modal>
  );
};

export default ConfirmDeleteModal;