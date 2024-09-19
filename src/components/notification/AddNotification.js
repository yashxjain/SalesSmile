import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Input } from '@mui/material';
import axios from 'axios';

function AddNotification({ open, onClose, onNotificationAdded }) {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [url, setUrl] = useState('');
    const [pushTime, setPushTime] = useState('');
    const [base64Image, setBase64Image] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBase64Image(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('subject', subject);
            formData.append('body', body);
            formData.append('url', url);
            formData.append('push_time', pushTime);
            formData.append('image', base64Image); // Use the base64 image string

            const response = await axios.post(
                'https://namami-infotech.com/HR-SMILE-BACKEND/src/notification/add_notification.php',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.success) {
                onNotificationAdded();
                onClose();
            } else {
                console.error('Failed to add notification:', response.data.message);
            }
        } catch (err) {
            console.error('Error adding notification:', err);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add Notification</DialogTitle>
            <DialogContent>
                <TextField
                    label="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    variant="outlined"
                    fullWidth
                    style={{ marginBottom: '1rem' }}
                />
                <TextField
                    label="Body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    variant="outlined"
                    multiline
                    rows={4}
                    fullWidth
                    style={{ marginBottom: '1rem' }}
                />
                <TextField
                    label="URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    variant="outlined"
                    fullWidth
                    style={{ marginBottom: '1rem' }}
                />
                <TextField
                    label="Push Time"
                    type="datetime-local"
                    value={pushTime}
                    onChange={(e) => setPushTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    fullWidth
                    style={{ marginBottom: '1rem' }}
                />
                <Input
                    type="file"
                    onChange={handleFileChange}
                    style={{ marginBottom: '1rem' }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddNotification;
