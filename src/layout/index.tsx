import React from 'react';
import { Layout, LayoutProps } from 'react-admin';

const CustomLayout: React.FC<LayoutProps> = (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Layout {...props} />
);

export default CustomLayout;
