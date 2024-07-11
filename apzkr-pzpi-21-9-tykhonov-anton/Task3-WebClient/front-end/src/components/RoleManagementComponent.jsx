import React, { useState, useEffect } from 'react';
import { fetchRoles, createRole, updateRole, deleteRole } from '../api/roleRequests'; // Adjust the import path as necessary
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const RoleManagementComponent = () => {
  const [roles, setRoles] = useState([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [editRole, setEditRole] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const rolesData = await fetchRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    loadRoles();
  }, []);

  const handleCreateRole = async () => {
    if (!newRoleName) return; // Ensure there's a role name
    try {
      const createdRole = await createRole({ name: newRoleName });
      setRoles([...roles, createdRole]);
      setNewRoleName(''); // Clear input field
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  const handleUpdateRole = async () => {
    if (!editRole || !editRole.name) return; // Ensure there's an edited role
    try {
      const updated = await updateRole(editRole.id, { name: editRole.name });
      setRoles(roles.map(role => (role.id === editRole.id ? updated : role)));
      setEditRole(null);
      setOpenEditDialog(false);
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDeleteRole = async (id) => {
    try {
      await deleteRole(id);
      setRoles(roles.filter(role => role.id !== id));
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  const handleEditClick = (role) => {
    setEditRole(role);
    setOpenEditDialog(true);
  };

  const handleEditChange = (e) => {
    setEditRole({ ...editRole, name: e.target.value });
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Role Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roles.map(role => (
            <TableRow key={role.id}>
              <TableCell>{role.id}</TableCell>
              <TableCell>{role.name}</TableCell>
              <TableCell>
                <Button 
                  aria-label="edit" 
                  variant="contained" 
                  color="secondary" 
                  onClick={() => handleEditClick(role)}
                >
                  Edit
                </Button>
                <Button 
                  aria-label="delete" 
                  variant="contained" 
                  color="primary" 
                  onClick={() => handleDeleteRole(role.id)}
                  sx={{ ml: 1 }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={2}>
              <TextField 
                label="New Role Name" 
                value={newRoleName} 
                onChange={(e) => setNewRoleName(e.target.value)} 
                fullWidth 
              />
            </TableCell>
            <TableCell>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleCreateRole}
              >
                Create Role
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Edit Role Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Role</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the name of the role.
          </DialogContentText>
          <TextField 
            label="Role Name" 
            value={editRole?.name || ''} 
            onChange={handleEditChange} 
            fullWidth 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateRole} color="primary">
            Update Role
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default RoleManagementComponent;
