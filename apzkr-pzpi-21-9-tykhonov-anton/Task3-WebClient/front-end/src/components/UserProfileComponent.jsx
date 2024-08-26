import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Avatar,
    Typography,
    Paper,
    CircularProgress
} from '@mui/material';
import { useAuth } from '../contexts/authContext';
import { updateUser } from '../api/userRequests';
import { useTranslation } from 'react-i18next';

const UserProfileComponent = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, deleteAccount } = useAuth();
    const { t } = useTranslation();
    useEffect(() => {
        if (user) {
            setUpdatedUser({
                username: user.username,
                email: user.email,
                password: '',
            });
            setLoading(false);
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = async () => {
        try {
            await updateUser(user.id, updatedUser);
            setIsEditing(false);
            // Optionally, refresh user data or handle state update here
        } catch (err) {
            console.error('Error updating user data:', err);
            setError('Error updating user data.');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteAccount();
        } catch (err) {
            console.error('Error deleting account:', err);
            setError('Error deleting account.');
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Paper style={{ padding: 20 }}>
            <Avatar
                src={user.img ? URL.createObjectURL(new Blob([user.img], { type: 'image/jpeg' })) : ''}
                alt={user.username}
                style={{ width: 100, height: 100, marginBottom: 20 }}
            />
            <Typography variant="h5">{user.username}</Typography>
            {isEditing ? (
                <div>
                    <TextField
                        name="username"
                        label={t('username')}
                        value={updatedUser.username}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="email"
                        label={t('email')}
                        type="email"
                        value={updatedUser.email}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="password"
                        label={t('password')}
                        type="password"
                        value={updatedUser.password}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveChanges}
                        style={{ marginTop: 20 }}
                    >
                        {t('save')}
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setIsEditing(false)}
                        style={{ marginTop: 20, marginLeft: 10 }}
                    >
                        {t('cancel')}
                    </Button>
                </div>
            ) : (
                <div>
                    <Typography variant="body1">{t('role')}: {user.role}</Typography>
                    <Typography variant="body1">{t('email')}: {user.email}</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setIsEditing(true)}
                        style={{ marginTop: 20 }}
                    >
                        {t('edit')}
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteAccount}
                        style={{ marginTop: 20, marginLeft: 10 }}
                    >
                        {t('delete')}
                    </Button>
                </div>
            )}
        </Paper>
    );
};

export default UserProfileComponent;
