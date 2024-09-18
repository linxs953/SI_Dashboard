

import React, { useState } from 'react';
import { Modal, Button, Form, Select } from 'antd';

const { Option } = Select;


const SetEnvironModal = () => {
    const [visible, setVisible] = useState(false);
    const [environment, setEnvironment] = useState('test');
    const [side, setSide] = useState('');

    const handleShow = () => {
        setVisible(true);
    };

    const handleClose = () => {
        setVisible(false);
    };

    const handleEnvironmentChange = (value) => {
        setEnvironment(value);
        setSide(''); // 清空侧边选择
    };

    const handleSideChange = (value) => {
        setSide(value);
    };

    return (
        <>
            <Modal
                title="选择执行环境"
                visible={visible}
                onOk={handleClose}
                onCancel={handleClose}
                okText="保存更改"
                cancelText="取消"
            >
                <Select
                    placeholder="请选择环境"
                    value={environment}
                    onChange={handleEnvironmentChange}
                    style={{ width: '100%', marginBottom: 16 }}
                >
                    <Option value="test">Test</Option>
                    <Option value="prod">Prod</Option>
                </Select>

                <Select
                    placeholder="请选择域名"
                    value={side}
                    onChange={handleSideChange}
                    style={{ width: '100%' }}
                >
                    <Option value="用户侧">用户侧</Option>
                    <Option value="商家侧">商家侧</Option>
                    <Option value="平台侧">平台侧</Option>
                    <Option value="总控侧">总控侧</Option>
                    <Option value="中台侧">中台侧</Option>
                </Select>
            </Modal>
        </>
    );
};

export default SetEnvironModal;


