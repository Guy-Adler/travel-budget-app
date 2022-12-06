import React from 'react';
import { Layout, LayoutProps } from 'react-admin';
import AppBar from './AppBar';
import Menu from './Menu';

const CustomLayout: React.FC<LayoutProps> = (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Layout {...props} appBar={AppBar} menu={Menu} />
);

export default CustomLayout;
