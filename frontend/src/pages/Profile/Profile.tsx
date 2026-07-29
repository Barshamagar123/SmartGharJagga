// src/pages/Profile/Profile.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button/Button';
import { Card, CardContent } from '../../components/common/Card/Card';
import { authApi } from '../../services/api/auth';
import Input from '../../components/common/Input/Input';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  isVerified: boolean;
  isEmailVerified: boolean;
  avatarUrl: string | null;
  isGoogleUser?: boolean;
  googleId?: string | null;
  createdAt: string;
  updatedAt: string;
}

const Profile: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // ✅ Fetch profile data using authApi
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userData = await authApi.getProfile();
        setProfile(userData);
        setName(userData.name || '');
        setPhone(userData.phone || '');
      } catch (err: any) {
        console.error('Profile fetch error:', err);
        setError(err.response?.data?.message || 'Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, navigate]);

  // ✅ Update profile using authApi
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const updatedUser = await authApi.updateProfile({
        name,
        phone,
      });
      
      setSuccess('Profile updated successfully!');
      setProfile(updatedUser);
      setIsEditing(false);
      
      // Update user in context and localStorage
      const updatedUserData = {
        ...user,
        name: updatedUser.name,
        phone: updatedUser.phone,
      };
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      window.location.reload();
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Change password using authApi
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await authApi.changePassword({
        currentPassword,
        newPassword,
      });
      
      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordFields(false);
    } catch (err: any) {
      console.error('Password change error:', err);
      setError(err.response?.data?.message || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Role Change - Using authApi
  const handleRoleChange = async (newRole: string) => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // ✅ Use authApi.updateRole (correct URL)
      const updatedUser = await authApi.updateRole(newRole);
      
      setSuccess(`Role changed to ${newRole} successfully!`);
      
      // Update local user
      const updatedUserData = { 
        ...user, 
        role: newRole,
        name: user?.name,
        email: user?.email,
      };
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      
      if (profile) {
        setProfile({ ...profile, role: newRole });
      }
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      console.error('Role change error:', err);
      setError(err.response?.data?.message || 'Failed to change role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D5A27] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // ✅ Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Please login to view your profile</p>
          <Button
            onClick={() => navigate('/login')}
            className="mt-4"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <Button
              variant={isEditing ? 'outline' : 'primary'}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2 mb-4">
              <span className="text-xl">❌</span>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 mb-4">
              <span className="text-xl">✅</span>
              <span>{success}</span>
            </div>
          )}

          {/* Profile Card */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full bg-[#2D5A27] flex items-center justify-center text-white text-3xl font-bold">
                    {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  {profile?.isGoogleUser && (
                    <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold text-white bg-[#4285F4] rounded-full">
                      Google
                    </span>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{profile?.name}</h2>
                  <p className="text-gray-600">{profile?.email}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Role: <span className="font-medium">{profile?.role}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {profile?.isEmailVerified ? (
                      <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                        <span>✅</span> Email Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-yellow-600 text-sm">
                        <span>⚠️</span> Email Not Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Member since: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ✅ ROLE SWITCHER SECTION */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Switch Role</h3>
                  <p className="text-sm text-gray-500">Change your account type</p>
                </div>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  profile?.role === 'SELLER' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  Current: {profile?.role}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleRoleChange('BUYER')}
                  disabled={profile?.role === 'BUYER' || loading}
                  className={`p-4 border-2 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                    profile?.role === 'BUYER'
                      ? 'border-[#2D5A27] bg-[#2D5A27]/5 cursor-default'
                      : 'border-gray-200 hover:border-[#2D5A27]/50 hover:bg-gray-50'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="text-3xl">🏠</div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">Buyer</h4>
                    <p className="text-xs text-gray-500">Looking to buy properties</p>
                  </div>
                  {profile?.role === 'BUYER' && (
                    <span className="ml-auto text-[#2D5A27] text-xl">✓</span>
                  )}
                </button>

                <button
                  onClick={() => handleRoleChange('SELLER')}
                  disabled={profile?.role === 'SELLER' || loading}
                  className={`p-4 border-2 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                    profile?.role === 'SELLER'
                      ? 'border-[#2D5A27] bg-[#2D5A27]/5 cursor-default'
                      : 'border-gray-200 hover:border-[#2D5A27]/50 hover:bg-gray-50'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="text-3xl">📈</div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">Seller</h4>
                    <p className="text-xs text-gray-500">Looking to sell properties</p>
                  </div>
                  {profile?.role === 'SELLER' && (
                    <span className="ml-auto text-[#2D5A27] text-xl">✓</span>
                  )}
                </button>
              </div>

              {loading && (
                <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2D5A27]"></div>
                  Updating role...
                </div>
              )}

              <p className="text-xs text-gray-400 mt-3">
                ⚡ Changing role will update your dashboard experience
              </p>
            </CardContent>
          </Card>

          {/* Edit Profile Form */}
          {isEditing && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Profile</h3>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <Input
                      label="Full Name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" isLoading={loading}>
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Change Password Section */}
          {!profile?.isGoogleUser && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPasswordFields(!showPasswordFields)}
                  >
                    {showPasswordFields ? 'Hide' : 'Change Password'}
                  </Button>
                </div>

                {showPasswordFields && (
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <Input
                        label="Current Password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        helper="Password must be at least 8 characters"
                      />
                    </div>
                    <div>
                      <Input
                        label="Confirm New Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" isLoading={loading}>
                      Update Password
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          )}

          {profile?.isGoogleUser && (
            <Card>
              <CardContent className="p-6">
                <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-xl text-sm">
                  <p>
                    🔒 You are signed in with Google. Password management is not available 
                    for Google accounts.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;