import React from 'react';
import { GetServerSideProps } from 'next';
import ReactMarkdown from 'react-markdown';
import Router from 'next/router';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import Layout from '../../components/Layout';
import { useSession } from 'next-auth/react';
import { PostProps } from '../../components/Post';

import prisma from '../../lib/prisma';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: Number(params?.id) || -1,
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });

  return {
    props: post,
  };
};

async function publishPost(id: number): Promise<void> {
  await fetch(`http://localhost:3000/api/publish/${id}`, {
    method: 'PUT',
  });

  await Router.push('/');
}

async function deletePost(id: Number): Promise<void> {
  await fetch(`http://localhost:3000/api/post/${id}`, {
    method: 'DELETE',
  });

  await Router.push('/');
}

const Post: React.FC<PostProps> = (props) => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.author?.email;

  let title = props.title;

  if (!props.published) {
    title = `${title} (Draft)`;
  }

  return (
    <Layout>
      <div>
        {loading && <div>Authenticating ...</div>}

        <h2>{title}</h2>
        <small>
          {formatDistance(Number(props.createdAt), new Date(), {
            addSuffix: true,
          })}
        </small>
        <p>By {props?.author?.name || 'Unknown author'}</p>

        <ReactMarkdown source={props.content} />

        {!props.published && userHasValidSession && postBelongsToUser && (
          <button onClick={() => publishPost(props.id)}>Publish</button>
        )}

        {userHasValidSession && postBelongsToUser && (
          <button onClick={() => deletePost(props.id)}>Delete</button>
        )}
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Post;
