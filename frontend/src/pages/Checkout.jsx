import React, { useState } from 'react';
import {
  Steps, Form, Input, Button, Radio, Row, Col, Card,
  Typography, message, Result, Divider, Space
} from 'antd';
import {
  UserOutlined, EnvironmentOutlined, CreditCardOutlined,
  CheckCircleOutlined, ShopOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { formatPrice } from '../utils/helpers';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const CheckoutPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const onFinish = (values) => {
    setLoading(true);
    console.log('Order Details:', values);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setOrderId('ORD-2026-' + Math.floor(Math.random() * 10000));
      setCurrentStep(2);
    }, 1500);
  };

  const next = () => {
    form.validateFields().then(() => {
      setCurrentStep(currentStep + 1);
    }).catch(err => {
      message.error('Please fill in all required fields');
    });
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const steps = [
    {
      title: 'Shipping Details',
      icon: <EnvironmentOutlined />,
      content: (
        <div style={{ marginTop: 40 }}>
          <Title level={4}>Shipping Address</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="firstName" rules={[{ required: true, message: 'First name required' }]}>
                <Input prefix={<UserOutlined />} placeholder="First Name" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="lastName" rules={[{ required: true, message: 'Last name required' }]}>
                <Input prefix={<UserOutlined />} placeholder="Last Name" size="large" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Valid email required' }]}>
            <Input placeholder="Email Address" size="large" />
          </Form.Item>
          <Form.Item name="phone" rules={[{ required: true, message: 'Phone number required' }]}>
            <Input placeholder="Phone Number" size="large" />
          </Form.Item>
          <Form.Item name="address" rules={[{ required: true, message: 'Address required' }]}>
            <Input.TextArea placeholder="Street Address" rows={3} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="city" rules={[{ required: true, message: 'City required' }]}>
                <Input placeholder="City" size="large" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="state" rules={[{ required: true, message: 'State required' }]}>
                <Input placeholder="State" size="large" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="pincode" rules={[{ required: true, message: 'Pincode required' }]}>
                <Input placeholder="Pincode" size="large" />
              </Form.Item>
            </Col>
          </Row>
        </div>
      )
    },
    {
      title: 'Payment',
      icon: <CreditCardOutlined />,
      content: (
        <div style={{ marginTop: 40 }}>
          <Title level={4}>Select Payment Method</Title>
          <Form.Item name="paymentMethod" initialValue="upi">
            <Radio.Group style={{ width: '100%' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Radio.Button value="upi" style={{ height: 60, display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Space size="large">
                    <CreditCardOutlined />
                    <span>UPI / Net Banking</span>
                  </Space>
                </Radio.Button>
                <Radio.Button value="card" style={{ height: 60, display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Space size="large">
                    <CreditCardOutlined />
                    <span>Credit / Debit Card</span>
                  </Space>
                </Radio.Button>
                <Radio.Button value="cod" style={{ height: 60, display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Space size="large">
                    <ShopOutlined />
                    <span>Cash on Delivery</span>
                  </Space>
                </Radio.Button>
              </Space>
            </Radio.Group>
          </Form.Item>
        </div>
      )
    },
    {
      title: 'Done',
      icon: <CheckCircleOutlined />,
      content: null // Handled separately
    }
  ];

  if (currentStep === 2) {
    return (
      <MainLayout>
        <div style={{ padding: '60px 0' }}>
          <Result
            status="success"
            title="Order Successfully Placed!"
            subTitle={`Order number: ${orderId}. We have sent the confirmation to your email.`}
            extra={[
              <Link to="/shop" key="shop">
                <Button type="primary" key="console">
                  Continue Shopping
                </Button>
              </Link>,
              <Button key="buy" onClick={() => navigate('/account/orders')}>View Orders</Button>,
            ]}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div style={{ padding: '40px 0', maxWidth: 1000, margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 40, fontFamily: "'Playfair Display', serif" }}>Checkout</Title>

        <Steps current={currentStep} items={steps.map(s => ({ title: s.title, icon: s.icon }))} />

        <Row gutter={[40, 40]} style={{ marginTop: 40 }}>
          <Col xs={24} lg={16}>
            <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <Form form={form} layout="vertical" onFinish={onFinish}>
                {steps[currentStep].content}
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Order Summary" variant="borderless" style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Items (3)</Text>
                  <Text strong>{formatPrice(70000)}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Shipping</Text>
                  <Text type="success">Free</Text>
                </div>
                <Divider style={{ margin: '10px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Title level={4}>Total</Title>
                  <Title level={4} style={{ color: '#D4AF37' }}>{formatPrice(70000)}</Title>
                </div>

                <div style={{ marginTop: 20 }}>
                  {currentStep < 1 && (
                    <Button type="primary" block size="large" onClick={next}>
                      Proceed to Payment
                    </Button>
                  )}
                  {currentStep === 1 && (
                    <Space style={{ width: '100%' }}>
                      <Button size="large" onClick={prev} style={{ width: '100px' }}>
                        Back
                      </Button>
                      <Button type="primary" block size="large" loading={loading} onClick={() => form.submit()}>
                        Place Order
                      </Button>
                    </Space>
                  )}
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
