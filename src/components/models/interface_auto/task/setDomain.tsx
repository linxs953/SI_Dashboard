

import React, { useState } from 'react';
import { Modal, Button, Form, Select } from 'antd';
import Options from 'src/components/basic/options';

const { Option } = Select;


const options = [
    {label: 'Test', value: 'test'},
    {label: 'Prod', value: 'prod'},
]

const sideOptions = [
    {label: '用户侧', value: '用户侧'},
    {label: '商家侧', value: '商家侧'},
    {label: '平台侧', value: '平台侧'},
    {label: '总控侧', value: '总控侧'},
    {label: '中台侧', value: '中台侧'},
]

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

    const handleEnvironmentChange = (value:string) => {
        setEnvironment(value);
        setSide(''); // 清空侧边选择
    };

    const handleSideChange = (value:string) => {
        setSide(value);
    };

    return (
        <>
            <Modal
                title="选择执行环境"
                open={visible}
                onOk={handleClose}
                onCancel={handleClose}
                okText="保存更改"
                cancelText="取消"
            >
                <Options
                    placeholder="请选择环境"
                    value={environment}
                    onChange={handleEnvironmentChange as any}
                    style={{ width: '100%', marginBottom: 16 }}
                    data={options}
                />

                <Options
                    placeholder="请选择侧边"
                    value={side}
                    onChange={handleSideChange as any}
                    style={{ width: '100%' }}
                    data={sideOptions}
                />
            </Modal>
        </>
    );
};

export default SetEnvironModal;


