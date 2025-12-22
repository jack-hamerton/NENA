
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api'; // Assuming you have a central api service
import {
    ParticipantContainer,
    Title,
    Subtitle,
    BodyText,
    InputContainer,
    TextInput,
    SubmitButton,
    ErrorText,
    QuestionList,
    QuestionListItem,
    QuestionText,
    RadioGroupContainer,
    RadioLabel,
    RadioInput,
    Loader
} from './StudyParticipantView.styled';

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
            } else {
                setError('Failed to submit the study.');
            }
        } catch (err) {
            setError('An error occurred during submission.');
        }
        setSubmitting(false);
    };

    return (
        <ParticipantContainer>
            <Title>Participate in a Study</Title>
            {!study ? (
                <InputContainer>
                    <TextInput
                        placeholder="Enter Study Access Code"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                    />
                    <SubmitButton onClick={handleFetchStudy}>
                        Load Study
                    </SubmitButton>
                    {error && <ErrorText>{error}</ErrorText>}
                </InputContainer>
            ) : (
                <div>
                    <Subtitle>{study.title}</Subtitle>
                    <BodyText>{study.description}</BodyText>
                    <QuestionList>
                        {study.questions.map((q, index) => (
                            <QuestionListItem key={q.id}>
                                <QuestionText>{`${index + 1}. ${q.text}`}</QuestionText>
                                <RadioGroupContainer>
                                    {q.options.map((option, optionIndex) => (
                                        <RadioLabel key={optionIndex}>
                                            <RadioInput
                                                type="radio"
                                                name={`question-${index}`}
                                                value={option}
                                                checked={answers[index] === option}
                                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                            />
                                            {option}
                                        </RadioLabel>
                                    ))}
                                </RadioGroupContainer>
                            </QuestionListItem>
                        ))}
                    </QuestionList>
                    <SubmitButton onClick={handleSubmit} disabled={submitting}>
                        {submitting ? <Loader /> : 'Submit Answers'}
                    </SubmitButton>
                    {error && <ErrorText>{error}</ErrorText>}
                </div>
            )}
        </ParticipantContainer>
    );
};

export default StudyParticipantView;
