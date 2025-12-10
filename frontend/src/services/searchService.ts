
import { DiscoverResult } from '../types/discover';

const mockResults: DiscoverResult[] = [
  {
    id: '1',
    title: 'John Doe',
    summary: 'Software Engineer at Google',
    type: 'user',
  },
  {
    id: '2',
    title: 'Jane Smith',
    summary: 'Product Manager at Facebook',
    type: 'user',
  },
  {
    id: '3',
    title: 'Tech Talk: The Future of AI',
    summary: 'Join us for a discussion on the latest advancements in AI.',
    type: 'room',
  },
  {
    id: '4',
    title: 'How to build a scalable web application',
    summary: 'A deep dive into the architecture of modern web apps.',
    type: 'post',
  },
];

export const searchService = {
  search: async (query: string): Promise<DiscoverResult[]> => {
    // In a real application, this would make an API call to the backend.
    console.log(`Searching for: ${query}`);
    if (!query) {
      return [];
    }
    return mockResults.filter((result) =>
      result.title.toLowerCase().includes(query.toLowerCase())
    );
  },
};
