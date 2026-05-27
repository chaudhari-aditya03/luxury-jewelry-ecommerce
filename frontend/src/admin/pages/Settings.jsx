import React, { useState } from 'react';
import { Switch, message } from 'antd';
import AdminLayout from '../../layouts/AdminLayout';
import { authService } from '../../services';
import { useAuth } from '../../context/AuthContext';

const AdminSettings = () => {
  const { user } = useAuth();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [sendingReset, setSendingReset] = useState(false);

  const handleSendResetLink = async () => {
    if (!user?.email) {
      message.error('No admin email found for password reset');
      return;
    }

    setSendingReset(true);
    try {
      await authService.forgotPassword(user.email);
      message.success('Password reset link sent to your email');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to send password reset email');
    } finally {
      setSendingReset(false);
    }
  };

  const settingsCards = [
    {
      title: 'Notifications',
      description: 'Control which admin alerts you receive in the dashboard.',
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Email alerts</p>
              <p className="text-sm text-gray-400">Receive email notifications for critical admin events</p>
            </div>
            <Switch checked={emailAlerts} onChange={setEmailAlerts} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Order alerts</p>
              <p className="text-sm text-gray-400">Get notified when new orders are placed</p>
            </div>
            <Switch checked={orderAlerts} onChange={setOrderAlerts} />
          </div>
        </div>
      )
    },
    {
      title: 'Security',
      description: 'Manage administrator access and password recovery.',
      content: (
        <div className="space-y-4">
          <div>
            <p className="font-medium text-gray-800">Password recovery</p>
            <p className="text-sm text-gray-400">Send a reset link to {user?.email || 'your admin email'}.</p>
          </div>
          <button
            type="button"
            onClick={handleSendResetLink}
            disabled={sendingReset}
            className="px-5 py-2.5 rounded-lg text-white font-semibold disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #b8860b)' }}
          >
            {sendingReset ? 'Sending...' : 'Send Reset Link'}
          </button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-2xl p-6"
          style={{ background: 'linear-gradient(135deg, #faf5e6 0%, #fff8eb 100%)', border: '1px solid rgba(212,175,55,0.2)' }}>
          <p className="text-sm uppercase tracking-[0.2em] mb-2" style={{ color: '#b8860b' }}>Settings</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Preferences</h1>
          <p className="text-gray-500">Review notification preferences and secure your administrator account.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {settingsCards.map((card) => (
            <div key={card.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h2>
              <p className="text-sm text-gray-400 mb-5">{card.description}</p>
              {card.content}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;