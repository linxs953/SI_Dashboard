import React from 'react';
import { Row, Col, Form, Select, Input, Button } from 'antd';
import { FormListFieldData } from 'antd/es/form';
import Options from 'src/components/basic/options';

const { Option } = Select;

interface DependFormProps {
  fields: FormListFieldData[];
  add: () => void;
  remove: (index: number) => void;
  form: any;
  dependSelectTab: string;
}


const dependTypeOptions = [
  { value: 'scene', label: '场景' },
  { value: 'basic', label: '基础数据' },
  { value: 'custom', label: '自定义数据' },
  { value: 'event', label: '基于事件生成' },
]


const DependForm: React.FC<DependFormProps> = ({ fields, add, remove, form, dependSelectTab }) => {

  const handleDsTypeChange = (value: string | number, name: number) => {
    const currentField = form.getFieldValue([dependSelectTab, name]);
    const updatedField = {
      ...currentField,
      dsType: value
    };
    
    // 清除其他类型特有的字段
    delete updatedField.relateStep;
    delete updatedField.cacheKey;
    delete updatedField.customValue;
    delete updatedField.eventKey;
    
    // 只更新当前记录
    form.setFieldsValue({
      [dependSelectTab]: {
        [name]: updatedField
      }
    });
  }

  const getFormInputItem = (restField: any,name: number,key:string,label:string) => {
    return (
      <Form.Item
        {...restField}
        name={[name, key]}
        label={label}
      >
        <Input />
      </Form.Item>
    )
  }

  const renderFormItem = (restField: any,name: number) => {
    const dsType = form.getFieldValue([dependSelectTab, name, 'dsType']);
    switch (dsType) {
      case 'scene':
        return getFormInputItem(restField,name,'relateaction','场景索引');

      case 'basic':
        return getFormInputItem(restField,name,'cacheKey','缓存键');

      case 'custom':
        return getFormInputItem(restField,name,'customValue','自定义值');

      case 'event':
        return getFormInputItem(restField,name,'eventKey','事件键');

      default:
        return null;
    }
  }
  return (
    <>
      {fields.map(({ key, name, ...restField }) => (
        <Row key={key} gutter={20}>
          <Col span={6}>
            <Form.Item
              {...restField}
              name={[name, 'dsType']}
              label="数据源类型"
            >
              <Options data={dependTypeOptions} value={form.getFieldValue([dependSelectTab, name, 'dsType'])} onChange={(value) => handleDsTypeChange(value,name)} />
            </Form.Item>
          </Col>
          <Col span={8}>
            {renderFormItem(restField,name)}
          </Col>
          <Col span={8}>
            {getFormInputItem(restField,name,'targetField','目标字段')}
          </Col>
          <Col span={2}>
            <Button onClick={() => remove(name)} type="link" danger>
              删除
            </Button>
          </Col>
        </Row>
      ))}
      <Form.Item>
        <Button type="dashed" onClick={() => {
          add()
          form.setFieldsValue({
            [dependSelectTab]: {
              [fields.length]: {
                dsType: 'scene',
                dependType: dependSelectTab
              }
            }
          })
        }} block>
          添加数据
        </Button>
      </Form.Item>
    </>
  );
};

export default DependForm;



{/* <Form.Item
{...restField}
name={[name, 'targetField']}
label="目标字段"
>
<Input />
</Form.Item> */}



{/* <Select 
value={form.getFieldValue([dependSelectTab, name, 'dsType'])}
onChange={(value) => {
const currentField = form.getFieldValue([dependSelectTab, name]);
const updatedField = {
...currentField,
dsType: value
};

// 清除其他类型特有的字段
delete updatedField.relateStep;
delete updatedField.cacheKey;
delete updatedField.customValue;
delete updatedField.eventKey;

// 只更新当前记录
form.setFieldsValue({
[dependSelectTab]: {
    [name]: updatedField
}
});
}}
>
<Option value="scene">场景</Option>
<Option value="basic">基础数据</Option>
<Option value="custom">自定义数据</Option>
<Option value="event">基于事件生成</Option>
</Select> */}

// return (
//   <Form.Item
//     {...restField}
//     name={[name, 'eventKey']}
//     label="事件键"
//   >
//     <Input />
//   </Form.Item>
// );

//   <Form.Item
//     {...restField}
//     name={[name, 'customValue']}
//     label="自定义值"
//   >
//     <Input />
//   </Form.Item>
// );


//   <Form.Item
//     {...restField}
//     name={[name, 'cacheKey']}
//     label="缓存键"
//   >
//     <Input />
//   </Form.Item>
// );

//   <Form.Item
//     {...restField}
//     name={[name, 'relateaction']}
//     label="场景索引"
//   >
//     <Input />
//   </Form.Item>
// );


// {(() => {
//     const dsType = form.getFieldValue([dependSelectTab, name, 'dsType']);
//     switch (dsType) {
//       case 'scene':
//         return (
//           <Form.Item
//             {...restField}
//             name={[name, 'relateaction']}
//             label="场景索引"
//           >
//             <Input />
//           </Form.Item>
//         );
//       case 'basic':
//         return (
//           <Form.Item
//             {...restField}
//             name={[name, 'cacheKey']}
//             label="缓存键"
//           >
//             <Input />
//           </Form.Item>
//         );
//       case 'custom':
//         return (
//           <Form.Item
//             {...restField}
//             name={[name, 'customValue']}
//             label="自定义值"
//           >
//             <Input />
//           </Form.Item>
//         );
//       case 'event':
//         return (
//           <Form.Item
//             {...restField}
//             name={[name, 'eventKey']}
//             label="事件键"
//           >
//             <Input />
//           </Form.Item>
//         );
//       default:
//         return null;
//     }
//   })()}