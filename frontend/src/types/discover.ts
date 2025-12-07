export interface DiscoverResult {
  id: string;
  type: 'user' | 'post' | 'room';
  title: string;
  summary: string;
}
