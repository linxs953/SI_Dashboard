import {Button, Checkbox, Form, Input, Layout, Modal} from "antd";
import React from "react";
import { Outlet } from "react-router-dom";
import docCookies from "src/utils/cookie"

const {Header} = Layout

export default function Login() {
    let auth = docCookies.getItem("sessionId")
    let name = docCookies.getItem("name")
    const handleLogout = () => {
        docCookies.removeItem("sessionId")
        window.location.reload()
    }
    const handleOk = () => {
        docCookies.setItem("sessionId","value")
        window.location.reload()
    }
    if (auth) {
        return (
            <Button onClick={handleLogout} style={{float: "right",margin:15}}>{name} 退出登录</Button>
        )
    }


    return (
        <Modal title="注册与登录" open={true} closable={false} footer={[]}>
            <Form
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                onFinish={handleOk}
            >
                <Form.Item label="用户名" name="name">
                    <Input />
                </Form.Item>
                <Form.Item label="密码" name="password">
                    <Input.Password />
                </Form.Item>
                <Form.Item  name="submit" wrapperCol={{span: 16,offset: 8}}>
                    <Button type="primary" htmlType="submit" >提交</Button> 
                </Form.Item>
            </Form>
        </Modal>
    )
}