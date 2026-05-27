import React, { useEffect, useState } from 'react';
import { Form, Input, message, Spin } from 'antd';
import AdminLayout from '../../layouts/AdminLayout';
import { userService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/helpers';

const AdminProfile = () => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await userService.getProfile();
        const profileData = response.data?.data;
        setProfile(profileData);
        form.setFieldsValue({
          fullName: profileData?.fullName,
          email: profileData?.email,
          phone: profileData?.phone,
        });
      } catch (error) {
        message.error(error.response?.data?.message || 'Failed to load admin profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [form]);

  const handleSave = async (values) => {
    setSaving(true);
    try {
      const response = await userService.updateProfile(values);
      setProfile(response.data?.data);
      message.success('Admin profile updated successfully');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to update admin profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Spin size="large" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl p-6 text-white"
            style={{ background: 'linear-gradient(145deg, #0f0f0f 0%, #1a1a1a 70%, #2a2010 100%)' }}>
            <p className="text-sm uppercase tracking-[0.2em] text-amber-300 mb-2">Administrator</p>
            <h1 className="text-3xl font-bold mb-2">{profile?.fullName || user?.fullName || 'Admin'}</h1>
            <p className="text-gray-300">Manage your admin account details and contact information.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-400">Role</p>
                  <p className="font-medium text-gray-800">{profile?.role || user?.role || 'ADMIN'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="font-medium text-gray-800 break-all">{profile?.email || user?.email}</p>
                </div>
                <div>
                  <p className="text-gray-400">Joined</p>
                  <p className="font-medium text-gray-800">{profile?.createdAt ? formatDate(profile.createdAt) : '-'}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-5">Edit Profile</h2>
              <Form form={form} layout="vertical" onFinish={handleSave} size="large">
                <Form.Item name="fullName" label="Full Name" rules={[{ required: true, message: 'Full name is required' }]}>
                  <Input className="rounded-lg" />
                </Form.Item>
                <Form.Item name="email" label="Email Address" rules={[{ required: true, message: 'Email is required' }]}>
                  <Input className="rounded-lg" />
                </Form.Item>
                <Form.Item name="phone" label="Phone Number">
                  <Input className="rounded-lg" />
                </Form.Item>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-lg text-white font-semibold disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #D4AF37, #b8860b)' }}
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </Form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProfile;