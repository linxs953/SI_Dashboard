import { useEffect, useState } from 'react';
import { Input, Checkbox, List, Button, Space, Modal, Tooltip, message } from 'antd';
import { SearchOutlined, InfoCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';


interface SceneSearchProps {
  open: boolean;
  updateSceneList: React.Dispatch<React.SetStateAction<SceneInfo[]>>;
  onModal: (visible: boolean) => void;
}


const domain = import.meta.env.VITE_API_URL

interface SelectedScene extends SceneInfo {
  count: number;
}

const TaskAddNewScene: React.FC<SceneSearchProps> = ({ 
  open, 
  onModal, 
  updateSceneList
}) => {
  const [scenes, setScenes] = useState<SceneInfo[]>([]);
  const [keyword, setKeyword] = useState('');
  const [selectedScenes, setSelectedScenes] = useState<SelectedScene[]>([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    console.log(scenes)
  }, [scenes]);

  const fetchScenes = async (searchKeyword?: string) => {
    setLoading(true);
    try {
      const url = searchKeyword?.trim() 
        ? `${domain}/scene/search?keyword=${searchKeyword}` 
        : `${domain}/scene/allScenes`;
      const response = await axios.get(url);
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      setScenes(data.map((item:any) => {
        return {
          sceneId: item.sceneId,
          sceneName: item.sceneName,
          actionList: item.actions.map((action:any) => {
            return {
              actionId: action.actionId,
              relateId: action.relateId,
              actionName: action.actionName,
              actionDescription: action.actionDescription || '',
              actionTimeout: action.timeout === 0 ? 10 : action.timeout,
              actionRetry: action.retry === 0 ? 3 : action.retry,
              actionMethod: action.actionMethod,
              actionRoute: action.actionPath,
              actionExpect: action.expect,
              actionOutput: action.output,
              actionSearchKey: action.searchKey,
              actionDomain: action.domainKey,
              actionEnvironment: action.envKey,
              actionDependencies: action.dependency
            }
          }),
          sceneDescription: item.description || '',
          sceneTimeout: item.timeout || 10,
          sceneRetries: item.retries || 3,
          searchKey: item.searchKey || '',
          environment: item.environment || ''
        }
      }));
    } catch (error) {
      console.error('获取场景失败:', error);
      setScenes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    console.log('handleSearch', keyword)
    fetchScenes(keyword.trim());
  };

  const handleSceneSelect = (scene: SceneInfo, e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setSelectedScenes([...selectedScenes, { ...scene, count: 1 }]);
    } else {
      setSelectedScenes(selectedScenes.filter(s => s.sceneId !== scene.sceneId));
    }
  };

  const handleCountChange = (sceneId: string, count: number) => {
    const validCount = Math.min(count, 10);
    setSelectedScenes(selectedScenes.map(scene => 
      scene.sceneId === sceneId ? { ...scene, count: validCount } : scene
    ));
  };


  // 临时生成uuid
  const generateRandomSuffix = (length: number = 10): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleConfirm = () => {
    const scenesWithRandomSuffix: SceneInfo[] = selectedScenes.flatMap((scene: SelectedScene) => {
      return Array.from({ length: scene.count }, (_, index) => {
        const suffix = generateRandomSuffix();
        return {
          ...scene,
          sceneId: uuidv4(),
          sceneName: `${scene.sceneName}_${suffix}`
        };
      });
    });
    
    updateSceneList(prevScenes => [...prevScenes, ...scenesWithRandomSuffix]);
    setSelectedScenes([]);
    setKeyword('');
    setScenes([]);
    onModal(false);
  };

  const handleCancel = () => {
    onModal(false);
    setSelectedScenes([]);
    setScenes([]);
    setKeyword('');
  }

  const handleClearSearch = () => {
    message.success('已清空搜索');
    setKeyword('');
    setScenes([]);
    setSelectedScenes([]);
  };

  return (
    <Modal
      title="添加场景"
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="reset" onClick={handleClearSearch}>
          重置
        </Button>,
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button
          key="confirm"
          type="primary"
          onClick={handleConfirm}
          disabled={selectedScenes.length === 0}
        >
          确认添加 {selectedScenes.length ? `(${selectedScenes.length})` : ''}
        </Button>
      ]}
      width={800}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input.Search
          placeholder="请输入关键词搜索场景"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onSearch={() => {
            fetchScenes(keyword.trim());
          }}
          size="large"
          allowClear={false}
          onClear={handleClearSearch}
          enterButton={<SearchOutlined />}
        />

        <List
          loading={loading}
          dataSource={scenes}
          locale={{
            emptyText: (
              <div style={{ 
                textAlign: 'center', 
                padding: '32px 0',
                color: '#999' 
              }}>
                {loading ? '正在搜索...' : '暂无数据，请输入关键词搜索'}
              </div>
            )
          }}
          style={{ 
            maxHeight: '500px', 
            overflowY: 'auto',
            border: '1px solid #f0f0f0',
            borderRadius: '8px',
            padding: '8px'
          }}
          renderItem={(scene: any) => (
            <List.Item
              style={{
                padding: '12px 16px',
                margin: '4px 0',
                backgroundColor: selectedScenes.some(s => s.sceneId === scene.sceneId) 
                  ? 'rgba(24, 144, 255, 0.1)' 
                  : 'white',
                borderRadius: '6px',
                transition: 'all 0.3s',
                border: '1px solid',
                borderColor: selectedScenes.some(s => s.sceneId === scene.sceneId)
                  ? '#1890ff'
                  : '#f0f0f0',
                cursor: 'pointer'
              }}
              onClick={() => {
                const isSelected = selectedScenes.some(s => s.sceneId === scene.sceneId);
                handleSceneSelect(scene, {
                  target: { checked: !isSelected }
                } as CheckboxChangeEvent);
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                width: '100%'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                      onChange={(e) => handleSceneSelect(scene, e)}
                      checked={selectedScenes.some(s => s.sceneId === scene.sceneId)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span style={{ 
                      fontSize: '15px',
                      fontWeight: 500,
                      color: '#262626',
                      marginLeft: '8px'
                    }}>
                      {scene.sceneName}
                    </span>
                  </div>
                  {scene.sceneDescription && (
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <div 
                        style={{ 
                          marginLeft: '30px',
                          marginTop: '4px',
                          fontSize: '13px',
                          color: '#666',
                          lineHeight: '1.5',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          wordBreak: 'break-all',
                          maxWidth: '560px'
                        }}
                      >
                        {scene.sceneDescription}
                      </div>
                      <Tooltip 
                        title={scene.sceneDescription}
                        placement="top"
                        overlayStyle={{ maxWidth: '400px' }}
                      >
                        <InfoCircleOutlined 
                          style={{ 
                            marginLeft: '4px',
                            marginTop: '6px',
                            color: '#999',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Tooltip>
                    </div>
                  )}
                  <div style={{ 
                    marginLeft: '30px',
                    marginTop: '4px',
                    fontSize: '12px',
                    color: '#999'
                  }}>
                    用例数: {scene.actionList?.length || 0}
                  </div>
                </div>
                {selectedScenes.some(s => s.sceneId === scene.sceneId) && (
                  <div 
                    onClick={(e) => e.stopPropagation()} 
                    onMouseDown={(e) => e.stopPropagation()}
                    style={{ 
                      padding: '4px',
                      borderRadius: '4px'
                    }}
                  >
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      style={{ 
                        width: 100,
                        borderRadius: '4px'
                      }}
                      value={selectedScenes.find(s => s.sceneId === scene.sceneId)?.count}
                      onChange={(e) => handleCountChange(scene.sceneId, parseInt(e.target.value) || 1)}
                      onBlur={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        if (value > 10) {
                          handleCountChange(scene.sceneId, 10);
                        }
                      }}
                      placeholder="实例化数量"
                    />
                  </div>
                )}
              </div>
            </List.Item>
          )}
        />
      </Space>
    </Modal>
  );
};

export default TaskAddNewScene; 