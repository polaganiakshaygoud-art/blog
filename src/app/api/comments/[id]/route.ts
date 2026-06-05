import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
    const comment = await prisma.comment.findUnique({ where: { id: p.id } });
    if (!comment) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 });
    }
    if (comment.authorId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.comment.delete({ where: { id: p.id } });
    return NextResponse.json({ message: "Comment deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting comment" }, { status: 500 });
  }
}
