import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content', 'blog');

export interface BlogPost {
  slug: string;
  frontMatter: {
    title: string;
    description: string;
    date: string;
    author?: string;
    tags?: string[];
    image?: string;
  };
  content: string;
}

// Get all blog post slugs
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  const files = fs.readdirSync(contentDirectory);
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace('.mdx', ''));
}

// Get a single blog post by slug
export function getPostBySlug(slug: string): BlogPost | null {
  const fullPath = path.join(contentDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    frontMatter: data as BlogPost['frontMatter'],
    content,
  };
}

// Get all blog posts sorted by date
export function getAllPosts(): BlogPost[] {
  const slugs = getAllPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => {
      const dateA = new Date(a.frontMatter.date);
      const dateB = new Date(b.frontMatter.date);
      return dateB.getTime() - dateA.getTime();
    });

  return posts;
}

// Extract headings from markdown content for table of contents
export function extractHeadings(content: string) {
  const headingRegex = /^#{2,3}\s+(.+)$/gm;
  const headings: Array<{ level: number; text: string; id: string }> = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[0].split('#').length - 1;
    const text = match[1].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    headings.push({ level, text, id });
  }

  return headings;
}
