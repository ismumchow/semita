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

interface DeliverableProps {
  items: Item[];
  statuses: Status[];
  deliverableId: string;
}

const DeliverableUpdate = ({
  items,
  statuses,
  deliverableId,
}: DeliverableProps) => {
  const router = useRouter();
  const [itemStates, setItemStates] = useState<Item[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const { loginToast } = useCustomToasts();

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
      router.push(`/deliverable/view-only/${deliverableId}}`);
    },
  });

  return (
    <div className="flex flex-col p-6 bg-white shadow-md rounded-md space-y-4">
      <h2 className="text-lg font-bold text-gray-800">Deliverable Items</h2>
      {itemStates.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-2 bg-gray-100 rounded-lg">
          <p className="text-gray-700 pl-4">{item.name}</p>
          <div className="flex items-center">
            <select
              value={item.status}
              className="border border-gray-300 rounded-md text-gray-600 h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none"
              onChange={(e) => handleStatusChange(item.id, e.target.value)}>
              {statuses.map((status) => (
                <option key={status.id} value={status.name}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
      <Button
        onClick={() => updateDeliverable()}
        disabled={!hasChanges}
        className={`w-full py-2 mt-4 text-white transition-colors duration-150 bg-green-600 rounded-lg focus:shadow-outline hover:bg-green-700 ${
          !hasChanges && "opacity-50 cursor-not-allowed"
        }`}>
        Save Changes
      </Button>
    </div>
  );
};

export default DeliverableUpdate;
