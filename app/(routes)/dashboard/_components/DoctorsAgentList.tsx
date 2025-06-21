import { AIDoctorAgents } from "@/shared/list";
import React from "react";
import DoctorAgentCard from "./DoctorAgentCard";

function DoctorsAgentList() {
  return (
    <div className="mt-5 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        AI Specialist Doctor Agents
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {AIDoctorAgents.map((doctor: any, index) => (
          <div
            key={index}
            // className="flex items-center gap-4 mb-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <DoctorAgentCard doctorAgent={doctor} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorsAgentList;
