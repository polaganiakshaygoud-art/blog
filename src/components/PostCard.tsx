import Link from "next/link";
import styles from "./PostCard.module.css";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    author: {
      name: string | null;
      email: string;
    };
    _count: {
      comments: number;
    };
  };
}

export const PostCard = ({ post }: PostCardProps) => {
  const date = new Date(post.createdAt).toLocaleDateString();

  return (
    <Link href={`/post/${post.id}`} className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.title}>{post.title}</h2>
        <span className={styles.date}>{date}</span>
      </div>
      <p className={styles.excerpt}>
        {post.content.length > 150
          ? `${post.content.substring(0, 150)}...`
          : post.content}
      </p>
      <div className={styles.cardFooter}>
        <span className={styles.author}>
          By {post.author.name || post.author.email}
        </span>
        <span className={styles.comments}>
          {post._count.comments} comment{post._count.comments !== 1 ? "s" : ""}
        </span>
      </div>
    </Link>
  );
};
