import { openai } from "@/config/OpenAIModel";
import { AIDoctorAgents } from "@/shared/list";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { notes } = await req.json();
  try {
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash-lite-preview-06-17",
      messages: [
        { role: "system", content: JSON.stringify(AIDoctorAgents) },
        {
          role: "user",
          content: `
                  User Notes/Symptoms: ${notes}.
                  Based on these symptoms, select relevant doctors from the following list:
                 ${JSON.stringify(AIDoctorAgents)}.
                  Return an array of full matching doctor objects from this list in valid JSON format.
                  Only return the array, nothing else.`,
        },
      ],
    });

    const rawResp = completion.choices[0].message;

    //@ts-ignore
    const Resp = rawResp.content
      .trim()
      .replace("```json", "")
      .replace("```", "");
    const JSONResp = JSON.parse(Resp);
    return NextResponse.json(JSONResp);
  } catch (error) {
    return NextResponse.json(error);
  }
}
