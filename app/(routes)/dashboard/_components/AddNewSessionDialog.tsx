'use client';
import React, { useState } from "react";
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
import { ArrowRight } from "lucide-react";
function AddNewSessionDialog() {
    const[note, setNote] = useState<string>("");
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button className="mt-4">+ Start Consultation</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Basic Details</DialogTitle>
            <DialogDescription asChild>
              <div>
                <h2 className="text-lg  mb-2">
                  Add symptoms or any other details
                </h2>
                <Textarea
                  placeholder="Add Details here..."
                  className="mt-2 h-40 text-black"
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
              <Button variant={"outline"}> cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={!note}>Next <ArrowRight/></Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewSessionDialog;
