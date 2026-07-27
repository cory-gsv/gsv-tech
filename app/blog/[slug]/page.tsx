import JsonLd from "@/app/components/JsonLd";
import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import { siteUrl } from "@/app/config/site";
import { blogPosts, getBlogPost } from "@/app/data/blog";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../blog.module.css";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} | Golden State Visions`,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.published,
      modifiedTime: post.updated,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const articleUrl = `${siteUrl}/blog/${post.slug}`;
  const relatedPosts = blogPosts
    .filter((candidate) => candidate.slug !== post.slug)
    .sort((a, b) =>
      a.category === post.category && b.category !== post.category ? -1 : 0,
    )
    .slice(0, 2);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${articleUrl}#article`,
    headline: post.title,
    description: post.description,
    datePublished: post.published,
    dateModified: post.updated,
    mainEntityOfPage: articleUrl,
    author: {
      "@type": "Organization",
      name: "Golden State Visions",
      url: siteUrl,
    },
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    image: `${siteUrl}/opengraph-image`,
    articleSection: post.category,
    about: post.audience,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <main className={styles.page}>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <SiteHeader />

      <header className={styles.articleHero}>
        <div className={styles.heroInner}>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog">Blog</Link>
            <span aria-hidden="true">/</span>
            <span>{post.category}</span>
          </nav>
          <div className={styles.articleMeta}>
            <span>{post.category}</span>
            <span>{post.readTime}</span>
            <span>Updated July 27, 2026</span>
          </div>
          <h1>{post.title}</h1>
          <p className={styles.articleDeck}>{post.excerpt}</p>
        </div>
      </header>

      <div className={styles.articleShell}>
        <article className={styles.articleBody}>
          {post.partnerLogo && post.partnerLogoAlt && post.partnerHref ? (
            <a
              href={post.partnerHref}
              className={styles.partnerProfile}
              target="_blank"
              rel="noreferrer"
            >
              <Image
                src={post.partnerLogo}
                alt={post.partnerLogoAlt}
                width={1200}
                height={1200}
                sizes="(max-width: 620px) 120px, 170px"
              />
              <span>
                <small>Trusted partner</small>
                <strong>M5 Electric</strong>
                <span>m5-electric.com ↗</span>
              </span>
            </a>
          ) : null}
          {post.sections.map((section) => (
            <section className={styles.articleSection} key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets ? (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </article>

        <aside className={styles.articleAside}>
          <span>Related service</span>
          <h2>Turn the planning into a documented next step.</h2>
          <p>
            Golden State Visions helps Northern California businesses and
            homeowners design, implement, document, and support connected
            technology.
          </p>
          <Link href={post.serviceHref} className={styles.asideLink}>
            {post.serviceLabel} <span aria-hidden="true">→</span>
          </Link>
          {post.partnerHref && post.partnerLabel ? (
            <a
              href={post.partnerHref}
              className={styles.asideLink}
              target="_blank"
              rel="noreferrer"
            >
              {post.partnerLabel} <span aria-hidden="true">↗</span>
            </a>
          ) : null}
          <Link href="/book-consult" className={styles.asideLink}>
            Book a consultation <span aria-hidden="true">→</span>
          </Link>
        </aside>
      </div>

      <section className={styles.related} aria-labelledby="related-articles-title">
        <div className={styles.relatedInner}>
          <h2 id="related-articles-title">Related articles</h2>
          <div className={styles.relatedGrid}>
            {relatedPosts.map((related) => (
              <Link href={`/blog/${related.slug}`} key={related.slug}>
                <span>{related.category}</span>
                <strong>{related.title}</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
