import React from 'react';
import { Layout, LayoutProps } from 'react-admin';

const CustomLayout: React.FC<LayoutProps> = (props) => {
  return (
    <>
      <Layout {...props} />
    </>
  );
};

export default CustomLayout;
