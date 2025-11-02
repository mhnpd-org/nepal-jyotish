import React from "react";

type BlogCardProps = {
  title: string;
  excerpt: string;
  href?: string;
};

export default function BlogCard({ title, excerpt, href }: BlogCardProps) {
  return (
    <article className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{excerpt}</p>
      {href ? (
        <a
          href={href}
          className="text-sm text-blue-600 hover:underline"
          aria-label={`Read ${title}`}
        >
          Read more →
        </a>
      ) : null}
    </article>
  );
}
