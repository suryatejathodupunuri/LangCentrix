'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function ManageUsersPage() {
  const { data: session, status } = useSession();
  const user = session?.user;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const roles = ['Manager', 'Editor', 'Reviewer']; // Admin not editable

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) throw new Error('Update failed');

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, role: newRole, updatedRole: undefined } : u
        )
      );
      
      // Toast notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg flex items-center animate-fade-in z-50';
      notification.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Role updated successfully
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.classList.remove('animate-fade-in');
        notification.classList.add('animate-fade-out');
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    } catch (err) {
      console.error(err);
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-4 bg-red-600 text-white px-4 py-2 rounded-md shadow-lg flex items-center animate-fade-in z-50';
      notification.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
        Error updating role
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.classList.remove('animate-fade-in');
        notification.classList.add('animate-fade-out');
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
  };

  if (status === 'loading' || loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]"> {/* Adjusted for navbar height */}
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-400"></div>
    </div>
  );
  
  if (!user || user.role?.toLowerCase() !== 'admin') return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]"> {/* Adjusted for navbar height */}
      <div className="bg-white border border-gray-300 text-gray-800 px-6 py-4 rounded-md shadow-sm max-w-md">
        <strong className="font-bold">Access Denied</strong>
        <span className="block mt-1">You don't have permission to view this page.</span>
      </div>
    </div>
  );

  const renderTable = (title, roleKey) => {
    const filtered = users.filter((u) => u.role?.toLowerCase() === roleKey.toLowerCase());

    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">{title} <span className="text-gray-500 font-normal">({filtered.length})</span></h2>
        {filtered.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 border border-gray-200">
            No {title.toLowerCase()} found
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{u.name}</div>
                          <div className="text-sm text-gray-500">{u.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {u.role === 'Admin' ? (
                        <span className="text-gray-400">Fixed role</span>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <select
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                            value={u.updatedRole || u.role}
                            onChange={(e) => {
                              const newRole = e.target.value;
                              setUsers((prev) =>
                                prev.map((usr) =>
                                  usr.id === u.id ? { ...usr, updatedRole: newRole } : usr
                                )
                              );
                            }}
                          >
                            {roles.map((r) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleRoleUpdate(u.id, u.updatedRole || u.role)}
                            className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200"
                          >
                            Update
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto mt-16"> {/* Added mt-16 to account for navbar */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-600 mt-1">Manage user roles and permissions</p>
      </div>

      {renderTable('Admins', 'Admin')}
      {renderTable('Managers', 'Manager')}
      {renderTable('Editors', 'Editor')}
      {renderTable('Reviewers', 'Reviewer')}
      
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-out {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(10px); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-fade-out {
          animation: fade-out 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}