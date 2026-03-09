import { PostCard } from "@/components/feed/PostCard";
import { CreatePost } from "@/components/feed/CreatePost";

const mockPosts = [
  {
    id: "1",
    authorId: "u1",
    authorName: "Alice Wambui",
    authorUsername: "alice_w",
    authorAvatar: "/avatars/alice.png",
    content: "Just finished my latest digital painting! What do you guys think? #art #creativity",
    likesCount: 24,
    commentsCount: 5,
    sharesCount: 2,
    isLiked: false,
    hashtags: ["art", "creativity"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    authorId: "u2",
    authorName: "Bob Otieno",
    authorUsername: "bob_o",
    authorAvatar: "/avatars/bob.png",
    content: "Excited to be hosting a live room tonight on the future of design in Africa. Join us! #design #africa",
    likesCount: 15,
    commentsCount: 3,
    sharesCount: 8,
    isLiked: true,
    hashtags: ["design", "africa"],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export default function HomePage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Home Feed</h1>
        <CreatePost />
      </div>
      <div className="space-y-4">
        {mockPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
