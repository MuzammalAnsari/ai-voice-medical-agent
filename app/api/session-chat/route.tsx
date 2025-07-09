import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { notes, selectedDoctor } = await req.json();

    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const sessionId = uuidv4();
    //@ts-ignore
    const result = await db
      .insert(SessionChatTable)
      .values({
        sessionId: sessionId,
        //@ts-ignore
        createdBy: user.primaryEmailAddress?.emailAddress,
        notes: notes,
        selectedDoctor: selectedDoctor,
        createdOn: new Date().toString(),
      })
      //@ts-ignore
      .returning({ SessionChatTable });

    return NextResponse.json(result[0].SessionChatTable);
  } catch (error) {
    console.error("Error creating session chat:", error);
    return NextResponse.json(
      { error: "Failed to create session chat" },
      { status: 500 }
    );
  }
}

//get
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const user = await currentUser();

  if (sessionId === "all") {
    const result = await db.select().from(SessionChatTable)
      // @ts-ignore
      .where(eq(SessionChatTable.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(SessionChatTable.id));
    return NextResponse.json(result);
  } else {
    const result = await db
      .select()
      .from(SessionChatTable)
      // @ts-ignore
      .where(eq(SessionChatTable.sessionId, sessionId));
    return NextResponse.json(result);
  }
}
