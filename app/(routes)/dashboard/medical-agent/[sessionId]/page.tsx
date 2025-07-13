"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
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
  selectedDoctor: doctorAgent & { firstMessage?: string }; // allow firstMessage on doctorAgent
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

  // Timer state and ref for interval
  const [callDuration, setCallDuration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (sessionId) GetSessionDetails();
  }, [sessionId]);

  // Start timer when call starts, stop when call ends
  useEffect(() => {
    if (callStarted) {
      intervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCallDuration(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [callStarted]);

  const GetSessionDetails = async () => {
    try {
      const result = await axios.get(
        "/api/session-chat?sessionId=" + sessionId
      );
      setSessionDetails(result.data[0]);
    } catch (error) {
      console.error("Failed to fetch session details", error);
    }
  };

  // Format seconds to mm:ss
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const startCall = async () => {
    if (!sessionDetails) {
      toast.error("Session details not loaded yet");
      return;
    }

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

    // Register listeners
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

    const firstMessageToUse =
      sessionDetails.selectedDoctor.firstMessage ||
      "Hello, I am your AI medical assistant. What symptoms are you experiencing today?";

    const VapiAgentConfig = {
      name: "Ai Medical Voice Agent",
      firstMessage: firstMessageToUse,
      transcriber: {
        provider: "assembly-ai",
        language: "en",
      },
      voice: {
        provider: "playht",
        voiceId: sessionDetails.selectedDoctor.voiceId,
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: sessionDetails.selectedDoctor.agentPrompt,
          },
        ],
      },
    };

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

      // Remove listeners
      vapiInstance.off("call-start", listeners.onCallStart);
      vapiInstance.off("call-end", listeners.onCallEnd);
      vapiInstance.off("message", listeners.onMessage);
      vapiInstance.off("speech-start", listeners.onSpeechStart);
      vapiInstance.off("speech-end", listeners.onSpeechEnd);

      setCallStarted(false);
      setVapiInstance(null);
      setListeners({}); // clear listeners

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
    <div className="p-5 border rounded-3xl bg-secondary max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h2
          className={`p-1 px-2 border rounded-md flex gap-2 items-center ${
            callStarted
              ? "border-green-500 text-green-600"
              : "border-red-500 text-red-600"
          }`}
        >
          <CircleIcon
            className={`h-4 w-4 rounded-full ${
              callStarted ? "bg-green-500" : "bg-red-500"
            }`}
          />
          {callStarted ? "Connected" : "Not connected"}
        </h2>
        <h2 className="font-mono font-bold text-xl text-gray-400">
          {formatDuration(callDuration)}
        </h2>
      </div>

      {sessionDetails && (
        <div className="flex flex-col items-center mt-4">
          <Image
            src={sessionDetails.selectedDoctor.image}
            alt="Doctor"
            width={120}
            height={120}
            className="w-[100px] h-[100px] rounded-full object-cover"
          />
          <h2 className="font-bold text-lg mt-2">
            {sessionDetails.selectedDoctor.specialist}
          </h2>
          <p className="text-sm text-gray-500">AI Medical Voice Agent</p>

          <div className="mt-12 overflow-y-auto flex flex-col items-center px-6 md:px-12 lg:px-24 xl:px-36 max-h-64 w-full">
            {messages?.slice(-4).map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`w-full mb-2 p-3 rounded-lg ${
                  msg.role === "assistant"
                    ? "bg-blue-100 text-blue-900 self-start"
                    : "bg-gray-200 text-gray-900 self-end"
                }`}
              >
                <strong className="capitalize">{msg.role}:</strong> {msg.text}
              </div>
            ))}

            {liveTranscription && (
              <div className="w-full mt-2 p-3 rounded-lg bg-yellow-100 text-yellow-900 self-start italic">
                <strong className="capitalize">{currentRole} (typing):</strong>{" "}
                {liveTranscription}
              </div>
            )}
          </div>

          {!callStarted ? (
            <Button
              className="mt-4 cursor-pointer flex items-center gap-2"
              onClick={() => startCall()}
              disabled={callStarted || loading}
            >
              {loading ? "Ending Call..." : "Start Call"} <PhoneCall />
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
