"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ViewReportDialog from "./ViewReportDialog";
import { SessionDetails } from "../medical-agent/[sessionId]/page";

type Props = {
  historyList: SessionDetails[];
};

function HistoryTable({ historyList }: Props) {
  // Filter records that have a report
  const recordsWithReport = (historyList || []).filter(
    (record: SessionDetails) => record.report
  );

  return (
    <div>
      <Table>
        <TableCaption>Previous Consultation Reports.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>AI Medical Specialist</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recordsWithReport.length > 0 ? (
            recordsWithReport.map((record: SessionDetails) => (
              <TableRow key={record.sessionId}>
                <TableCell className="font-medium">
                  {record.selectedDoctor?.specialist || "Unknown"}
                </TableCell>
                <TableCell>{record.notes}</TableCell>
                <TableCell>
                  {new Date(record.createdOn).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <ViewReportDialog record={record} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500 py-4">
                No reports available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default HistoryTable;
