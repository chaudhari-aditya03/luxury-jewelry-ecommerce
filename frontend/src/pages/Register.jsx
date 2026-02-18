import React, { useState } from 'react';
import { Form, Input, Button, Typography, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await registerUser(values);
      message.success('Account created successfully!');
      navigate('/shop');
    } catch (error) {
      message.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', padding: '40px 0' }}>
        <Card
          style={{ width: '100%', maxWidth: 500, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
          styles={{ body: { padding: 40 } }}
        >
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <Title level={2}>Create Account</Title>
            <Text type="secondary">Join our exclusive community</Text>
          </div>

          <Form
            name="register"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="firstName"
              rules={[{ required: true, message: 'Please input your First Name!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="First Name" />
            </Form.Item>

            <Form.Item
              name="lastName"
              rules={[{ required: true, message: 'Please input your Last Name!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Last Name" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your Email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email Address" />
            </Form.Item>

            <Form.Item
              name="phone"
              rules={[{ required: true, message: 'Please input your Phone Number!' }]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your Password!' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
              hasFeedback
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>

            <Form.Item
              name="confirm"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading} style={{ height: 45 }}>
                Create Account
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <Text>Already have an account? <Link to="/login" style={{ color: '#D4AF37', fontWeight: 600 }}>Log in</Link></Text>
            </div>
          </Form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default RegisterPage;
