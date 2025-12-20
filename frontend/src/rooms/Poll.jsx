import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../utils/api';

export const Poll: React.FC<{ poll: any }> = ({ poll }) => {
    const { roomId } = useParams<{ roomId: string }>();
    const [voted, setVoted] = useState(false);
    const [results, setResults] = useState(null);
    const [remainingTime, setRemainingTime] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const endsAt = new Date(poll.createdAt).getTime() + poll.duration * 60 * 60 * 1000;
            const now = new Date().getTime();
            const distance = endsAt - now;

            if (distance < 0) {
                setRemainingTime("Poll has ended");
                clearInterval(interval);
            } else {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                setRemainingTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [poll]);

    const handleVote = async (option: string) => {
        if (voted) return;
        try {
            const response = await api.post(`/rooms/${roomId}/polls/${poll.id}/vote`, { option }, {});
            setResults(response.data.results);
            setVoted(true);
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    return (
        <div>
            <h3>{poll.question}</h3>
            {!voted && (
                <ul>
                    {poll.options.map((option: string, index: number) => (
                        <li key={index} onClick={() => handleVote(option)}>
                            {option}
                        </li>
                    ))}
                </ul>
            )}
            {voted && results && (
                <ul>
                    {Object.entries(results).map(([option, percentage]) => (
                        <li key={option}>
                            {option}: {percentage}%
                        </li>
                    ))}
                </ul>
            )}
            <div>{remainingTime}</div>
        </div>
    );
};
