import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import userService from '../services/userService';
import { toast } from 'react-toastify';
import '../styles/UserTableStyles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function UserTableComponent() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      const userArray = Array.isArray(response) ? response :
        (response?.data ? response.data : []);
      setUsers(userArray);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
      setUsers([]);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const response = await userService.toggleUserStatus(userId);
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, active: !user.active }
          : user
      ));
      toast.success('User status updated successfully');
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleRefresh = async () => {
    try {
      await fetchUsers();
      toast.success('Users refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="user-container">
      <div className="user-header">
        <h2>User Details</h2>
        <Button
          className="refresh-button"
          onClick={handleRefresh}
        >
          <i className="bi bi-arrow-clockwise refresh-icon"></i>
          Refresh
        </Button>
      </div>

      <div className="table-responsive">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <span className="user-id">#{user.id}</span>
                </td>
                <td>{user.username}</td>
                <td>
                  <span className="user-email">{user.email}</span>
                </td>
                <td>
                  {user.roles && user.roles.map(role => (
                    <span 
                      key={role} 
                      className={`user-role ${role.toLowerCase().replace('role_', '')}`}
                    >
                      {role.replace('ROLE_', '')}
                    </span>
                  ))}
                </td>
                <td>
                  <span className={`user-status ${user.active ? 'active' : 'inactive'}`}>
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <Button
                    className={`status-toggle-button ${user.active ? 'deactivate' : 'activate'}`}
                    onClick={() => handleToggleStatus(user.id)}
                  >
                    <i className={`bi bi-toggle-${user.active ? 'on' : 'off'}`}></i>
                    {user.active ? 'Deactivate' : 'Activate'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="no-users">
            No users found in the system.
          </div>
        )}
      </div>
    </div>
  );
}

export default UserTableComponent;