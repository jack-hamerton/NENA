
import React, { useState, useEffect } from 'react';
import { TextField, List, ListItem, ListItemText, Typography, Paper } from '@mui/material';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

const StudyList = () => {
    const [studies, setStudies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchStudies = async () => {
            try {
                const response = await api.get('/api/v1/studies/');
                setStudies(response.data);
            } catch (error) {
                console.error('Error fetching studies:', error);
            }
        };

        fetchStudies();
    }, []);

    const filteredStudies = studies.filter(study =>
        study.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Available Studies
            </Typography>
            <TextField
                fullWidth
                label="Search Studies"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                margin="normal"
            />
            <List>
                {filteredStudies.map(study => (
                    <ListItem button component={Link} to={`/study/${study.unique_code}`} key={study.id}>
                        <ListItemText primary={study.title} secondary={study.description} />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default StudyList;
