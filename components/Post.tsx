import React from 'react';
import Router from 'next/router';
import ReactMarkdown from 'react-markdown';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';

export type PostProps = {
  id: number;
  title: string;
  createdAt: string;
  author: {
    name: string;
    email: string;
  } | null;
  content: string;
  published: boolean;
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : 'Unknown author';
  const date = post.createdAt;

  return (
    <div
      role="button"
      onClick={() => Router.push('/post/[id]', `/post/${post.id}`)}
    >
      <h2>{post.title}</h2>
      <small>By {authorName}</small>
      <br />
      <small>
        Posted{' '}
        {formatDistance(Number(date), new Date(), {
          addSuffix: true,
        })}
      </small>
      <ReactMarkdown source={post.content} />
      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default Post;
