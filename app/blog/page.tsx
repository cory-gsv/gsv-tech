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

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Technology Planning Blog</p>
          <h1>
            Useful guidance.
            <span>Better technology decisions.</span>
          </h1>
          <p className={styles.heroLead}>
            Clear, field-tested articles for businesses, homeowners, builders,
            and operators planning IT, networks, security, automation, lighting,
            audio, video, and surveillance.
          </p>
        </div>
      </section>

      <section className={styles.content} aria-labelledby="latest-guidance-title">
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Latest Guidance</p>
          <h2 id="latest-guidance-title">Start with the environment you manage.</h2>
          <p>
            These articles go deeper than the FAQ: what to check, how systems fit
            together, where projects go wrong, and what to ask before making an
            investment.
          </p>
        </div>

        <BlogExplorer posts={blogPosts} />
      </section>

      <SiteFooter />
    </main>
  );
}
