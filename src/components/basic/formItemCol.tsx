

import React from 'react';
import { Form, Col, ColProps } from 'antd';

interface FormItemColProps {
  label: string;
  name?: string;
  children: React.ReactNode;
  rules?: any[];
  span?: number;
  labelCol: ColProps;
  wrapperCol: ColProps;
  style?: React.CSSProperties;
}

const FormItemCol: React.FC<FormItemColProps> = ({ label, name,style, children, rules, span = 24, labelCol, wrapperCol }) => {
  return (
    <Col span={span} style={style}>
      <Form.Item
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
