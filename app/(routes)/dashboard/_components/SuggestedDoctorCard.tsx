import React from 'react';
import { doctorAgent } from './DoctorAgentCard';
import Image from 'next/image';

type Props = {
  doctorAgent: doctorAgent;
  setSelectedDoctor: (doctor: doctorAgent) => void;
  selectedDoctor: doctorAgent | null;
};

function SuggestedDoctorCard({ doctorAgent, setSelectedDoctor, selectedDoctor }: Props) {
  return (
    <div
      className={`flex flex-col items-center border p-6
      rounded-2xl shadow-md hover:shadow-lg transition-shadow
      hover:border-blue-500 cursor-pointer ${selectedDoctor?.id === doctorAgent.id ? "border-blue-500" : ""}`}
      onClick={() => setSelectedDoctor(doctorAgent)}
    >
      <Image
        src={doctorAgent.image}
        alt={doctorAgent.specialist}
        width={70}
        height={70}
        className="w-[50px] h-[50px] rounded-full object-cover"
      />
      <h2 className="font-bold text-sm text-center mt-2">{doctorAgent.specialist}</h2>
      <p className="line-clamp-2 text-sm text-gray-500 text-center">{doctorAgent.description}</p>
    </div>
  );
}

export default SuggestedDoctorCard;
