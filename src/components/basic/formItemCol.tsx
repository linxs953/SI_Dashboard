

import React from 'react';
import { Form, Col, ColProps } from 'antd';

interface FormItemColProps {
  label: string;
  name?: string;
  children: React.ReactNode;
  rules?: any[];
  span?: number;
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  offset?: number;
  style?: React.CSSProperties;
  colKey?: number;
  valuePropName?: string;
}

const FormItemCol: React.FC<FormItemColProps> = ({ colKey,valuePropName, offset,label, name,style, children, rules, span = 24, labelCol, wrapperCol,...props }) => {
  return (
    <Col span={span} key={colKey} offset={offset} style={style}>
      <Form.Item
        {...props}
        name={name}
        label={label}
        valuePropName={valuePropName}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
      >
        {children}
      </Form.Item>
    </Col>
  );
};

export default FormItemCol;
