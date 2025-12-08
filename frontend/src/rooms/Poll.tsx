import React from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../utils/api';

export const Poll: React.FC<{ poll: any }> = ({ poll }) => {
    const { roomId } = useParams<{ roomId: string }>();

    const handleVote = async (option: string) => {
        try {
            await api.post(`/rooms/${roomId}/polls/${poll.id}/vote`, { option });
            // You might want to update the poll data to reflect the new vote
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    return (
        <div>
            <h3>{poll.question}</h3>
            <ul>
                {poll.options.map((option: string, index: number) => (
                    <li key={index} onClick={() => handleVote(option)}>
                        {option}
                    </li>
                ))}
            </ul>
        </div>
    );
};
