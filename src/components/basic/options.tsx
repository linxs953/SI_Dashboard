

import React from 'react';
import { Select } from 'antd';

interface OptionProps {
  data: Array<{ value: string | number; label: string }>;
  style?: React.CSSProperties;
  value?: string | number;
  placeholder?: string;
  onChange?: (value: string | number) => void;
}


const Options: React.FC<OptionProps> = ({ data, style, value, onChange, placeholder }) => {
  return (
    <Select style={style} value={value} onChange={onChange} placeholder={placeholder}>
      {data.map((item) => (
        <Select.Option key={item.value} value={item.value}>
          {item.label}
        </Select.Option>
      ))}
    </Select>
  );
};

export default Options;
