import React, { useEffect, useMemo, useState } from 'react';
import {
  Steps, Form, Input, Button, Radio, Row, Col, Card,
  Typography, message, Result, Divider, Space, Empty, Modal, Spin
} from 'antd';
import {
  UserOutlined, EnvironmentOutlined, CreditCardOutlined,
  CheckCircleOutlined, ShopOutlined, QrcodeOutlined, CopyOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { formatPrice } from '../utils/helpers';
import { orderService, userService, cartService } from '../services';

const { Title, Text, Paragraph } = Typography;

const CheckoutPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentForm] = Form.useForm();
  const [addressForm] = Form.useForm();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [confirmingUpi, setConfirmingUpi] = useState(false);
  const [cart, setCart] = useState({ items: [], totalPrice: 0, totalItems: 0 });
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [placedOrder, setPlacedOrder] = useState(null);
  const [paymentSession, setPaymentSession] = useState(null);
  const [upiReference, setUpiReference] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);

  const subtotal = useMemo(() => Number(cart.totalPrice ?? 0), [cart.totalPrice]);
  const tax = subtotal * 0.18;
  const displayTotal = subtotal + tax;

  const fetchCheckoutData = async () => {
    setIsLoadingData(true);
    try {
      const [cartResponse, addressesResponse] = await Promise.all([
        cartService.getCart(),
        userService.getAddresses(),
      ]);

      const cartData = cartResponse.data?.data || { items: [], totalPrice: 0, totalItems: 0 };
      const addressData = addressesResponse.data?.data || [];

      setCart(cartData);
      setAddresses(addressData);

      const defaultAddress = addressData.find((addr) => addr.isDefault) || addressData[0];
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to load checkout data');
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchCheckoutData();
  }, []);

  const handlePlaceOrder = async (values) => {
    if (!selectedAddressId) {
      message.error('Please select an address');
      return;
    }

    const selectedMethod = values.paymentMethod === 'cod' ? 'COD' : 'UPI';
    setPaymentMethod(selectedMethod);
    setLoading(true);

    try {
      const orderResponse = await orderService.placeOrder({
        addressId: selectedAddressId,
        paymentMethod: selectedMethod,
      });

      const orderData = orderResponse.data?.data;
      setPlacedOrder(orderData);

      const paymentResponse = await orderService.createPayment(
        orderData?.id,
        orderData?.finalAmount ?? orderData?.totalAmount ?? 0
      );

      const paymentData = paymentResponse.data?.data;
      setPaymentSession(paymentData);

      if (selectedMethod === 'COD') {
        setOrderComplete(true);
      } else {
        setCurrentStep(2);
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmUpiPayment = async () => {
    if (!placedOrder?.id) {
      message.error('Order not found for payment confirmation');
      return;
    }

    if (!upiReference.trim()) {
      message.error('Please enter the UPI reference number');
      return;
    }

    setConfirmingUpi(true);
    try {
      await orderService.confirmUpiPayment(placedOrder.id, upiReference.trim());
      message.success('UPI payment confirmed successfully');
      setOrderComplete(true);
      setCurrentStep(3);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to confirm UPI payment');
    } finally {
      setConfirmingUpi(false);
    }
  };

  const copyToClipboard = async (value, label) => {
    try {
      await navigator.clipboard.writeText(value);
      message.success(`${label} copied`);
    } catch {
      message.error(`Failed to copy ${label.toLowerCase()}`);
    }
  };

  const next = () => {
    if (!selectedAddressId) {
      message.error('Please select an address to continue');
      return;
    }
    setCurrentStep(1);
  };

  const prev = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const steps = [
    { title: 'Shipping', icon: <EnvironmentOutlined /> },
    { title: 'Payment Method', icon: <CreditCardOutlined /> },
    { title: 'UPI Payment', icon: <QrcodeOutlined /> },
    { title: 'Done', icon: <CheckCircleOutlined /> },
  ];

  if (orderComplete) {
    return (
      <MainLayout>
        <div style={{ padding: '60px 0' }}>
          <Result
            status="success"
            title={paymentMethod === 'COD' ? 'Order Placed with Cash on Delivery' : 'UPI Payment Completed Successfully'}
            subTitle={
              paymentMethod === 'COD'
                ? `Order number: ${placedOrder?.orderNumber}. Please keep cash or a ready UPI app at delivery time.`
                : `Order number: ${placedOrder?.orderNumber}. Your payment reference ${upiReference || paymentSession?.paymentReference || ''} has been recorded.`
            }
            extra={[
              <Link to="/shop" key="shop">
                <Button type="primary">Continue Shopping</Button>
              </Link>,
              <Button key="orders" onClick={() => navigate('/account/orders')}>View Orders</Button>,
            ]}
          />
        </div>
      </MainLayout>
    );
  }

  if (isLoadingData) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: 120 }}>
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  if ((cart.items || []).length === 0) {
    return (
      <MainLayout>
        <div style={{ padding: '60px 0', textAlign: 'center' }}>
          <Empty description="Your cart is empty" />
          <Link to="/shop">
            <Button type="primary" style={{ marginTop: 16 }}>Continue Shopping</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div style={{ padding: '40px 0', maxWidth: 1080, margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 40, fontFamily: "'Playfair Display', serif" }}>
          Checkout
        </Title>

        <Steps current={currentStep} items={steps.map((step) => ({ title: step.title, icon: step.icon }))} />

        <Row gutter={[40, 40]} style={{ marginTop: 40 }}>
          <Col xs={24} lg={16}>
            <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              {currentStep === 0 && (
                <div style={{ marginTop: 16 }}>
                  <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Title level={4} style={{ margin: 0 }}>Shipping Address</Title>
                      <Button onClick={() => setIsAddressModalOpen(true)}>Add New Address</Button>
                    </div>

                    {addresses.length === 0 ? (
                      <Empty description="No address found. Add one to continue." />
                    ) : (
                      <Radio.Group
                        style={{ width: '100%' }}
                        value={selectedAddressId}
                        onChange={(e) => setSelectedAddressId(e.target.value)}
                      >
                        <Space direction="vertical" style={{ width: '100%' }}>
                          {addresses.map((address) => (
                            <Card key={address.id} size="small" style={{ width: '100%' }}>
                              <Radio value={address.id}>
                                <Text strong>{address.fullName}</Text>
                                <div>{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}</div>
                                <div>{address.city}, {address.state} - {address.postalCode}</div>
                                <div>{address.phone}</div>
                              </Radio>
                            </Card>
                          ))}
                        </Space>
                      </Radio.Group>
                    )}
                  </Space>
                </div>
              )}

              {currentStep === 1 && (
                <Form
                  form={paymentForm}
                  layout="vertical"
                  initialValues={{ paymentMethod: paymentMethod === 'COD' ? 'cod' : 'upi' }}
                  onFinish={handlePlaceOrder}
                >
                  <div style={{ marginTop: 16 }}>
                    <Title level={4}>Select Payment Method</Title>
                    <Paragraph type="secondary">
                      Choose `UPI` to scan your personal QR and confirm the payment, or `Cash on Delivery` to pay at delivery.
                    </Paragraph>
                    <Form.Item name="paymentMethod">
                      <Radio.Group style={{ width: '100%' }} onChange={(e) => setPaymentMethod(e.target.value === 'cod' ? 'COD' : 'UPI')}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Radio.Button value="upi" style={{ height: 72, display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Space size="large">
                              <QrcodeOutlined />
                              <div>
                                <div>UPI QR Payment</div>
                                <Text type="secondary">Scan QR, pay from your UPI app, and enter the UPI reference</Text>
                              </div>
                            </Space>
                          </Radio.Button>
                          <Radio.Button value="cod" style={{ height: 72, display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Space size="large">
                              <ShopOutlined />
                              <div>
                                <div>Cash on Delivery</div>
                                <Text type="secondary">Pay at the time of delivery</Text>
                              </div>
                            </Space>
                          </Radio.Button>
                        </Space>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                </Form>
              )}

              {currentStep === 2 && paymentSession && placedOrder && (
                <div style={{ marginTop: 12 }}>
                  <Title level={4}>Pay with UPI</Title>
                  <Paragraph type="secondary">
                    Scan the QR with any UPI app, complete the payment, then enter the UPI reference number below.
                  </Paragraph>

                  <Row gutter={[24, 24]} align="middle">
                    <Col xs={24} md={10}>
                      <div style={{ border: '1px solid #f0f0f0', borderRadius: 16, padding: 16, textAlign: 'center' }}>
                        <img
                          src={paymentSession.qrCodeUrl}
                          alt="UPI QR"
                          style={{ width: '100%', maxWidth: 240, margin: '0 auto' }}
                        />
                        <div style={{ marginTop: 12 }}>
                          <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(paymentSession.upiUrl, 'UPI link')}>
                            Copy UPI Link
                          </Button>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} md={14}>
                      <Card size="small" style={{ borderRadius: 12 }}>
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text type="secondary">Order Number</Text>
                            <Text strong>{placedOrder.orderNumber}</Text>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text type="secondary">UPI ID</Text>
                            <Space>
                              <Text strong>{paymentSession.upiId}</Text>
                              <Button type="link" size="small" onClick={() => copyToClipboard(paymentSession.upiId, 'UPI ID')}>Copy</Button>
                            </Space>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text type="secondary">Payee Name</Text>
                            <Text strong>{paymentSession.payeeName}</Text>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text type="secondary">Amount</Text>
                            <Text strong style={{ color: '#D4AF37' }}>{formatPrice(paymentSession.amount)}</Text>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text type="secondary">Merchant Reference</Text>
                            <Space>
                              <Text strong>{paymentSession.transactionId}</Text>
                              <Button type="link" size="small" onClick={() => copyToClipboard(paymentSession.transactionId, 'merchant reference')}>Copy</Button>
                            </Space>
                          </div>

                          <a href={paymentSession.upiUrl} target="_blank" rel="noreferrer">
                            <Button type="primary" block size="large">Open UPI App</Button>
                          </a>

                          <Input
                            size="large"
                            placeholder="Enter UPI reference / UTR number"
                            value={upiReference}
                            onChange={(e) => setUpiReference(e.target.value)}
                          />

                          <Button
                            block
                            size="large"
                            type="primary"
                            loading={confirmingUpi}
                            onClick={handleConfirmUpiPayment}
                          >
                            Confirm Payment
                          </Button>

                          <Text type="secondary">{paymentSession.instructions}</Text>
                        </Space>
                      </Card>
                    </Col>
                  </Row>
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Order Summary" variant="borderless" style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Items ({cart.totalItems || cart.items.length})</Text>
                  <Text strong>{formatPrice(subtotal)}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Tax (18% GST)</Text>
                  <Text strong>{formatPrice(tax)}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Shipping</Text>
                  <Text type="success">Free</Text>
                </div>
                <Divider style={{ margin: '10px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Title level={4}>Estimated Total</Title>
                  <Title level={4} style={{ color: '#D4AF37' }}>{formatPrice(displayTotal)}</Title>
                </div>

                <div style={{ marginTop: 20 }}>
                  {currentStep === 0 && (
                    <Button type="primary" block size="large" onClick={next}>
                      Proceed to Payment
                    </Button>
                  )}
                  {currentStep === 1 && (
                    <Space style={{ width: '100%' }}>
                      <Button size="large" onClick={prev} style={{ width: 100 }}>
                        Back
                      </Button>
                      <Button type="primary" block size="large" loading={loading} onClick={() => paymentForm.submit()}>
                        {paymentMethod === 'COD' ? 'Place COD Order' : 'Generate UPI QR'}
                      </Button>
                    </Space>
                  )}
                  {currentStep === 2 && (
                    <Button block size="large" onClick={() => setCurrentStep(1)}>
                      Change Payment Method
                    </Button>
                  )}
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        <Modal
          title="Add Address"
          open={isAddressModalOpen}
          onCancel={() => setIsAddressModalOpen(false)}
          onOk={async () => {
            try {
              const values = await addressForm.validateFields();
              const response = await userService.addAddress(values);
              const createdAddress = response.data?.data;
              setAddresses((prev) => [...prev, createdAddress]);
              setSelectedAddressId(createdAddress?.id);
              setIsAddressModalOpen(false);
              message.success('Address added');
              addressForm.resetFields();
            } catch (error) {
              if (error?.response) {
                message.error(error.response?.data?.message || 'Failed to add address');
              }
            }
          }}
        >
          <Form form={addressForm} layout="vertical" initialValues={{ country: 'India' }}>
            <Form.Item name="fullName" label="Full Name" rules={[{ required: true, message: 'Full name required' }]}>
              <Input prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item name="phone" label="Phone" rules={[{ required: true, message: 'Phone required' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="addressLine1" label="Address Line 1" rules={[{ required: true, message: 'Address required' }]}>
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item name="addressLine2" label="Address Line 2">
              <Input />
            </Form.Item>
            <Row gutter={12}>
              <Col span={8}>
                <Form.Item name="city" label="City" rules={[{ required: true, message: 'City required' }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="state" label="State" rules={[{ required: true, message: 'State required' }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="postalCode" label="Postal Code" rules={[{ required: true, message: 'Postal code required' }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="country" label="Country">
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
