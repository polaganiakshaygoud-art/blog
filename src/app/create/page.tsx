"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CreatePost() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  if (status === "loading") {
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        alert("Failed to create post");
      }
    } catch (err) {
      alert("An error occurred");
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div className="glass-panel">
        <h1 style={{ marginBottom: "2rem" }}>Write a New Post</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Post Title</label>
            <input
              type="text"
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Give your post a catchy title"
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
              placeholder="Write your thoughts here..."
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
            <button type="button" className="btn-secondary" onClick={() => router.back()}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
