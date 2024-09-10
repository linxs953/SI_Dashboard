import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, List, Modal, Table, Layout, message, Tag, Badge, Tooltip, Popover, Checkbox, Form, Pagination } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import ConfirmDeleteModal from '../components/interface_auto/scene/deleteSceneModal';
import NewSceneModal from '../components/interface_auto/scene/newSceneModal';



let columns = [
  {
    title: '场景ID',
    dataIndex: 'sceneId',
    key: 'sceneId',
    align: 'center'
  },
  {
    title: '场景名称',
    dataIndex: 'sceneName',
    key: 'sceneName',
    align: 'center'
  },

  {
    title: '创建人',
    dataIndex: 'author',
    key: 'author',
    align: 'center'
  },
  {
    title: '场景唯一码',
    dataIndex: 'searchKey',
    key: 'searchKey',
    align: 'center'
  },
  {
    title: '环境信息',
    dataIndex: 'envKey',
    key: 'envKey',
    align: 'center'
  },
  {
    title: '用例数',
    dataIndex: 'actionCounts',
    key: 'actionCounts',
    align: 'center'
  },
  {
    title: '创建时间',
    dataIndex: 'createAt',
    key: 'createAt',
    align: 'center'
  },
  {
    title: '更新时间',
    dataIndex: 'updateAt',
    key: 'updateAt',
    align: 'center'
  },
];





export default function ScenConfig() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const initPage = {page:1,pageSize: 10}
  const [sceneListLoad, setSceneListLoad] = useState(initPage)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [sceneToDelete, setSceneToDelete] = useState(null);

  const navigate = useNavigate();

  const isInitialMount = useRef(true);

  const handleDeleteScene = (scid) => {
      setIsDeleteModalVisible(true)
      setSceneToDelete(scid)
  };

  const handleEditScene = (scid) => {
    navigate(`/dashboard/api/scene/edit?sceneId=${scid}`);
  };

  const deleteScene = async () => {
    try {
      const response = await axios.delete(`http://localhost:8000/scene/delete?sceneId=${sceneToDelete}`);
      if (response.status === 200) {
        message.success("场景删除成功");
        fetchData(initPage.page,initPage.pageSize)
      } else {
        message.error("删除场景失败");
      }
    } catch (error) {
      console.error('Error deleting scene:', error);
      message.error("删除场景失败，请检查网络或联系管理员");
    } finally {
        setSceneToDelete(null)
        setIsDeleteModalVisible(false);
    }
  };


  const showModal = () => {
    setIsModalVisible(true);
  };

  
  const closeModal = () => {
    setIsModalVisible(false);
  };
 
  const fetchData = async (page = 1, pageSize = 10) => {
    try {
      const response = await axios.get(`http://localhost:8000/scene/allScenes?page=${page}&pageSize=${pageSize}`); 
      if (response.data && response.data.data) {
        response.data.data = response.data.data.map((item: any, index: number) => ({
            ...item,
            key: index.toString(),
          }));
          setData(response.data.data);
          return
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error("获取场景列表数据失败")
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
        if (data.length == 0) {
            fetchData(sceneListLoad.page, sceneListLoad.pageSize);
        }
        isInitialMount.current = false
    }
  }, []);

  return (
    <Layout>
    <div style={{marginTop: 30,marginBottom: 30}}>

      <div style={{
              position: 'fixed',
              left: 210,
              top: 20,
              zIndex: 1
      }}>
        <Button type="primary" onClick={showModal} disabled={isModalVisible}>新增</Button>
      </div>
    </div>

    <Table columns={[
        ...columns,
        {
            title: '操作',
            key: 'action',
            dataIndex: 'action',
            align: 'center',
            render: (_, record: Record) => (
                <>
                    <Button disabled={true} type="link" onClick={() => handleEditScene(record.sceneId)}>
                        编辑
                    </Button>
                    <Button type="link" danger onClick={() => handleDeleteScene(record.sceneId)}>
                        删除
                    </Button>
                </>

            ),
        },
    ]} dataSource={data} loading={loading} />
    <ConfirmDeleteModal
        isVisible={isDeleteModalVisible}
        onConfirm={deleteScene}
        onCancel={() => {
          setIsDeleteModalVisible(false);
          setSceneToDelete(null);
        }}
    />
    <NewSceneModal visible={isModalVisible} title='test' fetchData={fetchData} closeModel={closeModal} />
    </Layout>
  );
}