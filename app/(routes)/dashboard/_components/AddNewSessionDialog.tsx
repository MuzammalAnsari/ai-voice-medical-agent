"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";
import { doctorAgent } from "./DoctorAgentCard";
import SuggestedDoctorCard from "./SuggestedDoctorCard";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { SessionDetails } from "../medical-agent/[sessionId]/page";

function AddNewSessionDialog() {
  const [note, setNote] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState<doctorAgent[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent | null>(null);
  const [historyList, setHistoryList] = useState<SessionDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

   const {has} = useAuth();
    //@ts-ignore
    const paidUser= has && has({ plan: 'pro' })

     useEffect(() => {
        GetHistoryList();
      }, []);
    
      const GetHistoryList = async () => {
        try {
          const result = await axios.get("/api/session-chat?sessionId=all");
          console.log("History List: ", result.data);
          setHistoryList(result.data);
        } catch (err) {
          console.error("Failed to fetch history list", err);
        } finally {
          setLoading(false);
        }
      };

  const OnClickNext = async () => {
    try {
      setIsLoading(true);
      const result = await axios.post("/api/suggest-doctors", {
        notes: note,
      });
      console.log(result?.data);
      setSuggestedDoctors(result.data);
    } catch (error) {
      console.error("Failed to fetch suggested doctors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onStartConsultation = async () => {
    try {
      setIsLoading(true);
      const result = await axios.post("/api/session-chat", {
        notes: note,
        selectedDoctor: selectedDoctor,
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
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4" disabled={!paidUser && historyList.length >= 1}>+ Start Consultation</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Basic Details</DialogTitle>
            <DialogDescription asChild>
              {!suggestedDoctors.length ? (
                <div>
                  <h2 className="text-lg mb-2">Add symptoms or any other details</h2>
                  <Textarea
                    placeholder="Add details here..."
                    className="mt-2 h-40 text-black"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              ) : (
                <div>
                  <h2 className="text-lg mb-2">
                    Suggested Doctors based on your details
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    {suggestedDoctors.map((doctor, index) => (
                      <SuggestedDoctorCard
                        key={index}
                        doctorAgent={doctor}
                        setSelectedDoctor={() => setSelectedDoctor(doctor)}
                        selectedDoctor={selectedDoctor}
                      />
                    ))}
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>

            {!suggestedDoctors.length ? (
              <Button
                type="button"
                disabled={!note || isLoading}
                onClick={OnClickNext}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <>
                    Next <ArrowRight className="ml-1" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                disabled={!note || isLoading}
                onClick={onStartConsultation}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  "Start Consultation"
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewSessionDialog;