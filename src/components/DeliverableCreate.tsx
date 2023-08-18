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
import { useRouter } from "next/navigation";
import { DeliverableNamePayload } from "@/lib/validators/deliverable";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

interface DeliverableCreateProps {
  deliverableName: Deliverable["name"];
  deliverableId: Deliverable["id"];
}

const DeliverableCreate: FC<DeliverableCreateProps> = ({
  deliverableName,
  deliverableId,
}) => {
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
      const { data } = await axios.post(
        `/api/deliverable/${deliverableId}`,
        payload
      );
      return data as string;
    },
    onError: (err: { response: { status: number } }) => {
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
    <Card>
      {!itemsPushed ? (
        <>
          <div className="bg-white rounded-lg p-5">
            {!isAdding ? (
              <div>
                <CardHeader>
                  <CardTitle>
                    No items in{" "}
                    <span className="text-blue-400">{deliverableName}</span>,
                    yet.
                  </CardTitle>
                  <CardDescription>Be the first to add one!</CardDescription>
                </CardHeader>
                <div className="flex flex-col justify-center">
                  <Button
                    onClick={() => setIsAdding(true)}
                    variant="default"
                    className="mt-4 ml-4 mx-12 bg-transparent border-2 text-green-300 border-green-300 hover:bg-green-500 hover:text-white">
                    Add an item
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <CardHeader>
                  <CardTitle>
                    Add items to{" "}
                    <span className="text-blue-400">{deliverableName}</span>
                  </CardTitle>
                  <CardDescription>
                    Add items to the deliverable.
                  </CardDescription>
                </CardHeader>
                {newItems.map((item, index) => (
                  <div
                    className={`flex justify-between items-center py-2 px-4  ${
                      index !== newItems.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }`}
                    key={index}>
                    <p className="text text-muted-foreground ml-6">
                      {item}
                    </p>
                    <Trash
                      onClick={() => handleDelete(item)}
                      className="cursor-pointer text-red-500 hover:text-red-600 mr-4"
                    />
                  </div>
                ))}
                <div className="flex justify-between items-center mt-2 ml-2 p-2">
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
          <div className="px-4">
            <CardHeader>
              <CardTitle>
                Add statuses to{" "}
                <span className="text-blue-400">{deliverableName}</span>
              </CardTitle>
              <CardDescription>
                Add statuses to the deliverable.
              </CardDescription>
            </CardHeader>

            {newStatuses.map((status, index) => (
              <div
                className={`flex justify-between items-center py-2 px-2 ${
                  index !== newStatuses.length - 1
                    ? "border-b border-gray-200"
                    : ""
                }`}
                key={index}>
                 <p className="text text-muted-foreground ml-6">
                  {status}
                </p>
                <Trash
                  onClick={() => handleStatusDelete(status)}
                  className="cursor-pointer text-red-500 hover:text-red-600 mr-4"
                />
              </div>
            ))}
            <div className="flex justify-between items-center mt-2 p-4">
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
            <div className="flex justify-center mt-5 mb-2">
              <Button onClick={() => createDeliverable()} variant={"green"}>
                {" "}
                Finish Deliverable{" "}
              </Button>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default DeliverableCreate;
