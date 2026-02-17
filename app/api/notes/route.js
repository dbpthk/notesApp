import dbConnect from "@/lib/db";
import Note from "@/models/Note";

import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await dbConnect();
    const notes = (await Note.find({})).sort({ createdAt: -1 });
    return NextResponse.json({
      success: true,
      data: notes,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 400 },
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    console.log("BODY RECEIVED:", body);
    const note = await Note.create(body);

    return NextResponse.json(
      {
        success: true,
        data: note,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 400 },
    );
  }
}
