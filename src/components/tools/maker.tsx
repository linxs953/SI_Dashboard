
import React, { useState } from 'react';
import type { RadioChangeEvent } from 'antd';
import { Layout, Radio, Space, Tabs } from 'antd';
import UserManager from './userManager';

const MakerCmp: React.FC = () => {
  return (
    <>
      <Tabs
        tabPosition={'top'}
        style={{marginLeft: '50px'}}
        items={new Array(3).fill(null).map((_, i) => {
          const id = String(i + 1);
          return {
            label: `Tab ${id}`,
            key: id,
            children: null
          };
        })}
      />
    </>
  );
};


export default function Maker() {
    return (
        <Layout>
            <MakerCmp />
        </Layout>
    )
}