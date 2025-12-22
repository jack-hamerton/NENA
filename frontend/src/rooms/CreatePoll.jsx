import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../utils/api';

interface CreatePollProps {
    onPollCreated: (newPoll: any) => void;
}

export const CreatePoll: React.FC<CreatePollProps> = ({ onPollCreated }) => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [duration, setDuration] = useState(24);
    const [anonymous, setAnonymous] = useState(false);
    const { roomId } = useParams<{ roomId: string }>();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formattedOptions = options.map(option => ({ text: option }));
            const durationInSeconds = duration * 60 * 60;
            const response = await api.post(`/rooms/${roomId}/polls`, {
                question,
                options: formattedOptions,
                duration: durationInSeconds,
                anonymous,
            });
            onPollCreated(response.data);
            setQuestion('');
            setOptions(['', '']);
            setDuration(24);
            setAnonymous(false);
        } catch (error) {
            console.error('Error creating poll:', error);
        }
    };

    const handleOptionChange = (index: number, value: string) => {
        if (value.length > 25) return;
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        if (options.length < 4) {
            setOptions([...options, '']);
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
            {options.map((option, index) => (
                <input
                    key={index}
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    required
                />
            ))}
            {options.length < 4 && <button type="button" onClick={addOption}>Add Option</button>}
            <label>
                Duration (in hours):
                <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    min={1}
                    max={168} // 7 days
                />
            </label>
            <label>
                <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={(e) => setAnonymous(e.target.checked)}
                />
                Anonymous Voting
            </label>
            <button type="submit">Create Poll</button>
        </form>
    );
};
