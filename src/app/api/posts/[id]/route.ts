import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const p = await params;
    const post = await prisma.post.findUnique({
      where: { id: p.id },
      include: {
        author: { select: { name: true, email: true } },
        comments: {
          include: { author: { select: { name: true, email: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching post" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const p = await params;
    const post = await prisma.post.findUnique({ where: { id: p.id } });
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    if (post.authorId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { title, content } = await req.json();
    const updatedPost = await prisma.post.update({
      where: { id: p.id },
      data: { title, content },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ message: "Error updating post" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const p = await params;
    const post = await prisma.post.findUnique({ where: { id: p.id } });
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    if (post.authorId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.post.delete({ where: { id: p.id } });
    return NextResponse.json({ message: "Post deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting post" }, { status: 500 });
  }
}
