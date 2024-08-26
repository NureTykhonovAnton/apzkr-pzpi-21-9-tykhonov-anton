import React, { useState, useEffect } from 'react';
import { fetchUsers, deleteUser, createUser, updateUser } from '../api/userRequests';
import { Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, ButtonGroup } from '@mui/material';
import useGeolocation from '../utils/useGeolocation';
import { useTranslation } from 'react-i18next';

const UserManagementComponent = () => {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { latitude, longitude } = useGeolocation();
  const [newUser, setNewUser] = useState({ username: '', email: '', img: null, password: '', role: '', latitude, longitude });
  const { t } = useTranslation();
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };

    loadUsers();
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
      const formData = new FormData();
      formData.append('username', newUser.username);
      formData.append('email', newUser.email);
      formData.append('role', newUser.role);
      formData.append('password', newUser.password);
      formData.append('latitude', newUser.latitude);
      formData.append('longitude', newUser.longitude);
      if (newUser.img) {
        formData.append('img', newUser.img);
      }

      await createUser(formData);
      const usersData = await fetchUsers();
      setUsers(usersData);
      setModalOpen(false);
      setNewUser({ username: '', email: '', password: '', img: null, role: '', latitude, longitude });
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
        const formData = new FormData();
        formData.append('username', currentUser.username);
        formData.append('password', currentUser.password);
        formData.append('email', currentUser.email);
        formData.append('role', currentUser.role);
        formData.append('latitude', currentUser.latitude);
        formData.append('longitude', currentUser.longitude);
        if (currentUser.img) {
          formData.append('img', currentUser.img);
        }

        await updateUser(currentUser.id, formData);
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
    const { name, value } = e.target;
    setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewUser((prevUser) => ({ ...prevUser, img: e.target.files[0] }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleEditFileChange = (e) => {
    setCurrentUser((prevUser) => ({ ...prevUser, img: e.target.files[0] }));
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>{t('username')}</TableCell>
            <TableCell>{t('email')}</TableCell>
            <TableCell>{t('role')}</TableCell>
            <TableCell>{t('actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell align='center'>
                <ButtonGroup orientation='vertical'>
                  <Button fullWidth variant="contained" color="secondary" onClick={() => handleDeleteUser(user.id)}>{t('delete')}</Button>
                  <Button fullWidth variant="contained" color="primary" onClick={() => handleOpenEditModal(user)} sx={{ ml: 1 }}>{t('edit')}</Button>
                </ButtonGroup>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={4}>
              <Button fullWidth variant="contained" onClick={() => setModalOpen(true)} sx={{ backgroundColor: 'transparent', color: 'black', border: '1px dashed grey' }}>{t('add')} {t('user')}</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Add User Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="add-user-dialog-title"
        aria-describedby="add-user-dialog-description"
      >
        <DialogTitle id="add-user-dialog-title">Add User</DialogTitle>
        <DialogContent id="add-user-dialog-description">
          <TextField label="Username" name="username" value={newUser.username} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Email" name="email" value={newUser.email} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Password" name="password" value={newUser.password} onChange={handleChange} fullWidth margin="dense" />
          <input type="file" name="img" onChange={handleFileChange} accept="image/*" />
          <Select
            label="Role"
            name="role"
            value={newUser.role || ''}
            onChange={handleChange}
            fullWidth
            margin="dense"
          >
            <MenuItem value="user">{t('user')}</MenuItem>
            <MenuItem value="admin">{t('admin')}</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>{t('cancel')}</Button>
          <Button onClick={handleAddUser} color="primary">{t('add')}</Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        aria-labelledby="edit-user-dialog-title"
        aria-describedby="edit-user-dialog-description"
      >
        <DialogTitle id="edit-user-dialog-title">{t('edit')} {t('user')}</DialogTitle>
        <DialogContent id="edit-user-dialog-description">
          {currentUser && (
            <>
              <TextField label="Username" name="username" value={currentUser.username} onChange={handleEditChange} fullWidth margin="dense" />
              <TextField label="Email" name="email" value={currentUser.email} onChange={handleEditChange} fullWidth margin="dense" />
              <input type="file" name="img" onChange={handleEditFileChange} accept="image/*" />
              <Select
                label="Role"
                name="role"
                value={currentUser.role || ''}
                onChange={handleEditChange}
                fullWidth
                margin="dense"
              >
                <MenuItem value="user">{t('user')}</MenuItem>
                <MenuItem value="admin">{t('admin')}</MenuItem>
              </Select>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>{t('cancel')}</Button>
          <Button onClick={handleEditUser} color="primary">{t('edit')}</Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default UserManagementComponent;
