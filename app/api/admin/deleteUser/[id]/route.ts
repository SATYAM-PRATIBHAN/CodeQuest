import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";


export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await db.user.delete({ where: { id: id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Error deleting user" }, { status: 500 });
  }
}
