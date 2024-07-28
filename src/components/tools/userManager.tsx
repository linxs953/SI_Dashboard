
import { Layout, Radio, Space, Tabs } from 'antd';
import PhoneCodeCmp from "./user/phoneCode"


const tabConfig:any = {
    "获取手机验证码": {
      "key": "phone_code",
      "label": "获取验证码",
      "cmp": <PhoneCodeCmp />
    },
    "用户注销": {
      "key": "delete_user",
      "label": "用户注销",
      "cmp": null
    },
    "创建用户": {
      "key": "create_user",
      "label": "用户注册",
      "cmp": null
    },
}

const items = []
Object.keys(tabConfig).map(k => {
  const tab = tabConfig[k]
  items.push({
    label: tab["label"],
    key: tab["key"],
    children: tab["cmp"]
  })
})

const UserManagerCmp: React.FC = () => {
    return (
      <>
        <Tabs
          tabPosition={'top'}
          style={{marginLeft: '50px'}}
          items={items}
        />
      </>
    );
  };
  


export default function UserManager() {
    return (
        <Layout>
            <UserManagerCmp />
        </Layout>
    )
}