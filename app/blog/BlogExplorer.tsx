"use client";

import type { BlogPost } from "@/app/data/blog";
import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./blog.module.css";

const topics = ["All", "Business IT", "Networks & Security", "Smart Home"] as const;

type Topic = (typeof topics)[number];

export default function BlogExplorer({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<Topic>("All");

  const visiblePosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesTopic = topic === "All" || post.category === topic;
      const searchableText = [
        post.title,
        post.description,
        post.excerpt,
        post.category,
        post.audience,
      ]
        .join(" ")
        .toLowerCase();

      return matchesTopic && searchableText.includes(normalizedQuery);
    });
  }, [posts, query, topic]);

  return (
    <>
      <div className={styles.searchTools}>
        <label className={styles.searchField}>
          <span className={styles.visuallyHidden}>Search articles</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4 4" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search articles, topics, or questions"
          />
        </label>

        <div className={styles.categoryNav} aria-label="Filter articles by topic">
          {topics.map((item) => (
            <button
              type="button"
              className={topic === item ? styles.activeTopic : undefined}
              aria-pressed={topic === item}
              onClick={() => setTopic(item)}
              key={item}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <p className={styles.resultCount} aria-live="polite">
        {visiblePosts.length} {visiblePosts.length === 1 ? "article" : "articles"}
      </p>

      {visiblePosts.length > 0 ? (
        <div className={styles.postGrid}>
          {visiblePosts.map((post) => (
            <Link href={`/blog/${post.slug}`} className={styles.postCard} key={post.slug}>
              <div className={styles.cardMeta}>
                <span>{post.category}</span>
                <span>{post.readTime}</span>
              </div>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <span className={styles.cardLink}>Read the article</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          <h2>No articles found.</h2>
          <p>Try a broader search or choose a different topic.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setTopic("All");
            }}
          >
            Clear search
          </button>
        </div>
      )}
    </>
  );
}
