import { notFound } from "next/navigation";
import { CommentSection } from "@/components/CommentSection";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

async function getPost(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { name: true, email: true } },
        comments: {
          include: { author: { select: { name: true, email: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!post) return null;
    // Serialize dates for client components
    return {
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      comments: post.comments.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export default async function ViewPost({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const post = await getPost(p.id);

  if (!post) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const isAuthor = session?.user?.id === post.authorId;

  return (
    <div className="animate-fade-in" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <article className="glass-panel" style={{ padding: "3rem", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{post.title}</h1>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
          <div style={{ color: "var(--text-secondary)" }}>
            By <span style={{ color: "var(--accent-secondary)", fontWeight: 500 }}>{post.author.name || post.author.email}</span> • {new Date(post.createdAt).toLocaleDateString()}
          </div>
          
          {isAuthor && (
            <div style={{ display: "flex", gap: "1rem" }}>
              <Link href={`/edit/${post.id}`} className="btn-secondary" style={{ padding: "0.5rem 1rem" }}>
                Edit
              </Link>
            </div>
          )}
        </div>

        <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.8", fontSize: "1.1rem" }}>
          {post.content}
        </div>
      </article>

      <CommentSection postId={post.id} comments={post.comments} />
    </div>
  );
}
