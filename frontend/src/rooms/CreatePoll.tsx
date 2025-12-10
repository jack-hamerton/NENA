import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../utils/api';

interface CreatePollProps {
    onPollCreated: (newPoll: any) => void;
}

export const CreatePoll: React.FC<CreatePollProps> = ({ onPollCreated }) => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState('');
    const { roomId } = useParams<{ roomId: string }>();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post(`/rooms/${roomId}/polls`, {
                question,
                options: options.split(',').map(opt => opt.trim()),
            }, {});
            onPollCreated(response.data);
            setQuestion('');
            setOptions('');
        } catch (error) {
            console.error('Error creating poll:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Poll Question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Options (comma-separated)"
                value={options}
                onChange={(e) => setOptions(e.target.value)}
                required
            />
            <button type="submit">Create Poll</button>
        </form>
    );
};
