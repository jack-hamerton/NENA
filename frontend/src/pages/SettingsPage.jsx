
import React, { useState, useEffect } from 'react';
import { Container, Typography, Select, MenuItem, Button, FormControl, InputLabel, Box, Switch, FormControlLabel, FormGroup } from '@mui/material';
import { getUserById, updateProfile } from '../services/user.service';
import { useParams } from 'react-router-dom';

const SettingsPage = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Privacy settings
    const [profilePrivacy, setProfilePrivacy] = useState('everyone');
    const [aboutPrivacy, setAboutPrivacy] = useState('everyone');
    const [statusPrivacy, setStatusPrivacy] = useState('everyone');

    // Security settings
    const [pinEnabled, setPinEnabled] = useState(false);

    // Call settings
    const [silenceUnknownCallers, setSilenceUnknownCallers] = useState(false);
    const [callSetting, setCallSetting] = useState('anyone');

    useEffect(() => {
        const fetchUserSettings = async () => {
            try {
                const response = await getUserById(id);
                const userData = response.data;
                setUser(userData);
                // Set privacy settings
                setProfilePrivacy(userData.profile_photo_privacy || 'everyone');
                setAboutPrivacy(userData.about_privacy || 'everyone');
                setStatusPrivacy(userData.online_status_privacy || 'everyone');
                // Set security settings
                setPinEnabled(userData.pin_enabled || false);
                // Set call settings
                setSilenceUnknownCallers(userData.silence_unknown_callers || false);
                setCallSetting(userData.call_setting || 'anyone');
            } catch (error) {
                console.error("Failed to fetch user settings:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserSettings();
    }, [id]);

    const handleSave = async () => {
        const settingsData = {
            // Privacy
            profile_photo_privacy: profilePrivacy,
            about_privacy: aboutPrivacy,
            online_status_privacy: statusPrivacy,
            // Security
            pin_enabled: pinEnabled,
            // Calls
            silence_unknown_callers: silenceUnknownCallers,
            call_setting: callSetting,
        };

        try {
            await updateProfile(id, settingsData);
            alert('Settings saved successfully!');
        } catch (error) {
            console.error("Failed to save settings:", error);
            alert('Failed to save settings. Please try again.');
        }
    };

    const handleLogout = () => {
        console.log("User logging out...");
        // You would typically clear auth tokens and redirect here
    };

    if (isLoading) {
        return <p>Loading settings...</p>;
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            {/* Privacy Settings */}
            <Typography variant="h5" gutterBottom>Privacy Settings</Typography>
            <Box sx={{ pl: 2, mb: 3 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Who can see your profile picture?</InputLabel>
                    <Select value={profilePrivacy} onChange={(e) => setProfilePrivacy(e.target.value)}>
                        <MenuItem value="everyone">Everyone</MenuItem>
                        <MenuItem value="followers">Followers</MenuItem>
                        <MenuItem value="none">None</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Who can see your "About Me"?</InputLabel>
                    <Select value={aboutPrivacy} onChange={(e) => setAboutPrivacy(e.target.value)}>
                        <MenuItem value="everyone">Everyone</MenuItem>
                        <MenuItem value="followers">Followers</MenuItem>
                        <MenuItem value="none">None</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Who can see your online status?</InputLabel>
                    <Select value={statusPrivacy} onChange={(e) => setStatusPrivacy(e.target.value)}>
                        <MenuItem value="everyone">Everyone</MenuItem>
                        <MenuItem value="followers">Followers</MenuItem>
                        <MenuItem value="none">None</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Security Settings */}
            <Typography variant="h5" gutterBottom>Security Settings</Typography>
            <Box sx={{ pl: 2, mb: 3 }}>
                <FormGroup>
                    <FormControlLabel 
                        control={<Switch checked={pinEnabled} onChange={(e) => setPinEnabled(e.target.checked)} />} 
                        label="Enable Two-Step Verification (PIN)" 
                    />
                </FormGroup>
            </Box>

            {/* Call Settings */}
            <Typography variant="h5" gutterBottom>Call Settings</Typography>
            <Box sx={{ pl: 2, mb: 3 }}>
                <FormGroup>
                    <FormControlLabel 
                        control={<Switch checked={silenceUnknownCallers} onChange={(e) => setSilenceUnknownCallers(e.target.checked)} />} 
                        label="Silence Unknown Callers"
                    />
                </FormGroup>
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Who can call you?</InputLabel>
                    <Select value={callSetting} onChange={(e) => setCallSetting(e.target.value)}>
                        <MenuItem value="anyone">Anyone</MenuItem>
                        <MenuItem value="friends">Friends</MenuItem>
                        <MenuItem value="none">None</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                    Save All Settings
                </Button>
                <Button variant="outlined" color="error" onClick={handleLogout}>
                    Logout
                </Button>
            </Box>
        </Container>
    );
};

export default SettingsPage;
