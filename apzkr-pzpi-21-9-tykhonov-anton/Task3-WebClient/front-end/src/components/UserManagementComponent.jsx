import React, { useState, useEffect } from 'react';
import { fetchUsers, deleteUser, createUser, updateUser } from '../api/userRequests';
import { fetchRoles } from '../api/roleRequests';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const UserManagementComponent = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newUser, setNewUser] = useState({ username: '', password: '', roleId: '' });

  useEffect(() => {
    const loadUsersAndRoles = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers(usersData);
        
        const rolesData = await fetchRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadUsersAndRoles();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      const usersData = await fetchUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleAddUser = async () => {
    try {
      await createUser(newUser);
      const usersData = await fetchUsers();
      setUsers(usersData);
      setModalOpen(false);
      setNewUser({ username: '', password: '', roleId: '' });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleOpenEditModal = (user) => {
    setCurrentUser(user);
    setEditModalOpen(true);
  };

  const handleEditUser = async () => {
    if (currentUser) {
      try {
        await updateUser(currentUser.id, currentUser);
        const usersData = await fetchUsers();
        setUsers(usersData);
        setEditModalOpen(false);
        setCurrentUser(null);
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setCurrentUser({ ...currentUser, [e.target.name]: e.target.value });
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.role?.name || 'N/A'}</TableCell>
              <TableCell>
                <Button variant="contained" color="secondary" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                <Button variant="contained" color="primary" onClick={() => handleOpenEditModal(user)} sx={{ ml: 1 }}>Edit</Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={4}>
              <Button fullWidth variant="contained" onClick={() => setModalOpen(true)} sx={{ backgroundColor: 'transparent', color: 'black', border: '1px dashed grey' }}>Add User</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Add User Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <TextField label="Username" name="username" value={newUser.username} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Password" name="password" type="password" value={newUser.password} onChange={handleChange} fullWidth margin="dense" />
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select name="roleId" value={newUser.roleId} onChange={handleChange}>
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleAddUser} color="primary">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {currentUser && (
            <>
              <TextField label="Username" name="username" value={currentUser.username} onChange={handleEditChange} fullWidth margin="dense" />
              <FormControl fullWidth margin="dense">
                <InputLabel>Role</InputLabel>
                <Select name="roleId" value={currentUser.roleId} onChange={handleEditChange}>
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button onClick={handleEditUser} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default UserManagementComponent;
