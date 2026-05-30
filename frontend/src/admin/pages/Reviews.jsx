import React from 'react';
import { Typography, Card } from 'antd';
import AdminLayout from '../../layouts/AdminLayout';

const { Title, Paragraph } = Typography;

const AdminReviews = () => {
  return (
    <AdminLayout>
      <Title level={2} style={{ marginBottom: 24, fontFamily: "'Playfair Display', serif" }}>Reviews</Title>
      <Card bordered={false} style={{ borderRadius: 20, boxShadow: '0 8px 30px rgba(17,17,17,0.04)' }}>
        <Typography>
          <Title level={4}>Review management</Title>
          <Paragraph>
            This module is reserved for a future moderation workflow. The admin sidebar now includes the
            Reviews section so the Luxury Maison navigation matches the target production structure.
          </Paragraph>
        </Typography>
      </Card>
    </AdminLayout>
  );
};

export default AdminReviews;
