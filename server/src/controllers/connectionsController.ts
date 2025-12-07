
import { Request, Response } from 'express';

export const getConnections = async (req: Request, res: Response) => {
    // In the future, this will fetch the user's connections from the database
    const connections = {
        nodes: [
            { id: 'User', group: 'user' },
            { id: 'Connection 1', group: 'connection' },
            { id: 'Connection 2', group: 'connection' },
            { id: 'Connection 3', group: 'connection' },
        ],
        links: [
            { source: 'User', target: 'Connection 1' },
            { source: 'User', target: 'Connection 2' },
            { source: 'User', target: 'Connection 3' },
        ],
    };

    res.json(connections);
};
