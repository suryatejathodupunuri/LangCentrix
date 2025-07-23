"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { User, ChevronDown, LogOut, Menu, Key, ChevronLeft, ChevronRight  } from "lucide-react";
import CONFIG from '../../../config.js';

export default function Navbar({isOpen, toggleSidebar }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { data: session } = useSession();
  const [hovered, setHovered] = useState(false);

  const userData = {
    name: session?.user?.name || "User",
    email: session?.user?.email || "user@example.com",
    role: session?.user?.role || "Member",
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut({ callbackUrl: '/login' });
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async (e) => {
  e.preventDefault();

  // Frontend validations
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    setPasswordError("New passwords don't match");
    return;
  }

  if (passwordData.newPassword.length < 8) {
    setPasswordError("Password must be at least 8 characters");
    return;
  }

  setPasswordError('');
  setIsChangingPassword(true);

  try {
    const response = await fetch(`/api/users/${session.user.id}/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        reenterNewPassword: passwordData.confirmPassword,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to change password');
    }

    // On success
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowChangePassword(false);
    alert('Password changed successfully!');
  } catch (error) {
    console.error("Password change error:", error);
    setPasswordError(error.message || "Failed to change password");
  } finally {
    setIsChangingPassword(false);
  }
};

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm fixed w-full z-50">
      
      <div className="flex items-center justify-between h-20 px-6 -ml-4">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          <button
        onClick={toggleSidebar}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105 hover:shadow-md"
      >
        {hovered ? (
          isOpen ? (
            <ChevronLeft className="h-7 w-7 text-gray-700" />
          ) : (
            <ChevronRight className="h-7 w-7 text-gray-700" />
          )
        ) : (
          <Menu className="h-7 w-7 text-gray-700" />
        )}
      </button>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#0F4C75] via-[#3282B8] to-[#0891B2] bg-clip-text text-transparent tracking-tight">
            {CONFIG.APP_NAME}
          </h2>
        </div>

        {/* Right Section - Profile Only */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-lg border border-transparent hover:border-gray-200"
            disabled={isLoggingOut}
          >
            <div className="w-11 h-11 bg-gradient-to-r from-[#0F4C75] via-[#3282B8] to-[#0891B2] rounded-full flex items-center justify-center shadow-lg ring-2 ring-gray-300">
              <User className="h-5 w-5 text-white " />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-slate-800">{userData.name}</p>
              <p className="text-xs text-slate-600 font-medium">{userData.role}</p>
            </div>
            <ChevronDown className={`h-5 w-5 text-slate-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {isProfileOpen && (
            <div className="absolute top-full right-0 mt-3 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
              <div className="p-5 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-black to-gray-800 rounded-full flex items-center justify-center shadow-lg ring-3 ring-gray-300">
                    <User className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800">{userData.name}</h3>
                    <p className="text-sm text-slate-600 font-medium">{userData.email}</p>
                    <span className="inline-block px-3 py-1.5 mt-2 text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full font-semibold shadow-sm">
                      {userData.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setShowChangePassword(true);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-gray-50 transition-all duration-150"
                >
                  <Key className="h-5 w-5 text-blue-500" />
                  <span>Change Password</span>
                </button>
              </div>

              <div className="border-t border-gray-100 p-3">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-150 disabled:opacity-50 hover:shadow-md"
                >
                  <LogOut className="h-5 w-5" />
                  <span>{isLoggingOut ? 'Signing Out...' : 'Sign Out'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isProfileOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsProfileOpen(false)}
        />
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div 
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Change Password</h3>
              <p className="text-sm text-slate-500 mb-6">Enter your current and new password</p>
              
              <form onSubmit={handlePasswordSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      required
                      autoFocus
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      required
                    />
                  </div>
                  
                  {passwordError && (
                    <div className="text-red-500 text-sm py-2 px-3 bg-red-50 rounded-lg">
                      {passwordError}
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowChangePassword(false)}
                    disabled={isChangingPassword}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isChangingPassword ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}