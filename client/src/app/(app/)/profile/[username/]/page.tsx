import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PostCard } from "@/components/feed/PostCard";

export default function ProfilePage({ params }: { params: { username: string } }) {
  const { username } = params;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <ProfileHeader userId={username} />
      
      <div className="space-y-4">
        <h2 className="text-lg font-bold px-4">Recent Posts</h2>
        <div className="space-y-4">
          {/* Mock post for profile */}
          <PostCard 
            post={{
              id: "p-profile-1",
              authorId: "u1",
              authorName: "John Doe",
              authorUsername: username,
              authorAvatar: "",
              content: "Working on the NENA frontend today! 🚀",
              likesCount: 12,
              commentsCount: 2,
              sharesCount: 1,
              isLiked: false,
              hashtags: ["build", "nena"],
              createdAt: new Date().toISOString()
            }} 
          />
        </div>
      </div>
    </div>
  );
}
