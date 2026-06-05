import { PostCard } from "@/components/PostCard";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: { name: true, email: true },
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    // Serialize dates for client components
    return posts.map((post) => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="animate-fade-in">
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
          Welcome to <span style={{ color: "var(--accent-secondary)" }}>BlogHub</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
          Explore the latest stories, ideas, and expertise from writers across the globe. Join our community to start sharing your own.
        </p>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {posts.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: "center" }}>
            <p>No posts found. Be the first to write one!</p>
          </div>
        ) : (
          posts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}
