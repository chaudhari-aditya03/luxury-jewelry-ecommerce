import React from 'react';
import { Layout } from 'antd';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const { Content } = Layout;

const MainLayout = ({ children }) => {
  return (
    <Layout className="min-h-screen">
      <Navbar />
      <Content
        className="site-layout"
        style={{
          marginTop: 64,
          padding: '24px',
          minHeight: 'calc(100vh - 64px - 300px)', // Approx adjustment
          background: '#f5f5f5' // Light gray background for content area
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          {children}
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default MainLayout;
