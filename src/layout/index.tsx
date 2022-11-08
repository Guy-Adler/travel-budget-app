import React from 'react';
import { Layout, LayoutProps } from 'react-admin';
import AppBar from './AppBar';

const CustomLayout: React.FC<LayoutProps> = (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Layout {...props} appBar={AppBar} />
);

export default CustomLayout;
