import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, List, Avatar, Table, Layout, Space, Select, message } from 'antd';
import axios from 'axios';


const columns = [
  {
    title: 'ApiId',
    dataIndex: 'ApiId',
    key: 'ApiId',
  },
  {
    title: '模块',
    dataIndex: 'FolderName',
    key: 'FolderName',
  },
  {
    title: '接口名',
    dataIndex: 'ApiName',
    key: 'ApiName',
  },
  {
    title: '方法',
    dataIndex: 'ApiMethod',
    key: 'ApiMethod',
  },
  {
    title: '接口路径',
    dataIndex: 'ApiPath',
    key: 'ApiPath',
  },
  {
    title: '数据来源',
    dataIndex: 'Source',
    key: 'Source',
  },
  {
    title: '状态',
    dataIndex: 'State',
    key: 'State',
  },
  {
    title: '创建时间',
    dataIndex: 'CreateAt',
    key: 'CreateAt',
  },
  {
    title: '最新同步时间',
    dataIndex: 'UpdateAt',
    key: 'UpdateAt',
  }
];


const { Option } = Select;
const domain = import.meta.env.VITE_API_URL 


export default function ApiSyncList() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false); // 用于控制数据加载状态
  const isInitialMount = useRef(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 在useState中添加一个变量来保存当前选择的HTTP方法
const [selectedMethod, setSelectedMethod] = useState('GET');

// 定义Select组件的onChange处理函数
const handleChange = (value) => {
  setSelectedMethod(value);
};


  // 使用useEffect hook来处理数据获取的副作用
  const fetchData = async (current = 1) => {
    setLoading(true); // 开始加载数据
    try {
      // 格式化请求参数
      const url  = `${domain}/api/getApiList?pageSize=${pagination.pageSize}&pageNum=${current}`
      const response = await axios.get(url); 
      console.log(response.data)
      // 给 data 的每个元素加上一个 state 属性
      const newData = response.data.data.map(item => ({
        ...item,
        State: '已同步',
        key: item.ApiId,
      }));
      setData(newData); // 更新数据
      setPagination(prevState => ({ ...prevState, total: response.data.totalNum }));
    } catch (error) {
      message.error('数据获取失败，请检查网络或稍后重试');
    } finally {
      setLoading(false); // 结束加载状态
    }
  };


  useEffect(() => {
    if (isInitialMount.current) {
      fetchData(); // 请求初始数据
      isInitialMount.current = false; // 标记为非首次渲染
    }
    
  }, []);

  const handlePageChange = (page) => {
    setPagination({ ...pagination, current: page });
    fetchData(page); // 请求新页的数据
  };


  // 处理搜索输入变化的函数
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // 处理点击同步按钮的函数
  const handleSyncClick = () => {
    // 重新获取数据，通常情况下这里会清空搜索条件
    setSearch('');
  };

  // 渲染组件
  return (
    <Layout>
    <div style={{marginTop: 30,marginBottom: 30}}>
      <Space>

        {/* <label style={{marginLeft: 10}}>请求方法</label>
        <Select value={selectedMethod} onChange={handleChange} style={{marginLeft: 30}} dropdownStyle={{width: 100}}>
          <Option value="GET">GET</Option>
          <Option value="POST">POST</Option>
          <Option value="PUT">PUT</Option>
          <Option value="DELETE">DELETE</Option>
          <Option value="HEAD">HEAD</Option>
          <Option value="OPTIONS">OPTIONS</Option>
          <Option value="PATCH">PATCH</Option>
        </Select>

        <label style={{marginLeft: 10}}>接口名称</label>
        <Input
            placeholder="请输入关键词搜索"
            value={search}
            onChange={handleSearchChange}
            style={{ width: 200, marginRight: 8, marginLeft: 30 }}
        /> */}

        
      </Space>

      {/* <div style={{
              position: 'fixed',
              right: '10px',
              top: '10px',
              marginTop: '20px'
      }}>
        <Button type="primary" onClick={handleSyncClick}>同步</Button>
      </div> */}
    </div>

    <Table columns={columns} dataSource={data} loading={loading} pagination={{
        ...pagination,
        showSizeChanger: false,
        onChange: handlePageChange,
    }} />
    </Layout>
  );
}