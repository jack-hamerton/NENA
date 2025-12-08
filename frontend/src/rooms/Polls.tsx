import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Poll } from './Poll';
import { CreatePoll } from './CreatePoll';
import { api } from '../utils/api';

export const Polls: React.FC = () => {
    const [polls, setPolls] = useState<any[]>([]);
    const { roomId } = useParams<{ roomId: string }>();

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const response = await api.get(`/rooms/${roomId}/polls`);
                setPolls(response.data);
            } catch (error) {
                console.error('Error fetching polls:', error);
            }
        };

        fetchPolls();
    }, [roomId]);

    const handlePollCreated = (newPoll: any) => {
        setPolls([...polls, newPoll]);
    };

    return (
        <div>
            <CreatePoll onPollCreated={handlePollCreated} />
            {polls.map((poll) => (
                <Poll key={poll.id} poll={poll} />
            ))}
        </div>
    );
};
