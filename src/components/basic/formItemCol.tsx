

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
}

const FormItemCol: React.FC<FormItemColProps> = ({ offset,label, name,style, children, rules, span = 24, labelCol, wrapperCol }) => {
  return (
    <Col span={span} offset={offset} style={style}>
      <Form.Item
        name={name}
        label={label}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
      >
        {children}
      </Form.Item>
    </Col>
  );
};

export default FormItemCol;
