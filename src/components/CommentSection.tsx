"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import styles from "./CommentSection.module.css";
import { useRouter } from "next/navigation";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    name: string | null;
    email: string;
  };
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

export const CommentSection = ({ postId, comments: initialComments }: CommentSectionProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, postId }),
      });
      if (res.ok) {
        setContent("");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Comments</h3>
      
      {session ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea
            className="input-field"
            rows={3}
            placeholder="Write a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
          />
          <button type="submit" className="btn-primary" disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <div className={styles.loginPrompt}>
          Please <a href="/login">login</a> to leave a comment.
        </div>
      )}

      <div className={styles.list}>
        {initialComments.length === 0 ? (
          <p className={styles.noComments}>No comments yet. Be the first!</p>
        ) : (
          initialComments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <div className={styles.header}>
                <span className={styles.author}>{comment.author.name || comment.author.email}</span>
                <span className={styles.date}>{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
              <p className={styles.content}>{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
