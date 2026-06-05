"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const p = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`/api/posts/${p.id}`);
      if (res.ok) {
        const data = await res.json();
        if (session?.user?.id !== data.authorId) {
          router.push("/"); // Not authorized
        } else {
          setTitle(data.title);
          setContent(data.content);
        }
      } else {
        router.push("/404");
      }
      setFetching(false);
    };

    if (status === "authenticated") {
      fetchPost();
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [p.id, status, session, router]);

  if (status === "loading" || fetching) {
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/posts/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        router.push(`/post/${p.id}`);
        router.refresh();
      } else {
        alert("Failed to update post");
      }
    } catch (err) {
      alert("An error occurred");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${p.id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        alert("Failed to delete post");
      }
    } catch (err) {
      alert("An error occurred");
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div className="glass-panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1>Edit Post</h1>
          <button onClick={handleDelete} className="btn-secondary" style={{ borderColor: "var(--error-color)", color: "var(--error-color)" }}>
            Delete Post
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Post Title</label>
            <input
              type="text"
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea
              className="input-field"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={12}
              style={{ resize: "vertical" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
            <button type="button" className="btn-secondary" onClick={() => router.back()}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
