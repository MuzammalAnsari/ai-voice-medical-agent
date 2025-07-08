"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { doctorAgent } from "../../_components/DoctorAgentCard";
import { CircleIcon, PhoneCall, PhoneOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";

type SessionDetails = {
  id: number;
  notes: string;
  sessionId: string;
  report: JSON;
  selectedDoctor: doctorAgent;
  createdOn: string;
};

type message = {
  role: string;
  text: string;
};

function MedicalVoiceAgent() {
  const { sessionId } = useParams();
  const [sessionDetails, setSessionDetails] = useState<SessionDetails>();
  const [callStarted, setCallStarted] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<any>();
  const [currentRole, setCurrentRole] = useState<string | null>();
  const [liveTranscription, setLiveTranscription] = useState<string>();
  const [messages, setMessages] = useState<message[]>([]);

  useEffect(() => {
    sessionId && GetSessionDetails();
  }, [sessionId]);

  const GetSessionDetails = async () => {
    const result = await axios.get("/api/session-chat?sessionId=" + sessionId);
    console.log("Session Details: ", result.data);
    setSessionDetails(result.data);
  };

  const startCall = async () => {
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);

    // Start voice conversation
    vapi.start(process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID!);

    // Listen for events
    vapi.on("call-start", () => {
      console.log("Call started");
      setCallStarted(true);
    });
    vapi.on("call-end", () => {
      console.log("Call ended");
      setCallStarted(false);
    });
    vapi.on("message", (message) => {
      if (message.type === "transcript") {
        const { role, transcriptType, transcript } = message;
        console.log(`${message.role}: ${message.transcript}`);
        if (transcriptType === "partial") {
          setLiveTranscription(transcript);
          setCurrentRole(role);
        } else if (transcriptType === "final") {
          // Final transcript received
          setMessages((prev: any) => [
            ...(prev || []),
            { role: role, text: transcript },
          ]);
          setLiveTranscription("");
          setCurrentRole(null);
        }
      }
    });

    vapiInstance.on("speech-start", () => {
      console.log("Assistant started speaking");
      setCurrentRole("assistant");
    });
    vapiInstance.on("speech-end", () => {
      console.log("Assistant stopped speaking");
      setCurrentRole("user");
    });
  };

  const endCall = () => {
    if (!vapiInstance) return;

    // Stop voice conversation listener
    vapiInstance.stop();
    vapiInstance.off("call-start");
    vapiInstance.off("call-end");
    vapiInstance.off("message");
    setCallStarted(false);
    setVapiInstance(null);
  };

  return (
    <div className="p-5 border rounded-3xl bg-secondary">
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <CircleIcon
            className={`h-4 w-4 rounded-full ${
              callStarted ? "bg-green-500" : "bg-red-500"
            }`}
          />
          {callStarted ? "Connected" : "Not connected"}
        </h2>
        <h2 className="font-bold text-xl text-gray-400">00:00</h2>
      </div>
      {sessionDetails && (
        <div className="flex flex-col items-center mt-4">
          <Image
            src={sessionDetails?.selectedDoctor.image}
            alt="Doctor"
            width={120}
            height={120}
            className="w-[100px] h-[100px] rounded-full object-cover"
          />
          <h2 className="font-bold text-lg mt-2">
            {sessionDetails?.selectedDoctor.specialist}
          </h2>
          <p className="text-sm text-gray-500">Ai Medical Voice Agent</p>
          <div className="mt-12 overflow-y-auto flex flex-col items-center  px-10 md:px-20 lg:px-52 xl:px-72">
            {messages?.slice(-4).map((msg, index) => (
              // <div
              //   key={index}
              //   className={`flex items-center gap-2 ${
              //     msg.role === "user" ? "justify-end" : "justify-start"
              //   }`}
              // >
              //   <div
              //     className={`p-2 rounded-lg ${
              //       msg.role === "user"
              //         ? "bg-blue-500 text-white"
              //         : "bg-gray-200 text-black"
              //     }`}
              //   >
              //     <p className="text-sm">{msg.text}</p>
              //   </div>
              // </div>
              <h2 className="text-gray-400" key={index}>{msg.role} : {msg.text}</h2>
            ))}
            <h2 className="text-gray-400">Assistent Msg</h2>
            {liveTranscription && liveTranscription?.length > 0 && (
              <h2 className="text-lg">
                {currentRole} : {liveTranscription}
              </h2>
            )}
          </div>

          {!callStarted ? (
            <Button
              className="mt-4 cursor-pointer"
              onClick={() => startCall()}
              disabled={callStarted}
            >
              Start Call <PhoneCall />
            </Button>
          ) : (
            <Button
              className="mt-4 cursor-pointer"
              variant={"destructive"}
              onClick={() => endCall()}
            >
              {" "}
              <PhoneOff /> Disconect
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default MedicalVoiceAgent;
