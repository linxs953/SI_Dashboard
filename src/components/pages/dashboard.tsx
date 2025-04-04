import React, { useState } from 'react';
import {
  SettingOutlined,
  FileSearchOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

interface MenuNode {
  icon: React.ReactNode;
  label: React.ReactNode;
  key: string;
  children: MenuChild[];
}

interface MenuChild {
  key: string;
  icon: React.ReactNode;
  label: React.ReactNode;
  path?: string;
}

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const MenuItemKeyMap: Record<string, MenuNode> = {
  "configuration": {
    icon: <SettingOutlined />,
    label: "任务配置",
    key: "configuration",
    children: [
      {
        key: "image-build",
        icon: <SettingOutlined />,
        label: <Link to={'/dashboard/api/image-build'}>镜像构建</Link>,
        path: "/dashboard/api/image-build"
      },
      {
        key: "sync-config",
        icon: <SettingOutlined />,
        label: <Link to={'/dashboard/sync/config'}>同步器</Link>,
        path: "/dashboard/sync/config"
      },
      {
        key: "api-automation-config",
        icon: <FileSearchOutlined />,
        label: <Link to={'/dashboard/api/automation'}>API自动化</Link>,
        path: "/dashboard/api/automation"
      }
    ]
  },
  "data": {
    icon: <SettingOutlined />,
    label: "数据管理",
    key: "data",
    children: [
      {
        key: "API-data",
        icon: <SettingOutlined />,
        label: <Link to={'/dashboard/api/apidata'}>API数据</Link>,
        path: "/dashboard/api/apidata"
      },
      {
        key: "api-automation-runrecord",
        icon: <SettingOutlined />,
        label: "执行记录",
        path: "/dashboard/api/runrecord"
      },
      {
        key: "sync-record",
        icon: <FileSearchOutlined />,
        label: "同步记录",
        path: "/dashboard/sync/record"
      },
      {
        key: "api-automation-testdata",
        icon: <FileSearchOutlined />,
        label: "测试数据",
        path: "/dashboard/api/testdata"
      }
    ]
  }
};

const routeKeyMap: Record<string, string> = {};

const items: MenuItem[] = [];
Object.keys(MenuItemKeyMap).forEach(key => {
  const menuNode = MenuItemKeyMap[key];
  const children: MenuItem[] = [];
  
  if (menuNode.children.length > 0) {
    menuNode.children.forEach(node => {
      children.push(getItem(node.label, node.key, node.icon));
      if (node.path) {
        routeKeyMap[node.path] = node.key;
      }
    });
  }
  
  items.push(getItem(menuNode.label, menuNode.key, menuNode.icon, children));
});

const getSelectedKeys = (path: string) => {
  return routeKeyMap[path] ? [routeKeyMap[path]] : [];
};

const getDefaultOpenKeys = () => {
  return Object.keys(MenuItemKeyMap).filter(key => 
    MenuItemKeyMap[key].children.length > 0
  );
};

const Dashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState(() => 
    getSelectedKeys(location.pathname)
  );

  // const {
  //   token: {},
  // } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div>
          <img
            src={`../../../../logo.png`}
            alt="Logo"
            className="demo-logo-vertical"
            style={{ height: '100px', width: "200px", cursor: 'pointer' }}
            onClick={() => {
              window.location.href = "/dashboard";
            }}
          />
        </div>
        <Menu 
          openKeys={getDefaultOpenKeys()}
          selectedKeys={selectedKeys}
          onSelect={({ selectedKeys }) => setSelectedKeys(selectedKeys)}
          theme="dark" 
          mode="inline"  
          items={items} 
        />
      </Sider>
      <Outlet />
    </Layout>
  );
};

export default Dashboard;