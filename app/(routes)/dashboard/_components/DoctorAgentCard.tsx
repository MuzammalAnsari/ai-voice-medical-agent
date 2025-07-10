"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { IconArrowRight } from "@tabler/icons-react";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export type doctorAgent = {
  id: number;
  specialist: string;
  image: string;
  description: string;
  agentPrompt: string;
  voiceId?: string;
  subscriptionRequired?: boolean;
};

type props = {
  doctorAgent: doctorAgent;
};

function DoctorAgentCard({ doctorAgent }: props) {
  const { has } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  //@ts-ignore
  const paidUser = has && has({ plan: "pro" });

  const onStartConsultation = async () => {
    try {
      setLoading(true);
      const result = await axios.post("/api/session-chat", {
        notes: "New Query",
        selectedDoctor: doctorAgent,
      });
      console.log(result.data);

      if (result.data?.sessionId) {
        console.log("Session started successfully:", result.data.sessionId);
        // Redirect to the session page
        router.push(`/dashboard/medical-agent/${result.data.sessionId}`);
      }
    } catch (error) {
      console.error("Failed to start consultation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {doctorAgent.subscriptionRequired && (
        <Badge className="absolute top-2 left-2 text-center">Premium</Badge>
      )}
      <Image
        src={doctorAgent.image}
        alt={doctorAgent.specialist}
        width={200}
        height={300}
        className="w-full h-[250px] object-cover rounded-xl"
      />
      <h2 className="font-bold text-lg">{doctorAgent.specialist}</h2>
      <p className="line-clamp-2 text-sm text-gray-500">
        {doctorAgent.description}
      </p>
      <Button
        className="mt-4 w-full"
        onClick={onStartConsultation}
        disabled={!paidUser && doctorAgent.subscriptionRequired}
      >
        + Start Consultation{" "}
        {loading ? <Loader2Icon className="animate-spin" /> : ""}{" "}
        <IconArrowRight />
      </Button>
    </div>
  );
}

export default DoctorAgentCard;
