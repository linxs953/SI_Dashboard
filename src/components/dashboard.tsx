import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
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
  "inteface": {
    icon: <TeamOutlined />,
    label: "接口",
    key: "inteface",
    children: [
      {
        "key": "api-sync",
        "icon": <PieChartOutlined />,
        "label": <Link to={'/dashboard/api/sync'}>接口列表</Link>,
        "path": "/dashboard/api/sync"
      },
      {
        "key": "api-scene",
        "icon": <PieChartOutlined />,
        "label": <Link to={'/dashboard/api/scene'}>场景配置</Link>,
        "path": "/dashboard/api/scene"
      },
      {
        "key": "task-config",
        "icon": <PieChartOutlined />,
        "label": <Link to={'/dashboard/api/task'}>任务配置</Link>,
        "path": "/dashboard/api/task"
      },
      // {
      //   "key": "api-td-manage",
      //   "icon": <PieChartOutlined />,
      //   "label": <Link to={'/dashboard/api/testdata/import'}>数据管理</Link>,
      //   "path": "/dashboard/api/testdata/import"
      // },
    ]
  },
  
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