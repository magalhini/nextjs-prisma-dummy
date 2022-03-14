import prisma from '../../../lib/prisma';

//DELETE

export default async function handle(req: any, res: any) {
  const postId = req.query.id;

  if (req.method === 'DELETE') {
    const post = await prisma.post.delete({
      where: { id: Number(postId) },
    });

    res.json(post);
  } else {
    throw new Error(`HTTP method not supported: ${req.method}`);
  }
}
