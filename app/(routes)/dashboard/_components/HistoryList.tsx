"use client";
import Image from "next/image";
import React, { useState } from "react";
import AddNewSessionDialog from "./AddNewSessionDialog";

function HistoryList() {
  const [historyList, setHistoryList] = useState([]);
  return (
    <div className="mt-5 p-6 bg-white rounded-2xl shadow-md">
      <h3 className="text-xl font-semibold mb-4">Consultation History</h3>
      {historyList.length === 0 ? (
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
        <div className="space-y-4">List</div>
      )}
    </div>
  );
}

export default HistoryList;
