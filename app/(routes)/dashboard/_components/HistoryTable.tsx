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
import { SessionDetails } from "../medical-agent/[sessionId]/page";
import ViewReportDialog from "./ViewReportDialog";

type Props = {
  historyList: SessionDetails[];
};

function HistoryTable({ historyList }: Props) {
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
          {(historyList || []).map((record: SessionDetails) => (
            <TableRow key={record.sessionId}>
              <TableCell className="font-medium">
                {record.selectedDoctor?.specialist || "Unknown"}
              </TableCell>
              <TableCell>{record.notes}</TableCell>
              <TableCell>
                {new Date(record.createdOn).toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                <ViewReportDialog record={record}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default HistoryTable;
