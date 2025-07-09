import { db } from "@/config/db";
import { openai } from "@/config/OpenAIModel";
import { SessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const reportGeneratorPrompt = `1. You are an ai medical voice agent that just finished a voice conversation with a user. Based on Doctor Ai Agent Info and conversation between Ai doctor agent and user, generate a structured report with the following fields
2. agent: the medical specialist name (e.g., "General Physician AI")
3. user: name of the patient or "Anonymous" if not provided
4. timestamp: current date and time in ISO format
5.  chief Complaints: one-sentence summary of the main health concern
6.  summary: a 2-3 sentence summary of the conversation, symptoms, and recommendations
7.  symptoms: list of symptoms mentioned by the user
8.  duration: how long the user has experienced the symptons
9.  severity: mild, moderate, or severe
10.  medicationsMentioned: List of any medicines mentioned
11.  recommendations: List of Al suggestions (e.g.. rest, see a doctor)
Return the result in this JSON format
{
"agent": "string",
"user": "string",
"timestamp": "ISO Date string",
"chiefComplaint": "string",
"summary": "string",
"symptoms": ["symptom1", "sympton2"],
"duration": "string",
"severity": "string".
"medicationsMentioned": ["med1", "med2"],
"recommendations": ["rec1", "rec2"],
}
Make sure to return the JSON in valid format, without any additional text or formatting.
`;
export async function POST(req: NextRequest) {
  const { sessionId, sessionDetails, messages } = await req.json();

  try {
    const userInput =
      "Ai Doctor Agent Info:" +
      JSON.stringify(sessionDetails) +
      "conversation:" +
      JSON.stringify(messages);

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash-lite-preview-06-17",
      messages: [
        { role: "system", content: reportGeneratorPrompt },
        {
          role: "user",
          content: userInput,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content returned from AI");
    }

    console.log("AI Response Content: ", content);

    const Resp = content
      .trim()
      .replace("```json", "")
      .replace("```", "");

    const JSONResp = JSON.parse(Resp);

    await db
      .update(SessionChatTable)
      .set({
        report: JSONResp,
        conversation: messages,
      })
      .where(eq(SessionChatTable.sessionId, sessionId));

    return NextResponse.json(JSONResp);
  } catch (error) {
    console.error("Error generating medical report:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate report" }),
      { status: 500 }
    );
  }
}
