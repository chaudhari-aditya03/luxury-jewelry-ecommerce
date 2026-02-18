import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, Card, Alert, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const authData = await login(values.email, values.password);
      message.success('Login successful!');
      const userRole = authData?.user?.role;
      if (userRole === 'ADMIN' || userRole === 'admin' || isAdmin) {
        navigate('/admin');
      } else {
        navigate('/shop');
      }
    } catch (error) {
      message.error('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
        <Card
          style={{ width: '100%', maxWidth: 450, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
          styles={{ body: { padding: 40 } }}
        >
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #D4AF37 0%, #b8860b 100%)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', margin: '0 auto 16px', fontSize: 24 }}>
              💎
            </div>
            <Title level={2}>Welcome Back</Title>
            <Text type="secondary">Sign in to your luxury account</Text>
          </div>

          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your Email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email Address" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" style={{ color: '#D4AF37' }}>
                Forgot password?
              </Link>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading} style={{ height: 45 }}>
                Log in
              </Button>
            </Form.Item>

            <Divider plain>Or login with</Divider>

            <Button block icon={<GoogleOutlined />} style={{ marginBottom: 24 }}>
              Google
            </Button>

            <div style={{ textAlign: 'center' }}>
              <Text>Don't have an account? <Link to="/register" style={{ color: '#D4AF37', fontWeight: 600 }}>Sign up now</Link></Text>
            </div>
          </Form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
