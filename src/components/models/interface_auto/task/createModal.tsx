import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button, List, Checkbox, Pagination, Input, message, Form, InputNumber, Table } from 'antd';
import { CloseOutlined,DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import createTaskAddModalStore from 'src/store/task/newTaskModal';

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
  onOk: () => (void);
  onCancel: () => (void);
}

let  Search = Input.Search

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

const  useCreateTaskStore = createTaskAddModalStore()
const domain = import.meta.env.VITE_API_URL 

const NewDataModal: React.FC<NewSceneModalProps> = ({
  visible,
  title,
  searchTitle,
  newModalFormSpec,
  searchPlaceholder,
  onCancel,
  onOk
}) => {

  const [form] = Form.useForm(); // 创建表单实例


  const {
    listData, setListData,
    searchValue, setSearchValue,
    searchResultsVisible, setSearchResultsVisible,
    searchResults, setSearchResults,
    selectedItems, setSelectedItems,
    selectAll, setSelectAll,
    currentPage, setCurrentPage,
    pageSize, setPageSize,
    sceneCurrentPage, setSceneCurrentPage,
    scenePageSize, setScenePageSize
  } = useCreateTaskStore((state) => ({
    listData: state.relateSceneList,
    setListData: state.setRelateSceneList,
    searchValue: state.searchKeyword,
    setSearchValue: state.setSearchKeyword,
    searchResultsVisible: state.searchModalVisible,
    setSearchResultsVisible: state.setSearchModalVisible,
    searchResults: state.searchResult,
    setSearchResults: state.setSearchResult,
    selectedItems: state.selectedScenes,
    setSelectedItems: state.setSelectedScenes,
    selectAll: state.selectAll,
    setSelectAll: state.setSelectAll,
    currentPage: state.searchCurrentPage,
    setCurrentPage: state.setSearchCurrentPage,
    pageSize: state.searchCurrentPageSize,
    setPageSize: state.setSearchCurrentPageSize,
    sceneCurrentPage: state.addSceneCurrentPage,
    setSceneCurrentPage: state.setAddSceneCurrentPage,
    scenePageSize: state.addSceneCurrentPageSize,
    setScenePageSize: state.setAddSceneCurrentPageSize
  }))
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
        let payload = {
           "taskName": values.taskName,
           "author": values.author,
           "sceneList": listData.map((item: addSceneData) => {return {sceneId: item.id,count: item.instanceCount}})
        }
        const submitTaskUrl = `${domain}/task/create`
        const response = await axios.post(submitTaskUrl,payload)
        if (response.status === 200) {
          message.success("新建任务成功")
          // 执行成功回调函数
          onOk()
          form.resetFields()
          // closeModel()
          // fetchData()
        } else {
          message.error("新建任务失败")
        }
        
    } catch(err) {
      console.log(err)
      message.error("创建任务失败")
      return
    }
  };

  const handleCancel = () => {
    // 执行NewModal关闭的回调函数
    onCancel()
    // closeModel()
    form.resetFields()
    // setListData([])
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
    const allSceneUrl = `${domain}/scene/allScenes`
    var reqUrl = `${domain}/scene/search?keyword=${value}`

    if (value === '') {
        searchApi(allSceneUrl).then(data => {
          if (data.data.length === 0) {
            message.info('无搜索结果');
            return
          } else {
            const formattedData = data.data.map((item: any, index: number) => ({
              id: item.sceneId,
              text: `${item.sceneName}`, // 替换为实际的字段名
            }));
          setSearchResults(formattedData);          }
        }).catch(err=>{
          console.error('Error occurred:', err);
          message.error('搜索失败');
          return
      })
        return
    }
    searchApi(reqUrl).then(data => {
        if (data.data.length === 0) {
            message.info('无搜索结果');
            return
        } else {
            const formattedData = data.data.map((item: any, index: number) => ({
                id: item.sceneId,
                text: `${item.sceneName}`, 
              }));
            setSearchResults(formattedData);
            setSearchResultsVisible(true);
        }
    }).catch(err=>{
        console.error('Error occurred:', err);
        message.error('搜索失败');
        return
    })
  };

  const checkAndAddSelectedItems = () => {
    let newItems:addSceneData[] = selectedItems.map((item) => ({ ...item, instanceCount: 1 }));
    newItems = newItems.filter(item => !listData.some(listItem => listItem.id === item.id))

    if (newItems.length < selectedItems.length) {
      message.warning('当前已存在记录');
    }
  
    if (newItems.length > 0) {
      // 把newitems和listData合并
      newItems = listData.concat(newItems)
      setListData(newItems);    
    }
  
    setSearchResultsVisible(false);
    setSelectedItems([]);
    setSearchValue('')
    setSearchResults([])
    setSelectAll(false)
  };

  const onDelete = (id: number) => {
    // 根据item.id !== id 过滤数据ListData
    const newItems = listData.filter((item: addSceneData) => item.id !== id)
    setListData(newItems);
  };

  const handleTextChange = (value: string, id: number) => {
    const newItems = listData.map((item: addSceneData) =>
      item.id === id ? { ...item, text: value } : item
    );
    setListData(newItems);
  };

  // 更新实例数
  const handleInstanceCountChange = (value: number, id: number) => {
    console.log(value)
    const newItems = listData.map((item: addSceneData) =>
      item.id === id ? { ...item, instanceCount: value } : item
    );
    setListData(newItems);
    
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

  const renderSearchResultItem = (item:searchSceneItem) => {
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
        labelCol={{ span: 5 }} wrapperCol={{ span: 14 }}
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