import { Button, Card, Divider, Input, Modal, Space, Table, Tooltip, message } from "antd";
import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const {confirm} = Modal

type ListItem = {
    mId:string
    mName:string
    mType:string
    disable: boolean
}



export default function ListPage() {
    let [list,setList] = useState([])
    let [modalShow, setModalShow] = useState(false)
    const columns = [
        {
            "title": "模板ID",
            "key": "mId",
            "dataIndex": "mId"
        },
        {
            "title": "模板名称",
            "key": "mName",
            "dataIndex": "mName"
        },
        {
            "title": "模板类型",
            "key": "mType",
            "dataIndex": "mType"
        },
        {
            "title": "操作",
            "key": "mAction",
            render: (item:ListItem) => {
                return (
                    <Space size="middle">
                        <Button disabled={item.disable}><Link to={"/edit"}>编辑</Link></Button>
                        <Button onClick={del}>删除</Button>
                    </Space>
                )
            }
        }
    ]

    const data:any = [
        {
            "mId": "1",
            "mName": "模板1",
            "mType": "1",
            "disable": false
        }
    ]
    
    const del = () => {
        confirm({
            okType: "danger",
            okText: "确认",
            title: "删除",
            content: "确认删除?",
            cancelText: "取消",
            onOk() {
                // alert("删除成功")
                message.success("删除成功")
                // message.success(import.meta.env.VITE_DOMAIN)
            }
        })
    }

    const fresh = () => {
        setList(data)
    }
    const showNewTemplate = () => {
        setModalShow(true)
    }

    const hideNewTemplate = () => {
        setModalShow(false)
    }

    useEffect(() => {
        fresh()
    },[])

    return (
        <Card>
            <Button shape="circle" type="primary" onClick={showNewTemplate}>+</Button>
            <div>
                {
                    modalShow && 
                    <Modal open={true} 
                            footer={[]} 
                            onCancel={hideNewTemplate}
                    >
                        <h1>添加模板</h1>
                        
                        <Input disabled={true} />
                    </Modal>
                }
            </div>
            <Divider />
            <Table
                columns={columns} 
                dataSource={data} 
                rowKey={(record:ListItem) => record.mId}/>
        </Card>
    )
}