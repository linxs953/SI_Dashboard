import React, { useEffect, useState } from 'react';
import { Button, Input, Space, Dropdown, MenuProps } from 'antd';
import { useFetchPhoneCode } from 'src/hooks/tool/user';
import { DownOutlined } from '@ant-design/icons';
import modal from 'antd/es/modal';

const verify = (value:any) => {
    const phoeneRegex = new RegExp(/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/)
    const phone:string =  value
    if (phone == "") {
        return true
    }
    return phoeneRegex.test(phone)
}





const items: MenuProps['items'] = [
    {
      label: '登录',
      key: '1',
    },
    {
      label: '修改交易密码',
      key: '2',
    },
    {
      label: '忘记密码',
      key: '3',
    },
    {
      label: '绑定手机号',
      key: '4',
    },
    {
        label: '绑定账号',
        key: '5',
    },
    {
        label: '用户注销',
        key: '6',
    },
]; 

const initialReqParams = {}
const PhoneCodeCmp: React.FC = () => {
    const [inputStatus, setInputStatus] = useState('' as 'error' | 'warning' | '');     // 输入框状态
    const [inputValue, setInputValue] = useState('')  // 输入框值
    const [codeType, setCodeType] = useState({"text":"登录", "type": "1"})  // 验证码类型
    const [reqParams, setReqParams] = useState(initialReqParams)  // 请求参数

    const [data,err,setApiParam] = useFetchPhoneCode()  // 请求数据

    const onInputChange = (value: any) => {
        setInputValue(value.target.value)
        setInputStatus('')
        if (!verify(value.target.value)) {
            setInputStatus("error")
        }
    }
    
    const onBtnClick = () => {
        if (!inputValue) {
            setInputStatus("error")
        }
        if (!verify(inputValue)) {
            setInputStatus("error")
            return
        }
        if (setApiParam) {
            setApiParam({
                apiKey: "getSms",
                data: {
                    Params: [
                        {
                           "type": "query",
                           "value": {
                                "phone": inputValue,
                                "type": codeType.type
                           } 
                        }
                    ],
                    Domain: "demopsu.86yfw.com"
                },
                isAlready: true
            })
        }
    }

    const onClickOption: MenuProps['onClick'] = (e) => {
        setCodeType({
            text: e.domEvent.currentTarget.innerText,
            type: e.key
        })
    };

    
    const menuProps = {
        items,
        onClick: onClickOption,
    };

    useEffect(() => {
        if (setApiParam) {
            setApiParam(reqParams)
        }
    }, [reqParams])
    
    useEffect(() => {
        if (err || (data && data.code > 0)) {
            modal.error({
                title: "获取失败",
                content: (
                    <div>验证码获取失败</div>
                )
            })
        }
    },[err,data])
    
    return (
        <>
          <Space>
                <div>验证码类型: </div>
                <Dropdown menu={menuProps}>
                  <Button>
                      <Space>
                            {codeType.text}
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
                <div style={{marginLeft: 10}}>手机号: </div> 
              <Input
                    maxLength={11}
                    onChange={onInputChange}
                    status={inputStatus}
                />
              <Button
                    type="primary"
                    onClick={onBtnClick}
                >
                获取
                </Button>
            </Space>
            <div style={{marginTop: 0,marginLeft: 240}}>
                    {inputStatus == 'error' && 
                        <div>
                            <p style={{color: '#ff4d4f'}}>请输入正确手机号</p>
                        </div>
                    }
            </div>
        </>
    );
};


export default PhoneCodeCmp;
