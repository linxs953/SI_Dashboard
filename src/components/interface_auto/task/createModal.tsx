import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button, List, Checkbox, Pagination, Input, message, Form, InputNumber, Table } from 'antd';
import { CloseOutlined,DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import Item from 'antd/es/list/Item';


let  Search = Input.Search

interface createNewTaskPayload {
  taskName:string
  taskSpec:string
  scenes: Array<sceneDetail>
}

interface sceneDetail {
  sceneID:string
  sceneName:string
  count: number
}

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

interface FormItemInfo {
    itemLabel:string;
    itemName:string;
    itemErrorMsg:string;
    itemStyle:React.CSSProperties;
    disable: boolean;
    type: string;
}

interface NewSceneModalProps {
  title: string;
  searchTitle:string;
  newModalFormSpec:Array<FormItemInfo>,
  searchPlaceholder: string,
  visible: boolean;
  fetchData: (page?: number, pageSize?: number) => Promise<void>;
  closeModel: () =>(void);
}

const NewDataModal: React.FC<NewSceneModalProps> = ({
  visible,
  title,
  searchTitle,
  fetchData,
  closeModel,
  newModalFormSpec,
  searchPlaceholder
}) => {

  // state: 创建场景 Modal 的数据列表
  const [listData, setListData] = useState<{id:number, text: string,instanceCount:number }[]>([{id: 1, text:"场景1", instanceCount:1}]);

  // state: 创建场景 Modal 的搜索框
  const [searchValue, setSearchValue] = useState('');

  // state: 搜索 Api Modal 的开关
  const [searchResultsVisible, setSearchResultsVisible] = useState(false);

  // state: 搜索 Api Modal 的搜索结果列表
  const [searchResults, setSearchResults] = useState<{id: number, text: string; }[]>([]);

  // state: 搜索 Api Modal 的选中数据
  const [selectedItems, setSelectedItems] = useState<{ id: number; text: string }[]>([]);

  // state: 搜索 Api Modal 的全选,控制是否数据全选
  const [selectAll, setSelectAll] = useState(false);

  const initPage = {page:1,pageSize: 10}

  // state: 搜索 Api Modal 的页码
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // state: 创建场景的数据列表页码
  const [sceneCurrentPage, setSceneCurrentPage] = useState(1)
  const [scenePageSize, setScenePageSize] = useState(5)
  const [form] = Form.useForm(); // 创建表单实例


  // 计算搜索 ApiModal 的分页数据
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = searchResults.slice(startIndex, endIndex);

  // 计算创建场景 Modal 的分页数据
  const sceneStartIndex = (sceneCurrentPage - 1) * scenePageSize;
  const sceneEndIndex = sceneStartIndex + scenePageSize;
  const scenePaginatedData = listData.slice(sceneStartIndex, sceneEndIndex);

  
  const onFinish = async () => {
    try {
        // 触发表单验证
        const values = await form.validateFields()
        if (listData.length === 0) {
          message.error("场景列表为空")
          return
        }
        let payload:createNewTaskPayload = {
           taskName: values["taskName"],
           taskSpec: values["taskSpec"],
           scenes: listData.map((data) => {
            return {
              sceneID: data.id,
              sceneName: data.text,
              count: data.instanceCount
            }
           })
        }
        console.log(payload)
        message.info("已提交")
    } catch(err) {

    }
  };

  const handleCancel = () => {
    closeModel()
    form.resetFields()
  };

  const showSearchModal = () => {
    setSearchResultsVisible(true)
  }


  const renderListItem = (item: { id: number; text: string; instanceCount: number }) => {
    return (
      <List.Item key={item.id}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            // backgroundColor: '#FDEDEC',
            borderRadius: '8px',
            padding: '4px 8px',
            gap: '8px',
          }}
        >
          {/* 可编辑的场景名称 */}
          <Input
            defaultValue={item.text}
            style={{ width: '200px' }}
            // onChange={(e) => handleTextChange(e.target.value, item.id)}
          />
          
          {/* 可编辑的实例数 */}
          <InputNumber
            min={0}
            defaultValue={item.instanceCount}
            style={{ width: '100px', marginLeft: '8px' }}
            // onChange={(value) => handleInstanceCountChange(value!, item.id)}
          />
  
          {/* 删除按钮 */}
          <Button
            type="link"
            size="small"
            style={{
              color: '#FF7F50',
              fontSize: 12, // 调整字体大小
            }}
            icon={<CloseOutlined />}
            onClick={() => onDelete(item.id)}
          />
        </div>
      </List.Item>
    );
  };


  const onSearch = (value: string) => {
    if (value === '') {
        message.error('请输入关键词');
        return
    }
    // var reqUrl = `http://localhost:8000/api/searchApi?keyword=${value}`
    // searchApi(reqUrl).then(data => {
    //     if (data.data.length === 0) {
    //         message.info('无搜索结果');
    //         return
    //     } else {
    //         const formattedData = data.data.map((item: any, index: number) => ({
    //             id: item.id,
    //             text: `${item.fullName} / ${item.name}`, // 替换为实际的字段名
    //           }));
    //         setSearchResults(formattedData);
    //         setSearchResultsVisible(true);
    //     }
    // }).catch(err=>{
    //     console.error('Error occurred:', err);
    //     message.error('搜索失败');
    //     return
    // })
    setSearchResults([{
      id: 1,
      text: "场景测试"
    }])
  };

  const checkAndAddSelectedItems = () => {
    let newItems = selectedItems.map((item) => ({ ...item, instanceCount: 1 }));
    newItems = newItems.filter(item => !listData.some(listItem => listItem.id === item.id))

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

  const onDelete = (id: number) => {
    setListData(prevData => prevData.filter(item => item.id !== id));
  };

  const handleTextChange = (value: string, id: number) => {
    setListData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, text: value } : item
      )
    );
  };

  // 更新实例数
  const handleInstanceCountChange = (value: number, id: number) => {
    console.log(value)
    setListData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, instanceCount: value } : item
      )
    );
    
  };

  const columns = [
    {
      title: '场景名称',
      dataIndex: 'text',
      key: 'text',
      render: (text: string, record: { id: number, text: string, instanceCount: number }) => (
          <Input
            defaultValue={text}
            onBlur={(e) => handleTextChange(e.target.value, record.id)}
          />
      ),
    },
    {
      title: '实例数',
      dataIndex: 'instanceCount',
      key: 'instanceCount',
      render: (instanceCount: number, record: { id: number, text: string, instanceCount: number }) => (
          <InputNumber
            min={1}
            defaultValue={instanceCount}
            onChange={(value) => handleInstanceCountChange(value!, record.id)}
          />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: { id: number, text: string, instanceCount: number }) => (
        <Button
          type="link"
          size="small"
          style={{
            color: '#FF7F50',
            fontSize: 12,
          }}
          icon={<DeleteOutlined />}
          onClick={() => onDelete(record.id)}
        />
      ),
    },
  ];

  const renderSearchResultItem = (item: { id: number; text: string }) => {
    return (
      <List.Item key={item.id}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '8px',
            padding: '4px 8px',
            gap: '8px',
          }}
        >


          {/* 选择按钮 */}
          <Checkbox
            checked={selectedItems.some((selectedItem) => selectedItem.id === item.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedItems([...selectedItems, item]);
              } else {
                setSelectedItems(selectedItems.filter((selectedItem) => selectedItem.id !== item.id));
              }
            }}
          />

          <span>{item.text}</span>

          {/* 删除按钮 */}
          <DeleteOutlined
            style={{ color: 'red', cursor: 'pointer',marginLeft: '30px' }}
            onClick={() => {
              const updatedItems = searchResults.filter((resultItem) => resultItem.id !== item.id);
              setSearchResults(updatedItems);
              setSelectedItems(selectedItems.filter((selectedItem) => selectedItem.id !== item.id));
            }}
          />
        </div>
      </List.Item>
    );
  };

  return (
      <>
      <Modal
      title={title}
      open={visible}
      onCancel={handleCancel}
      onOk={onFinish}
      okText="提交"
      cancelText="取消"
    >
      <Form
        form={form}
        name="basic"
        initialValues={{ remember: true }}
        autoComplete="off"
        layout='inline'
      >
        {newModalFormSpec.map(item => (
          <Form.Item
            label={item.itemLabel}
            name={item.itemName}
            rules={[{ required: true, message: item.itemErrorMsg }]}
            style={item.itemStyle}
           >
            {item.type === "textarea" ? (
                <Input.TextArea disabled={item.disable} />
            ) : (
                <Input
                  disabled={item.disable}
                />
            )}            
           </Form.Item>
        ))}
      </Form>

      <Button type="primary" onClick={showSearchModal}>添加</Button>
      
      <Table
          rowKey="id"
          columns={columns}
          dataSource={scenePaginatedData}
          pagination={false}
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
        title={searchTitle}
        open={searchResultsVisible}
        onOk={checkAndAddSelectedItems}
        onCancel={() => {
          setSearchResultsVisible(false);
          setSearchValue('');
          setSearchResults([]);
          setSelectedItems([]);
          setSelectAll(false);
        }}
        okText="加载到列表"
        cancelText="取消"
        okButtonProps={{ disabled: selectedItems.length === 0 }}
      >
        <Search
          placeholder={searchPlaceholder}
          onSearch={onSearch}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        {searchResults.length > 0 && (
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
        )}
        <List
          style={{ marginTop: 20 }}
          itemLayout="horizontal"
          dataSource={searchResults}
          renderItem={renderSearchResultItem}
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
    </>
  );
};

export default NewDataModal;