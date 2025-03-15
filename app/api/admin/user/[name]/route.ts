import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { name: string } }) {
  const { name } = params;

  if (!name) {
    return NextResponse.json({ error: "Missing username parameter" }, { status: 400 });
  }

  try {
    // Fetch user details from your database or mock data
    const user = { username: name }; // Replace with actual database query

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
