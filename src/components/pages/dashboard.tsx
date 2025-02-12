import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  SyncOutlined,
  SettingOutlined,
  FileTextOutlined,
  ApiOutlined,
  DatabaseOutlined,
  FileSearchOutlined,
  RobotOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Link, Outlet } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

// 侧边栏菜单
const MenuItemKeyMap:any = {
  // "define":{
  //   "icon": <FileSearchOutlined />,
  //   "label": "任务定义",
  //   "key": "define",
  //   "children": [
  //     {
  //       "key": "define-task",
  //       "icon": <FileSearchOutlined />,
  //       "label": <Link to={'/dashboard/idl'}>IDL</Link>,
  //       "path": "/dashboard/idl"
  //     }
  //   ]
  // },
  // "sync": {
  //   "icon": <SyncOutlined />,
  //   "label": "同步器", 
  //   "key": "sync",
  //   "children": [
  //     {
  //       "key": "sync-config",
  //       "icon": <SettingOutlined />,
  //       "label": "同步器配置",
  //       "path": "/dashboard/sync/config"
  //     },
  //     {
  //       "key": "sync-log", 
  //       "icon": <FileTextOutlined />,
  //       "label": "同步日志",
  //       "path": "/dashboard/sync/log"
  //     }
  //   ]
  // },
  // "inteface": {
  //   icon: <ApiOutlined />,
  //   label: "接口",
  //   key: "inteface", 
  //   children: [
  //     {
  //       "key": "api-sync",
  //       "icon": <FileTextOutlined />,
  //       "label": <Link to={'/dashboard/api/sync'}>接口列表</Link>,
  //       "path": "/dashboard/api/sync"
  //     },
  //     {
  //       "key": "data-manage",
  //       "icon": <DatabaseOutlined />,
  //       "label": <Link to={'/dashboard/api/data'}>数据管理</Link>,
  //       "path": "/dashboard/api/data"
  //     },
  //     {
  //       "key": "api-scene", 
  //       "icon": <RobotOutlined />,
  //       "label": <Link to={'/dashboard/api/scene'}>场景配置</Link>,
  //       "path": "/dashboard/api/scene"
  //     },
  //     {
  //       "key": "task-config",
  //       "icon": <ClockCircleOutlined />,
  //       "label": <Link to={'/dashboard/api/task'}>任务配置</Link>,
  //       "path": "/dashboard/api/task"
  //     }
  //   ]
  // },
  "configuration": {
    icon: <SettingOutlined />,
    label: "任务配置",
    key: "configuration",
    children: [
      {
        "key": "image-build",
        "icon": <SettingOutlined />,
        "label": <Link to={'/dashboard/api/image-build'}>镜像构建</Link>,
        "path": "/dashboard/api/image-build"
      },
      {
        "key": "sync-config",
        "icon": <SettingOutlined />,
        "label": "同步器",
        "path": "/dashboard/sync/config"
      },
      {
        "key": "api-automation-config",
        "icon": <FileSearchOutlined />,
        "label": "API自动化",
        "path": "/dashboard/api/scene"
      }
    ]
  },
  "data": {
    icon: <SettingOutlined />,
    label: "数据管理",
    key: "data",
    children: [
      {
        "key": "API-data",
        "icon": <SettingOutlined />,
        "label": <Link to={'/dashboard/api/apidata'}>API数据</Link>,
        "path": "/dashboard/api/apidata"
      },
      {
        "key": "api-automation-runrecord",
        "icon": <SettingOutlined />,
        "label": "执行记录",
        "path": "/dashboard/api/runrecord"
      },
      {
        "key": "sync-record",
        "icon": <FileSearchOutlined />,
        "label": "同步记录",
        "path": "/dashboard/sync/record"
      },
      {
        "key": "api-automation-testdata",
        "icon": <FileSearchOutlined />,
        "label": "测试数据",
        "path": "/dashboard/api/testdata"
      }
    ]
  }
}


const routeKeyMap:any = {}

// 子菜单组件
const items:MenuItem[] = []
Object.keys(MenuItemKeyMap).map(key => {
  let subItem:MenuItem
  let children:MenuItem[] = []
  if (MenuItemKeyMap[key]['children'].length > 0) {
      for (let node of MenuItemKeyMap[key]['children'])  {
        children.push(getItem(node["label"],node["key"],node["icon"]))
        if (node['path']) {
          routeKeyMap[node['path']] = node["key"]
        }
      }
  }
  
  subItem = getItem(MenuItemKeyMap[key]['label'],MenuItemKeyMap[key]['key'],MenuItemKeyMap[key]['icon'],children)
  items.push(subItem)
})


// 根据路由选中MenuItem
const getSelectedOneKey  = ()  => {
    const path = window.location.pathname
    if (!routeKeyMap[path]) {
      return []
    }
    return [routeKeyMap[path]]
}

// 获取有子项的菜单，用于加载时默认展开
const getMenuOpenKeys = () => {
  let keys:string[] = []
  Object.keys(MenuItemKeyMap).map(key => {
    if (MenuItemKeyMap[key]['children'].length > 0) {
      keys.push(key)
    }
  })
  return keys
}

const Dashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [selectedItem,setSelectedItem] = useState(getSelectedOneKey())
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div>
          <img
            src={`../../../../logo.png`}
            alt="Logo"
            className="demo-logo-vertical"
            style={{ height: '100px',width: "200px", cursor: 'pointer' }}
            onClick={() => {
              window.history.pushState({}, "", "/dashboard");
              window.location.reload();
            }}
          />
        </div>
        <Menu openKeys={getMenuOpenKeys()} selectedKeys={selectedItem}
             onSelect={() => {setSelectedItem(getSelectedOneKey())}} 
             theme="dark" mode="inline"  items={items} />
      </Sider>
      <Outlet />
    </Layout>
  );
};

export default Dashboard;