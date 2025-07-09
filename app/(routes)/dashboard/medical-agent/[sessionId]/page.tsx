"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { doctorAgent } from "../../_components/DoctorAgentCard";
import { CircleIcon, Loader2, PhoneCall, PhoneOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";

export type SessionDetails = {
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
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // listeners cache
  const [listeners, setListeners] = useState<any>({});

  useEffect(() => {
    sessionId && GetSessionDetails();
  }, [sessionId]);

  const GetSessionDetails = async () => {
    const result = await axios.get("/api/session-chat?sessionId=" + sessionId);
    setSessionDetails(result.data[0]);
  };

  const startCall = async () => {
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapiInstance(vapi);

    const onCallStart = () => {
      setCallStarted(true);
    };

    const onCallEnd = () => {
      setCallStarted(false);
      setLoading(false);
    };

    const onMessage = (message: any) => {
      if (message.type === "transcript") {
        const { role, transcriptType, transcript } = message;
        if (transcriptType === "partial") {
          setLiveTranscription(transcript);
          setCurrentRole(role);
        } else if (transcriptType === "final") {
          setMessages((prev: any) => [
            ...(prev || []),
            { role: role, text: transcript },
          ]);
          setLiveTranscription("");
          setCurrentRole(null);
        }
      }
    };

    const onSpeechStart = () => {
      setCurrentRole("assistant");
    };

    const onSpeechEnd = () => {
      setCurrentRole("user");
    };

    // Register all listeners
    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);

    setListeners({
      onCallStart,
      onCallEnd,
      onMessage,
      onSpeechStart,
      onSpeechEnd,
    });

    const VapiAgentConfig = {
      name: "Ai Medical Voice Agent",
      firstMessage:
        "You are a friendly General Physician AI. Greet the user and quickly ask what symptoms they are experiencing. Gently guide them through their symptoms and offer helpful suggestions or next steps in a calm and caring tone.",
      transcriber: {
        provider: "assembly-ai",
        language: "en",
      },
      voice: {
        provider: "playht",
        voiceId: sessionDetails?.selectedDoctor.voiceId,
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: sessionDetails?.selectedDoctor.agentPrompt,
          },
        ],
      },
    };

    // Start the voice agent
    //@ts-ignore
    vapi.start(VapiAgentConfig);
  };

  const endCall = async () => {
    setLoading(true);

    if (!vapiInstance) {
      toast.error("No active call to disconnect");
      setLoading(false);
      return;
    }

    try {
      vapiInstance.stop();

      // Properly remove all listeners
      vapiInstance.off("call-start", listeners.onCallStart);
      vapiInstance.off("call-end", listeners.onCallEnd);
      vapiInstance.off("message", listeners.onMessage);
      vapiInstance.off("speech-start", listeners.onSpeechStart);
      vapiInstance.off("speech-end", listeners.onSpeechEnd);

      setCallStarted(false);
      setVapiInstance(null);
      setListeners({}); // clear them

      const reportResult = await GenerateReport();
      toast.success("Your report generated successfully");
      router.replace("/dashboard");
    } catch (err) {
      console.error("Error generating report:", err);
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const GenerateReport = async () => {
    if (!sessionDetails || !messages.length) {
      toast.error("Incomplete data for generating report");
      return;
    }

    try {
      const result = await axios.post("/api/medical-report", {
        messages: messages,
        sessionDetails: sessionDetails,
        sessionId: sessionId,
      });
      return result.data;
    } catch (err) {
      console.error("Report generation failed:", err);
      toast.error("Report generation failed");
    }
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
            src={sessionDetails?.selectedDoctor?.image}
            alt="Doctor"
            width={120}
            height={120}
            className="w-[100px] h-[100px] rounded-full object-cover"
          />
          <h2 className="font-bold text-lg mt-2">
            {sessionDetails?.selectedDoctor?.specialist}
          </h2>
          <p className="text-sm text-gray-500">Ai Medical Voice Agent</p>
          <div className="mt-12 overflow-y-auto flex flex-col items-center px-10 md:px-20 lg:px-52 xl:px-72">
            {messages?.slice(-4).map((msg, index) => (
              <h2 className="text-gray-400" key={`${msg.role}-${index}`}>
                {msg.role} : {msg.text}
              </h2>
            ))}
            <h2 className="text-gray-400">Assistant Msg</h2>
            {liveTranscription && (
              <h2 className="text-lg">
                {currentRole} : {liveTranscription}
              </h2>
            )}
          </div>

          {!callStarted ? (
            <Button
              className="mt-4 cursor-pointer"
              onClick={() => startCall()}
              disabled={callStarted || loading}
            >
              {loading ? "Loading..." : "Start Call"} <PhoneCall />
            </Button>
          ) : (
            <Button
              className="mt-4 cursor-pointer flex items-center gap-2"
              variant={"destructive"}
              onClick={() => endCall()}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <>
                  <PhoneOff /> Disconnect
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default MedicalVoiceAgent;
