"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import AddNewSessionDialog from "./AddNewSessionDialog";
import axios from "axios";
import { SessionDetails } from "../medical-agent/[sessionId]/page";
import HistoryTable from "./HistoryTable";

function HistoryList() {
  const [historyList, setHistoryList] = useState<SessionDetails[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="mt-5 p-6 bg-white rounded-2xl shadow-md">
      <h3 className="text-xl font-semibold mb-4">Consultation History</h3>
      {loading ? (
        <p>Loading...</p>
      ) : historyList.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-7 border-2 border-dashed rounded-2xl bg-gray-50">
          <Image
            src="/medical-assistance.png"
            alt="No History"
            width={150}
            height={150}
            className="mx-auto mb-4"
          />
          <h2 className="font-bold text-2xl text-center">
            You have no consultation history yet.
          </h2>
          <AddNewSessionDialog />
        </div>
      ) : (
        <HistoryTable historyList={historyList} />
      )}
    </div>
  );
}

export default HistoryList;
