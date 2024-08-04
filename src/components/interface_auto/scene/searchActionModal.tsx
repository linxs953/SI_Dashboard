import React, { useState } from 'react';
import { Modal, List, Checkbox, Button, Pagination, message, Input } from 'antd';
import axios from 'axios';

interface AddApiModalProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const Search = Input.Search

const AddApiModal: React.FC<AddApiModalProps> = ({ visible, onOk, onCancel }) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<{id: number, text: string}[]>([]);
  const [selectedItems, setSelectedItems] = useState<{id: number, text: string}[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const onSearch = (value: string) => {
    if (value === '') {
      message.error('请输入关键词');
      return;
    }
    const reqUrl = `http://localhost:8000/api/searchApi?keyword=${value}`;
    axios.get(reqUrl)
      .then(response => {
        if (response.data.data.length === 0) {
          message.info('无搜索结果');
        } else {
          const formattedData = response.data.data.map((item: any, index: number) => ({
            id: item.id,
            text: `${item.fullName} / ${item.name}`,
          }));
          setSearchResults(formattedData);
        }
      })
      .catch(error => {
        console.error('Error occurred:', error);
        message.error('搜索失败');
      });
  };

  const checkAndAddSelectedItems = () => {
    const newItems = selectedItems.filter(item => !searchResults.some(result => result.id === item.id));

    if (newItems.length < selectedItems.length) {
      message.warning('当前已存在记录');
    }

    if (newItems.length > 0) {
      // 这里可以调用父组件的方法来更新state，例如 setListData
      onOk();
    }

    setSearchResultsVisible(false);
    setSelectedItems([]);
    setSearchValue('');
    setSearchResults([]);
    setSelectAll(false);
  };

  return (
    <Modal
      title="添加接口"
      open={visible}
      onOk={checkAndAddSelectedItems}
      onCancel={onCancel}
      okText="加载到列表"
      cancelText="取消"
      okButtonProps={{ disabled: selectedItems.length === 0 }}
    >
      <Search placeholder="搜索api接口" onSearch={onSearch} value={searchValue} onChange={e => setSearchValue(e.target.value)} style={{ marginBottom: 16 }} />
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
        dataSource={searchResults.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        renderItem={(item: {id: number, text: string}, index: number) => (
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
        )}
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
  );
};

export default AddApiModal;