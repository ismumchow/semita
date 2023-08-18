"use client";
import React, { useState, useEffect } from "react";
import { Item, Status } from "@prisma/client";
import { toast } from "@/hooks/use-toast";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { DeliverableUpdatePayload } from "@/lib/validators/deliverable";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import Paragraph from "./ui/Paragraph";
import { ChevronDown } from "lucide-react";
import CopyButton from "@/components/ui/CopyButton";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/Input";

interface DeliverableProps {
  items: Item[];
  statuses: Status[];
  deliverableId: string;
  deliverableName: string;
}

const DeliverableUpdate = ({
  items,
  statuses,
  deliverableId,
  deliverableName,
}: DeliverableProps) => {
  const router = useRouter();
  const [itemStates, setItemStates] = useState<Item[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const { loginToast } = useCustomToasts();
  const currentRoute =
    typeof window !== "undefined" ? `${window.location.origin}` : "";

  useEffect(() => {
    setItemStates(items);
  }, [items]);

  const handleStatusChange = (itemId: string, newStatus: string) => {
    setItemStates((prevStates) =>
      prevStates.map((item) =>
        item.id === itemId ? { ...item, status: newStatus } : item
      )
    );
    setHasChanges(true);
  };

  const { mutate: updateDeliverable, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: DeliverableUpdatePayload = {
        deliverableId: deliverableId,
        deliverableItems: itemStates,
      };
      const { data } = await axios.patch(
        `/api/deliverable/change-status/${deliverableId}`,
        payload
      );
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "Deliverable Name already exists.",
            description: "Please choose a different name.",
            variant: "destructive",
          });
        }

        if (err.response?.status === 422) {
          return toast({
            title: "Invalid subreddit name.",
            description: "Please choose a name between 3 and 21 letters.",
            variant: "destructive",
          });
        }

        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      toast({
        title: "There was an error.",
        description: "Could not create subreddit.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      router.push(`/deliverable/view-only/${deliverableId}`);
    },
  });

  const { mutate: deleteDeliverable } = useMutation({
    mutationFn: async () => {
      const payload  = {
        data : {
         deliverableId: deliverableId,
        } 
      };
      const { data } = await axios.patch(
        `/api/deliverable/${deliverableId}/delete`,
        payload
      );
      return data as string;
    },
    onError: (err) => {
      toast({
        title: "There was an error.",
        description: "Could not create deliverable.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      router.push(`/`);
    },
  });

  return (
    <div className="ml-8 flex flex-col justify-center">
      <Card className="flex flex-col p-6 bg-white shadow-sm rounded-md space-y-2 mb-4">
        <CardHeader className="-mb-4">
          <CardTitle>
            Update Deliverable Items in{" "}
            <span className="text-blue-500"> {deliverableName} </span>
          </CardTitle>
          <CardDescription>
            Modify the status of each deliverable item.
          </CardDescription>
        </CardHeader>
        {itemStates.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-2 pl-6">
            {" "}
            {/* Removed -pt-6 */}
            <div>
              <p className="text-sm font-medium leading-none">{item.name}</p>
            </div>
            <div className="flex items-center select-wrapper">
              <select
                value={item.status}
                className="border-2 rounded-md text-gray-600 h-8 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none"
                onChange={(e) => handleStatusChange(item.id, e.target.value)}>
                {statuses.map((status) => (
                  <option key={status.id} value={status.name}>
                    {status.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="select-chevron" />{" "}
              {/* Add the chevron icon here */}
            </div>
          </div>
        ))}
        <Button
          onClick={() => updateDeliverable()}
          disabled={!hasChanges}
          className={`w-full l-6 py-2 mt-4 text-white transition-colors duration-150 bg-green-600 rounded-lg focus:shadow-outline hover:bg-green-700 ${
            !hasChanges && "opacity-50 cursor-not-allowed"
          }`}>
          Save Changes
        </Button>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Share this document</CardTitle>
          <CardDescription>
            Anyone with the link can view this document.
          </CardDescription>
          <div className="flex space-x-2">
            <Input
              value={`${currentRoute}/deliverable/view-only/${deliverableId}`}
              readOnly
            />
            <CopyButton
              valueToCopy={`${currentRoute}/deliverable/view-only/${deliverableId}`}
            />
          </div>
        </CardHeader>
      </Card>
      <div className="flex flex-col items-center ">
        <Button
          className="border-2 border-red-600 text-red-600 mt-4 hover:text-white rounded-lg"
          variant={"destructive"}
          onClick={() => deleteDeliverable()}>
          Delete Deliverable
        </Button>
      </div>
    </div>
  );
};

export default DeliverableUpdate;
