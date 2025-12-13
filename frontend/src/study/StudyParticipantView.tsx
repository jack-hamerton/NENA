import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, Paper, List, ListItem, ListItemText, RadioGroup, FormControlLabel, Radio, CircularProgress } from '@mui/material';
import { api } from '../services/api'; // Assuming you have a central api service

const StudyParticipantView = () => {
    const { uniqueCode } = useParams();
    const [study, setStudy] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [accessCode, setAccessCode] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchStudyByCode = async (code) => {
        if (!code) return;
        try {
            // Use a relative path for the API request
            const response = await api.get(`/api/v1/studies/code/${code}`);
            if (response.status === 200) {
                const data = response.data;
                setStudy(data);
                setAnswers(new Array(data.questions.length).fill(''));
                setError('');
            } else {
                setError('Study not found or invalid access code.');
                setStudy(null);
            }
        } catch (err) {
            setError('An error occurred while fetching the study.');
            setStudy(null);
        }
    };

    useEffect(() => {
        if (uniqueCode) {
            setAccessCode(uniqueCode);
            fetchStudyByCode(uniqueCode);
        }
    }, [uniqueCode]);

    const handleFetchStudy = () => {
        if (accessCode) {
            fetchStudyByCode(accessCode);
        } else {
            setError('Please enter an access code.');
        }
    };

    const handleAnswerChange = (questionIndex, value) => {
        const newAnswers = [...answers];
        newAnswers[questionIndex] = value;
        setAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setError('');
        try {
            const response = await api.post(`/api/v1/studies/${study.id}/submit`, { answers });
            if (response.status === 200) {
                alert('Study submitted successfully!');
                // Optionally, redirect or clear the form
            } else {
                setError('Failed to submit the study.');
            }
        } catch (err) {
            setError('An error occurred during submission.');
        }
        setSubmitting(false);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Participate in a Study
                </Typography>
                {!study ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Enter Study Access Code"
                            variant="outlined"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            fullWidth
                        />
                        <Button variant="contained" onClick={handleFetchStudy}>
                            Load Study
                        </Button>
                        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                    </Box>
                ) : (
                    <Box>
                        <Typography variant="h5">{study.title}</Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>{study.description}</Typography>
                        <List>
                            {study.questions.map((q, index) => (
                                <ListItem key={q.id} sx={{ mb: 2, flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <ListItemText primary={`${index + 1}. ${q.text}`} />
                                    <RadioGroup
                                        value={answers[index] || ''}
                                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    >
                                        {q.options.map((option, optionIndex) => (
                                            <FormControlLabel key={optionIndex} value={option} control={<Radio />} label={option} />
                                        ))}
                                    </RadioGroup>
                                </ListItem>
                            ))}
                        </List>
                        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={submitting}>
                            {submitting ? <CircularProgress size={24} /> : 'Submit Answers'}
                        </Button>
                        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default StudyParticipantView;
