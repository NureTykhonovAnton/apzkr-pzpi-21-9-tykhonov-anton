import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';
import {
  fetchTransportationVehicles,
  deleteTransportationVehicle,
  createTransportationVehicle,
  updateTransportationVehicle,
} from '../api/transportRequests'; // Adjust the import path as necessary
import { fetchUsers } from '../api/userRequests';
import { fetchTransportTypes } from '../api/transportTypeRequests'; // Import for transport types
import { renderImage } from '../utils/renderImage';

const TransportationVehicleManagementComponent = () => {
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const [types, setTypes] = useState([]); // State for transport types
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [newVehicle, setNewVehicle] = useState({
    model: '',
    typeId: '',
    capacity: '',
    driverId: '',
    licencePlate: '',
    img: '', // This should be a base64 encoded string
  });

  useEffect(() => {
    const loadVehicles = async () => {
      const vehiclesData = await fetchTransportationVehicles();
      setVehicles(vehiclesData);
    };

    const loadUsers = async () => {
      const usersData = await fetchUsers();
      setUsers(usersData);
    };

    const loadTypes = async () => {
      const typesData = await fetchTransportTypes(); // Fetch transport types
      setTypes(typesData);
    };

    loadVehicles();
    loadUsers();
    loadTypes(); // Load transport types
  }, []);

  const handleDeleteVehicle = async (id) => {
    await deleteTransportationVehicle(id);
    const vehiclesData = await fetchTransportationVehicles();
    setVehicles(vehiclesData);
  };

  const handleAddVehicle = async () => {
    await createTransportationVehicle(newVehicle);
    const vehiclesData = await fetchTransportationVehicles();
    setVehicles(vehiclesData);
    setModalOpen(false);
    setNewVehicle({
      model: '',
      typeId: '',
      capacity: '',
      driverId: '',
      licencePlate: '',
      img: '', // Reset image
    });
  };

  const handleOpenEditModal = (vehicle) => {
    setCurrentVehicle(vehicle);
    setEditModalOpen(true);
  };

  const handleEditVehicle = async () => {
    await updateTransportationVehicle(currentVehicle.id, currentVehicle);
    const vehiclesData = await fetchTransportationVehicles();
    setVehicles(vehiclesData);
    setEditModalOpen(false);
    setCurrentVehicle(null);
  };

  const handleChange = (e) => {
    setNewVehicle({ ...newVehicle, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setCurrentVehicle({ ...currentVehicle, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log(reader.result); // Для проверки
        setNewVehicle({ ...newVehicle, img: reader.result.split(',')[1] });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentVehicle({ ...currentVehicle, img: reader.result });
      };
      reader.readAsDataURL(file); // Using readAsDataURL for image preview
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Model</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Capacity</TableCell>
            <TableCell>Driver</TableCell>
            <TableCell>Licence Plate</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell>{vehicle.model}</TableCell>
              <TableCell>{vehicle.type?.name || 'N/A'}</TableCell>
              <TableCell>{vehicle.capacity}</TableCell>
              <TableCell>{vehicle.driver?.username || 'N/A'}</TableCell>
              <TableCell>{vehicle.licencePlate}</TableCell>
              <TableCell>
                {vehicle.img && (
                  <img
                  src={`data:image/jpeg;base64,${vehicle.img}`}
                  alt="Transportation Vehicle"
                  style={{ width: 100, height: 100, objectFit: 'cover' }}
                />
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenEditModal(vehicle)}
                  style={{ marginLeft: 8 }}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={7}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => setModalOpen(true)}
                style={{ backgroundColor: 'transparent', color: 'black', border: '1px dashed grey' }}
              >
                Add Vehicle
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Add/Edit Vehicle Modal */}
      <Dialog
        open={modalOpen || editModalOpen}
        onClose={() => { setModalOpen(false); setEditModalOpen(false); }}
      >
        <DialogTitle>{currentVehicle ? 'Edit Vehicle' : 'Add Vehicle'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Model"
            name="model"
            value={currentVehicle ? currentVehicle.model : newVehicle.model}
            onChange={currentVehicle ? handleEditChange : handleChange}
            fullWidth
            margin="dense"
          />
          <Select
            label="Type"
            name="typeId"
            value={currentVehicle ? currentVehicle.typeId : newVehicle.typeId}
            onChange={currentVehicle ? handleEditChange : handleChange}
            fullWidth
            margin="dense"
          >
            {types.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Capacity"
            name="capacity"
            value={currentVehicle ? currentVehicle.capacity : newVehicle.capacity}
            onChange={currentVehicle ? handleEditChange : handleChange}
            fullWidth
            margin="dense"
          />
          <Select
            label="Driver"
            name="driverId"
            value={currentVehicle ? currentVehicle.driverId : newVehicle.driverId}
            onChange={currentVehicle ? handleEditChange : handleChange}
            fullWidth
            margin="dense"
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.username}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Licence Plate"
            name="licencePlate"
            value={currentVehicle ? currentVehicle.licencePlate : newVehicle.licencePlate}
            onChange={currentVehicle ? handleEditChange : handleChange}
            fullWidth
            margin="dense"
          />
          <Button
            variant="contained"
            component="label"
            sx={{ m: 2 }}
          >
            Upload File
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={currentVehicle ? handleEditImageChange : handleImageChange}
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setModalOpen(false); setEditModalOpen(false); }}>
            Cancel
          </Button>
          <Button
            onClick={currentVehicle ? handleEditVehicle : handleAddVehicle}
            color="primary"
          >
            {currentVehicle ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default TransportationVehicleManagementComponent;
