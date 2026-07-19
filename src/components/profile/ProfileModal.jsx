import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  AtSign,
  ShieldCheck,
  Calendar,
  Clock,
  KeyRound,
  Edit3,
  Lock,
  Check,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Loader2,
  LogOut,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

// Preset avatar color combinations for user customization
const AVATAR_PRESETS = [
  { id: 'purple', bg: 'from-purple-600 to-indigo-600', text: 'text-white' },
  { id: 'emerald', bg: 'from-emerald-500 to-teal-700', text: 'text-white' },
  { id: 'amber', bg: 'from-amber-500 to-orange-600', text: 'text-white' },
  { id: 'rose', bg: 'from-rose-500 to-pink-600', text: 'text-white' },
  { id: 'cyan', bg: 'from-cyan-500 to-blue-600', text: 'text-white' },
];

export default function ProfileModal({ isOpen, onClose }) {
  const { user, logout, updateUserProfile, changePassword } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'edit' | 'password'

  // Edit Profile Form State
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('purple');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Sync state with logged-in user data whenever modal opens or user updates
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setUsername(user.username || (user.email ? user.email.split('@')[0] : ''));
      setEmail(user.email || '');
      setSelectedAvatar(user.avatar || 'purple');
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  // Helper to compute initials from user name
  const getInitials = (str) => {
    if (!str) return 'U';
    return str
      .trim()
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  // Format timestamp helper
  const formatTimestamp = (dateString) => {
    if (!dateString) return 'Just now';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }).format(date);
    } catch {
      return dateString;
    }
  };

  // Password validation rules
  const passwordValidation = {
    minLength: newPassword.length >= 8,
    hasUppercase: /[A-Z]/.test(newPassword),
    hasLowercase: /[a-z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>_+-]/.test(newPassword),
    passwordsMatch: newPassword.length > 0 && newPassword === confirmPassword,
  };

  const isPasswordFormValid =
    passwordValidation.minLength &&
    passwordValidation.hasUppercase &&
    passwordValidation.hasLowercase &&
    passwordValidation.hasNumber &&
    passwordValidation.hasSpecialChar &&
    passwordValidation.passwordsMatch &&
    currentPassword.length > 0;

  // Handle Edit Profile submission
  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Full Name is required');
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const res = await updateUserProfile({
        name: name.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        avatar: selectedAvatar,
      });

      if (res && res.success) {
        toast.success('Profile details updated successfully!');
        setActiveTab('overview');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      const msg = error.response?.data?.message || 'Failed to update profile details.';
      toast.error(msg);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle Change Password submission
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error('Please enter your current password');
      return;
    }

    if (!isPasswordFormValid) {
      toast.error('Please fulfill all password requirements');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (res && res.success) {
        toast.success('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setActiveTab('overview');
      }
    } catch (error) {
      console.error('Failed to change password:', error);
      const msg = error.response?.data?.message || 'Failed to change password. Verify your current password.';
      toast.error(msg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Find active avatar preset background
  const currentAvatarPreset =
    AVATAR_PRESETS.find((p) => p.id === (user.avatar || selectedAvatar)) || AVATAR_PRESETS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in font-inter">
      {/* Modal Container */}
      <div className="bg-card border border-border/80 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 p-6 border-b border-border/60">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-text-gray hover:text-text-dark hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-4">
            {/* Header Avatar Circle */}
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${currentAvatarPreset.bg} ${currentAvatarPreset.text} flex items-center justify-center text-xl font-bold shadow-lg shadow-primary/20 border-2 border-white/20 shrink-0`}
            >
              {getInitials(user.name)}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold font-roboto text-text-dark tracking-tight">
                  {user.name}
                </h2>
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    user.role === 'admin'
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'bg-slate-200 dark:bg-slate-800 border-slate-300 text-text-gray'
                  }`}
                >
                  {user.role || 'User'}
                </span>
              </div>
              <p className="text-xs text-text-gray font-medium mt-0.5">
                @{user.username || user.email?.split('@')[0]} • {user.email}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-2 mt-6 pt-2 border-t border-border/40">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-text-gray hover:bg-white/40 dark:hover:bg-slate-800/40 hover:text-text-dark'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('edit')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'edit'
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-text-gray hover:bg-white/40 dark:hover:bg-slate-800/40 hover:text-text-dark'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('password')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'password'
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-text-gray hover:bg-white/40 dark:hover:bg-slate-800/40 hover:text-text-dark'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Change Password</span>
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-border/60 flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-text-gray uppercase tracking-wider">
                      Full Name
                    </span>
                    <p className="text-sm font-bold text-text-dark mt-0.5">{user.name}</p>
                  </div>
                </div>

                {/* Email Address Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-border/60 flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-text-gray uppercase tracking-wider">
                      Email Address
                    </span>
                    <p className="text-sm font-bold text-text-dark mt-0.5 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Username Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-border/60 flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
                    <AtSign className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-text-gray uppercase tracking-wider">
                      Username
                    </span>
                    <p className="text-sm font-bold text-text-dark mt-0.5">
                      @{user.username || user.email?.split('@')[0]}
                    </p>
                  </div>
                </div>

                {/* Role Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-border/60 flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-text-gray uppercase tracking-wider">
                      Role & Status
                    </span>
                    <p className="text-sm font-bold text-text-dark capitalize mt-0.5">
                      {user.role || 'User'} (Active)
                    </p>
                  </div>
                </div>

                {/* Account Created Date */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-border/60 flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-text-gray uppercase tracking-wider">
                      Account Created
                    </span>
                    <p className="text-sm font-bold text-text-dark mt-0.5">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Last Login */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-border/60 flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-text-gray uppercase tracking-wider">
                      Last Login
                    </span>
                    <p className="text-sm font-bold text-text-dark mt-0.5">
                      {formatTimestamp(user.lastLogin || user.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveTab('edit')}
                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold text-xs shadow-md shadow-primary/20 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('password')}
                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-text-dark font-bold text-xs transition-all cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Change Password</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 font-bold text-xs transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: EDIT PROFILE */}
          {activeTab === 'edit' && (
            <form onSubmit={handleEditProfileSubmit} className="space-y-5">
              {/* Avatar Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-dark mb-2">
                  Profile Avatar Color Theme
                </label>
                <div className="flex items-center space-x-3">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedAvatar(preset.id)}
                      className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${preset.bg} flex items-center justify-center text-white font-bold text-xs transition-transform cursor-pointer relative ${
                        selectedAvatar === preset.id
                          ? 'ring-2 ring-primary ring-offset-2 ring-offset-card scale-110'
                          : 'hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                    >
                      {getInitials(name)}
                      {selectedAvatar === preset.id && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center border border-white">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name Input */}
              <div>
                <label
                  htmlFor="profile-name"
                  className="block text-xs font-bold uppercase tracking-wider text-text-dark mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="profile-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Gowtham Kumar"
                    className="block w-full pl-10 pr-4 py-2.5 border border-border/80 rounded-xl text-sm font-medium text-text-dark bg-slate-50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Username Input */}
              <div>
                <label
                  htmlFor="profile-username"
                  className="block text-xs font-bold uppercase tracking-wider text-text-dark mb-2"
                >
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <AtSign className="w-4 h-4" />
                  </div>
                  <input
                    id="profile-username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    placeholder="gowtham"
                    className="block w-full pl-10 pr-4 py-2.5 border border-border/80 rounded-xl text-sm font-medium text-text-dark bg-slate-50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Email Address Input */}
              <div>
                <label
                  htmlFor="profile-email"
                  className="block text-xs font-bold uppercase tracking-wider text-text-dark mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="profile-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="block w-full pl-10 pr-4 py-2.5 border border-border/80 rounded-xl text-sm font-medium text-text-dark bg-slate-50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-border/60 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="px-4 py-2.5 rounded-xl border border-border/80 text-text-gray hover:text-text-dark font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold text-xs shadow-md shadow-primary/20 transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isUpdatingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: CHANGE PASSWORD */}
          {activeTab === 'password' && (
            <form onSubmit={handleChangePasswordSubmit} className="space-y-5">
              {/* Current Password Field */}
              <div>
                <label
                  htmlFor="current-password"
                  className="block text-xs font-bold uppercase tracking-wider text-text-dark mb-2"
                >
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="current-password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="block w-full pl-10 pr-10 py-2.5 border border-border/80 rounded-xl text-sm font-medium text-text-dark bg-slate-50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-text-dark cursor-pointer"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password Field */}
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-xs font-bold uppercase tracking-wider text-text-dark mb-2"
                >
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="block w-full pl-10 pr-10 py-2.5 border border-border/80 rounded-xl text-sm font-medium text-text-dark bg-slate-50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-text-dark cursor-pointer"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-xs font-bold uppercase tracking-wider text-text-dark mb-2"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="block w-full pl-10 pr-10 py-2.5 border border-border/80 rounded-xl text-sm font-medium text-text-dark bg-slate-50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-text-dark cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Real-time Password Rules Checklist */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-border/60 space-y-2">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-text-gray mb-1">
                  Password Requirements
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    {passwordValidation.minLength ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                    <span
                      className={
                        passwordValidation.minLength
                          ? 'text-emerald-600 font-semibold'
                          : 'text-text-gray'
                      }
                    >
                      At least 8 characters
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {passwordValidation.hasUppercase ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                    <span
                      className={
                        passwordValidation.hasUppercase
                          ? 'text-emerald-600 font-semibold'
                          : 'text-text-gray'
                      }
                    >
                      One uppercase letter (A-Z)
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {passwordValidation.hasLowercase ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                    <span
                      className={
                        passwordValidation.hasLowercase
                          ? 'text-emerald-600 font-semibold'
                          : 'text-text-gray'
                      }
                    >
                      One lowercase letter (a-z)
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {passwordValidation.hasNumber ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                    <span
                      className={
                        passwordValidation.hasNumber
                          ? 'text-emerald-600 font-semibold'
                          : 'text-text-gray'
                      }
                    >
                      One number (0-9)
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {passwordValidation.hasSpecialChar ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                    <span
                      className={
                        passwordValidation.hasSpecialChar
                          ? 'text-emerald-600 font-semibold'
                          : 'text-text-gray'
                      }
                    >
                      One special character (!@#$)
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {passwordValidation.passwordsMatch ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                    <span
                      className={
                        passwordValidation.passwordsMatch
                          ? 'text-emerald-600 font-semibold'
                          : 'text-text-gray'
                      }
                    >
                      Passwords match
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-border/60 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="px-4 py-2.5 rounded-xl border border-border/80 text-text-gray hover:text-text-dark font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword || !isPasswordFormValid || !currentPassword}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold text-xs shadow-md shadow-primary/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
