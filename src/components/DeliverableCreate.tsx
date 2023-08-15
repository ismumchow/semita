"use client";
import { Deliverable } from "@prisma/client";
import { FC, useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "@/components/Input";
import { Trash } from "lucide-react";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {useRouter} from "next/navigation";
import { DeliverableNamePayload } from "@/lib/validators/deliverable";


interface DeliverableCreateProps {
  deliverableName: Deliverable["name"];
  deliverableId: Deliverable["id"];
}

const DeliverableCreate: FC<DeliverableCreateProps> = ({ deliverableName, deliverableId }) => {
  const [input, setInput] = useState<string>("");
  const [statusInput, setStatusInput] = useState<string>("");
  const [newItems, setNewItems] = useState<string[]>([]);
  const [newStatuses, setNewStatuses] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [itemsPushed, setItemsPushed] = useState<boolean>(false);
  const router = useRouter();


  const { loginToast } = useCustomToasts();

  const { mutate: createDeliverable, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: DeliverableNamePayload = {
        deliverableId: deliverableId,
        deliverableItems: newItems,
        deliverableStatuses: newStatuses,
      };
      const { data } = await axios.post(`/api/deliverable/${deliverableId}`, payload);
      return data as string;
    },
    onError: (err: { response: { status: number; }; }) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "Deliverable already exists.",
            description: "Please choose a different name.",
            variant: "destructive",
          });
        }

        if (err.response?.status === 422) {
          return toast({
            title: "Invalid deliverable name.",
            description: "Please choose a name between 3 and 30 letters.",
            variant: "destructive",
          });
        }

        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      toast({
        title: "There was an error.",
        description: "Could not create deliverable.",
        variant: "destructive",
      });
    },
    onSuccess: (data: any) => {
      router.push(`/`);
    },
  });


  const handleAdd = () => {
    setNewItems([...newItems, input]);
    setInput("");
  };

  const handleStatusAdd = () => {
    setNewStatuses([...newStatuses, statusInput]);
    setStatusInput("");
  };

  const handleDelete = (itemToDelete: string) => {
    setNewItems(newItems.filter((item) => item !== itemToDelete));
  };

  const handleStatusDelete = (statusToDelete: string) => {
    setNewStatuses(newStatuses.filter((status) => status !== statusToDelete));
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-5">
      {!itemsPushed ? (
        <>
          <div className="bg-white  rounded-lg p-5">
            {!isAdding ? (
              <div className="flex flex-col items-center justify-center py-5 space-y-4">
                <p className="text-xl font-medium text-gray-700 text-center">
                  No items in <span className="text-blue-400">{deliverableName}</span>, yet.
                  Be the first to add one!
                </p>
                <Button
                  onClick={() => setIsAdding(true)}
                  variant="default"
                  className="mt-4">
                  Add an item
                </Button>
              </div>
            ) : (
              <div>
                {newItems.map((item, index) => (
                  <div
                    className={`flex justify-between items-center py-2 ${
                      index !== newItems.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }`}
                    key={index}>
                    <p className="text-xl font-medium text-gray-700 flex-grow pl-2">
                      {item}
                    </p>
                    <Trash
                      onClick={() => handleDelete(item)}
                      className="cursor-pointer text-red-500 hover:text-red-600 mr-4"
                    />
                  </div>
                ))}
                <div className="flex justify-between items-center mt-2">
                  <Input
                    placeholder="Enter item name"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <Button
                    variant="default"
                    className="ml-3"
                    onClick={handleAdd}>
                    Add
                  </Button>
                </div>
              </div>
            )}
            {newItems.length >= 1 && (
              <div className="flex justify-center mt-5">
                <Button onClick={() => setItemsPushed(true)} variant={"green"}>
                  Add Items to Deliverable
                </Button>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div>
            <h2 className="text-xl font-medium text-gray-700 text-center mb-5">
              Add statuses to the deliverable!
            </h2>
            {newStatuses.map((status, index) => (
              <div
                className={`flex justify-between items-center py-2 ${
                  index !== newStatuses.length - 1
                    ? "border-b border-gray-200"
                    : ""
                }`}
                key={index}>
                <p className="text-xl font-medium text-gray-700 flex-grow pl-2">
                  {status}
                </p>
                <Trash
                  onClick={() => handleStatusDelete(status)}
                  className="cursor-pointer text-red-500 hover:text-red-600 mr-4"
                />
              </div>
            ))}
            <div className="flex justify-between items-center mt-2">
              <Input
                placeholder="Enter status"
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value)}
              />
              <Button
                variant="default"
                className="ml-3"
                onClick={handleStatusAdd}>
                Add Status
              </Button>
            </div>
          </div>
          {newStatuses.length >= 1 && (
            <div className="flex justify-center mt-5">
              <Button onClick={ () => createDeliverable()} variant={"green"}> Finish Deliverable </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DeliverableCreate;
