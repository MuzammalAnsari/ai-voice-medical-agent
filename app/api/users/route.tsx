import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if the user already exists
    const existingUser = await db
      .select()
      .from(usersTable)
      //@ts-ignore
      .where(eq(usersTable.email, user.primaryEmailAddress?.emailAddress));

    if (existingUser.length === 0) {
      // If not found, insert user
      const result = await db
        .insert(usersTable)
        .values({
          //@ts-ignore
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
          credits: 10,
        })
        .returning();

      return NextResponse.json(result[0], { status: 201 });
    } else {
      // If found, optionally return existing user or message
      return NextResponse.json(existingUser[0]);
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
