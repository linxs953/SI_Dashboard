

import React from 'react';
import { Form, FormItemProps } from 'antd';

interface CustomFormItemProps extends FormItemProps {
  children: React.ReactNode;
}

const FormItemWithoutCol: React.FC<CustomFormItemProps> = ({ children, ...props }) => {
  return (
    <Form.Item {...props}>
      {children}
    </Form.Item>
  );
};

export default FormItemWithoutCol;
