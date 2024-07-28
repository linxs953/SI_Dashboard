import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, List, Modal, Table, Layout, message, Tag, Badge, Tooltip, Popover, Checkbox, Form, Pagination } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import axios from 'axios';




const searchApi = async (url: string): Promise<any> => {
    try {
      const response = await axios.get(url);
      return response.data; // 成功时返回数据
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || error.message; // 如果是 Axios 错误，抛出错误信息或响应数据
      } else {
        throw new Error(`Unknown error occurred: ${error}`); // 对于非 Axios 错误，抛出未知错误
      }
    }
};


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

const { Search } = Input;




export default function ScenConfig() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [listData, setListData] = useState<{id:number, text: string }[]>([]);

  const [searchValue, setSearchValue] = useState('');

  const [searchResultsVisible, setSearchResultsVisible] = useState(false);

  const [searchResults, setSearchResults] = useState<{id: number, text: string; }[]>([]);

  const [selectedItems, setSelectedItems] = useState<{id: number, text: string}[]>([]);

  const [selectAll, setSelectAll] = useState(false);


    // 假设的全量数据状态
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);


    const [sceneCurrentPage, setSceneCurrentPage] = useState(1)
    const [scenePageSize, setScenePageSize] = useState(5)
    const [sceneListLoad, setSceneListLoad] = useState({page: 1,pageSize: 10, forceLoad: false})
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [sceneToDelete, setSceneToDelete] = useState(null);





  const [form] = Form.useForm(); // 创建表单实例


  const handleDeleteScene = (scid) => {
      setIsDeleteModalVisible(true)
      setSceneToDelete(scid)
  };

  const deleteScene = async () => {
    try {
      const response = await axios.delete(`http://localhost:8000/scene/delete?sceneId=${sceneToDelete}`);
      if (response.status === 200) {
        message.success("场景删除成功");
      } else {
        message.error("删除场景失败");
      }
    } catch (error) {
      console.error('Error deleting scene:', error);
      message.error("删除场景失败，请检查网络或联系管理员");
    } finally {
        setSceneToDelete(null)
        setIsDeleteModalVisible(false);
        setSceneListLoad({
            ...sceneListLoad,
            forceLoad: true
        })
    }
  };

  const onFinish = async () => {
    try {
        // 触发表单验证
        await form.validateFields();

        // 收集表单数据
        const values = form.getFieldsValue();
        if (listData.length == 0) {
            message.error("请先添加接口")
            return
        }

        let data = {
            scname: values.scenename,
            author: values.author,
            description: values.description,
            actions: listData.map(item => item.id.toString()),
            key: "",
            env: "test"
        }
        let url = 'http://localhost:8000/scene/new'
        const response = await axios.post(url,data)
        if (response.status == 200) {
            message.success("创建场景成功")
            setSceneListLoad({
                ...sceneListLoad,
                forceLoad: true
            })
        } else {
            message.error("创建场景失败")
        }
        setIsModalVisible(false)
        form.resetFields()
    } catch (errorInfo) {
        message.error("请求发送失败")
        setIsModalVisible(false)
        form.resetFields()
        return
    }
  };

  const showModal = () => {
    setSearchValue(''); // 清空搜索框内容
    setListData([])
    setIsModalVisible(true);
  };

  const showSearchModal = () => {
    setSearchResultsVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields()
  };

  const onSearch = (value: string) => {
    if (value === '') {
        message.error('请输入关键词');
        return
    }
    var reqUrl = `http://localhost:8000/api/searchApi?keyword=${value}`
    setLoading(true)
    searchApi(reqUrl).then(data => {
        // setListData(data)
        if (data.data.length === 0) {
            message.info('无搜索结果');
            return
        } else {
            const formattedData = data.data.map((item: any, index: number) => ({
                id: item.id,
                text: `${item.fullName} / ${item.name}`, // 替换为实际的字段名
              }));
            setSearchResults(formattedData);
            setSearchResultsVisible(true);
        }
        setLoading(false)
    }).catch(err=>{
        console.error('Error occurred:', err);
        message.error('搜索失败');
        setLoading(false)
        return
    })
  };

  const onDelete = (id: number) => {
    setListData(prevData => prevData.filter(item => item.id !== id));
  };

  const renderListItem = (item: { id: number; text: string; }) => (
    <List.Item key={item.id}>
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#FDEDEC',
                borderRadius: '8px',
                padding: '4px 8px',
                gap: '8px',
            }}
        >
            <span>{item.text}</span>
            <Button
                type="link"
                size="small"
                style={{
                    color: '#FF7F50',
                    fontSize: 5
                }}
                icon={<CloseOutlined />}
                onClick={() => onDelete(item.id)}
            />
        </div>
    </List.Item>
  );


  const checkAndAddSelectedItems = () => {
    const newItems = selectedItems.filter(item => !listData.some(listItem => listItem.id === item.id));
  
    if (newItems.length < selectedItems.length) {
      message.warning('当前已存在记录');
    }
  
    if (newItems.length > 0) {
      setListData(prevListData => [...prevListData, ...newItems]);
    }
  
    setSearchResultsVisible(false);
    setSelectedItems([]);
    setSearchValue('')
    setSearchResults([])
    setSelectAll(false)
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = searchResults.slice(startIndex, endIndex);

  const sceneStartIndex = (sceneCurrentPage - 1) * scenePageSize;
  const sceneEndIndex = sceneStartIndex + scenePageSize;
  const scenePaginatedData = listData.slice(sceneStartIndex, sceneEndIndex);



  const fetchData = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/scene/allScenes?page=${page}&pageSize=${pageSize}`); 
      response.data.data = response.data.data.map((item: any, index: number) => ({
        ...item,
        key: index.toString(),
      }));
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error("获取场景列表数据失败")
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData(sceneListLoad.page, sceneListLoad.pageSize);
  }, [sceneListLoad.page, sceneListLoad.pageSize]);

  useEffect(() => {
    if (!sceneListLoad.forceLoad) return
    fetchData()
    setSceneListLoad({
        ...sceneListLoad,
        forceLoad: false
    })
  }, [sceneListLoad.forceLoad]);

  return (
    <Layout>
    <div style={{marginTop: 30,marginBottom: 30}}>

      <div style={{
              position: 'fixed',
              left: 210,
              top: 20,
              zIndex: 1
      }}>
        <Button type="primary" onClick={showModal}>新增</Button>
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
                    <Button type="link" onClick={() => message.info('编辑场景')}>
                        编辑
                    </Button>
                    <Button type="link" danger onClick={() => handleDeleteScene(record.sceneId)}>
                        删除
                    </Button>
                </>

            ),
        },
    ]} dataSource={data} loading={loading} />
    <Modal
        title="确认删除?"
        open={isDeleteModalVisible}
        onOk={() => deleteScene()}
        onCancel={() => {
            setIsDeleteModalVisible(false)
            setSceneToDelete(null)
        }}
        okText="确定"
        cancelText="取消"
      >
        是否确认删除场景
    </Modal>
    <Modal
        title="新增测试场景"
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={onFinish}
        okText="提交"
        cancelText="取消"
      >
        <Form
            form={form}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            layout='inline'
        >
        <Form.Item
            label="场景名称"
            name="scenename"
            rules={[{ required: true, message: '请输入场景名称!' }]}
            style={{ width: '450px', marginBottom: '16px' }}
        >
            <Input />
        </Form.Item>

        <Form.Item
            label="场景描述"
            name="description"
            rules={[{ required: true, message: '请输入场景描述!' }]}
            style={{ width: '450px', marginBottom: '16px' }}
        >
            <Input.TextArea />
        </Form.Item>

        <Form.Item
            label="创建人"
            name="author"
            rules={[{ required: true, message: '请输入创建人!' }]}
            style={{ width: '440px', marginBottom: '16px', marginLeft: '16px' }}
        >
            <Input  />
        </Form.Item>
        </Form>
        <Button type="primary" onClick={showSearchModal}>添加</Button>
        <List
            itemLayout="horizontal"
            dataSource={scenePaginatedData}
            renderItem={(item: {id: number, text: string; }, index: number) => renderListItem(item)}
        />
        {listData.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                <Pagination
                current={sceneCurrentPage}
                pageSize={scenePageSize}
                total={listData.length}
                onChange={(page, pageSize) => {
                    setSceneCurrentPage(page);
                    setScenePageSize(pageSize);
                }}
                />
            </div>
        )}
    </Modal>
    <Modal
      title="添加接口"
      open={searchResultsVisible}
      onOk={checkAndAddSelectedItems}
      onCancel={() => {
        setSearchResultsVisible(false);
        setSearchValue('')
        setSearchResults([])
        setSelectedItems([])
        setSelectAll(false)
      }}
      okText="加载到列表"
      cancelText="取消"
      okButtonProps={{ disabled: selectedItems.length === 0 }}
    >
        <Search placeholder="搜索api接口" 
        onSearch={onSearch}
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        style={{ marginBottom: 16 }} />
        {searchResults.length > 0 &&
            <div>
                <Button
                    type="primary"
                    onClick={() => {
                    if (selectAll) {
                        setSelectedItems([]);
                        setSelectAll(false);
                    } else {
                        setSelectedItems(searchResults);
                        setSelectAll(true);
                    }
                    }}
                >
                    {selectAll ? '取消全选' : '全选'}
                </Button>
            </div>
        }
      <List
        style={{marginTop: 20}}
        itemLayout="horizontal"
        dataSource={paginatedData}
        renderItem={(item: {id: number, text: string; }, index: number) => (
            <Checkbox
                key={item.id}
                checked={selectedItems.some(selectedItem => selectedItem.id === item.id)}
                onChange={(e) => {
                if (e.target.checked) {
                    setSelectedItems([...selectedItems, item]);
                } else {
                    setSelectedItems(selectedItems.filter(selectedItem => selectedItem.id !== item.id));
                }
                }}
          >
            {item.text}
          </Checkbox>
        ) }
      />
      {searchResults.length > 0 && (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={searchResults.length}
          onChange={(page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          }}
        />
      </div>
    )}
    </Modal>
    </Layout>
  );
}