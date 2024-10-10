

import React from 'react';
import { Select } from 'antd';

interface OptionProps {
  data: Array<{ value: string | number; label: string }>;
  style?: React.CSSProperties;
  value?: string | number;
  onChange?: (value: string | number) => void;
}


const Options: React.FC<OptionProps> = ({ data, style, value, onChange }) => {
  console.log(data)
  return (
    <Select style={style} value={value} onChange={onChange}>
      {data.map((item) => (
        <Select.Option key={item.value} value={item.value}>
          {item.label}
        </Select.Option>
      ))}
    </Select>
  );
};

export default Options;
