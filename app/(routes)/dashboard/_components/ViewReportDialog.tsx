"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SessionDetails } from "../medical-agent/[sessionId]/page";

type Props = {
  record: SessionDetails;
};

function ViewReportDialog({ record }: Props) {
  const report =
    typeof record?.report === "string"
      ? JSON.parse(record.report)
      : record?.report;

  console.log("Dialog record", record);
  console.log("Parsed report", report);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"link"}>View Report</Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl overflow-y-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle asChild>
            <h2 className="text-3xl text-center font-bold">
              Medical AI Voice Agent Report
            </h2>
          </DialogTitle>

          <DialogDescription asChild>
            <div className="mt-6 space-y-6 text-[16px]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold">Doctor Specialization:</span>{" "}
                  {record?.selectedDoctor?.specialist ?? "N/A"}
                </div>
                <div>
                  <span className="font-semibold">Consult Date:</span>{" "}
                  {record?.createdOn
                    ? new Date(record.createdOn).toLocaleString()
                    : "Not available"}
                </div>
              </div>

              {report ? (
                <div className="space-y-4">
                  <div>
                    <span className="font-semibold">Agent:</span> {report.agent}
                  </div>
                  <div>
                    <span className="font-semibold">User:</span> {report.user}
                  </div>
                  <div>
                    <span className="font-semibold">Timestamp:</span>{" "}
                    {new Date(report.timestamp).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-semibold">Chief Complaint:</span>{" "}
                    {report.chiefComplaint}
                  </div>
                  <div>
                    <span className="font-semibold">Summary:</span>{" "}
                    {report.summary}
                  </div>
                  <div>
                    <span className="font-semibold">Symptoms:</span>{" "}
                    {report.symptoms?.length
                      ? report.symptoms.join(", ")
                      : "None"}
                  </div>
                  <div>
                    <span className="font-semibold">Duration:</span>{" "}
                    {report.duration}
                  </div>
                  <div>
                    <span className="font-semibold">Severity:</span>{" "}
                    {report.severity}
                  </div>
                  <div>
                    <span className="font-semibold">Medications Mentioned:</span>{" "}
                    {report.medicationsMentioned?.length
                      ? report.medicationsMentioned.join(", ")
                      : "None"}
                  </div>
                  <div>
                    <span className="font-semibold">Recommendations:</span>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {report.recommendations?.length ? (
                        report.recommendations.map(
                          (rec: string, idx: number) => (
                            <li key={idx}>{rec}</li>
                          )
                        )
                      ) : (
                        <li>None</li>
                      )}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-center p-4 border rounded-lg">
                  No report generated for this session yet.
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ViewReportDialog;