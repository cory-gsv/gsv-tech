import JsonLd from "@/app/components/JsonLd";
import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import { siteUrl } from "@/app/config/site";
import { blogPosts } from "@/app/data/blog";
import type { Metadata } from "next";
import BlogExplorer from "./BlogExplorer";
import styles from "./blog.module.css";

export const metadata: Metadata = {
  title: "Technology Planning Blog | Golden State Visions",
  description:
    "Practical articles about managed IT, cybersecurity, business networks, Wi-Fi, smart home automation, lighting, audio, video, and surveillance.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Technology Planning Blog | Golden State Visions",
    description:
      "Practical guidance for better business technology and connected homes.",
    url: "/blog",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Golden State Visions technology planning blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Technology Planning Blog | Golden State Visions",
    description:
      "Practical guidance for better business technology and connected homes.",
    images: ["/opengraph-image"],
  },
};

export default function BlogPage() {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${siteUrl}/blog#blog`,
    name: "Golden State Visions Technology Planning Blog",
    description: metadata.description,
    url: `${siteUrl}/blog`,
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    blogPost: blogPosts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.published,
      dateModified: post.updated,
      url: `${siteUrl}/blog/${post.slug}`,
    })),
  };

  return (
    <main className={styles.page}>
      <JsonLd data={blogSchema} />
      <SiteHeader />

      <section className={styles.content} aria-labelledby="latest-guidance-title">
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Technology Insights</p>
          <h2 id="latest-guidance-title">
            Helpful articles for better technology decisions.
          </h2>
          <p>
            Explore advice, comparisons, checklists, and planning guides for
            business IT, networks, security, smart homes, and connected systems.
          </p>
        </div>

        <BlogExplorer posts={blogPosts} />
      </section>

      <SiteFooter />
    </main>
  );
}
