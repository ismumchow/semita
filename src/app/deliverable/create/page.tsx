"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/Input";
import { toast } from "@/hooks/use-toast";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { DeliverablePayload } from "@/lib/validators/deliverable";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { SetStateAction, useState } from "react";

const Page = () => {
  const router = useRouter();
  const [input, setInput] = useState<string>("");
  const { loginToast } = useCustomToasts();
  const { mutate: createDeliverable, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: DeliverablePayload = {
        name: input,
      };
      const { data } = await axios.post("/api/deliverable", payload);
      return data as string;
    },
    onError: (err) => {
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
            title: "Invalid Delilverable name.",
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
      router.push(`/deliverable/${data}`);
    },
  });

  const handleCreateDeliverable = () => {
    if (/\s/.test(input)) {
      // Return a toast if the input contains any white spaces
      return toast({
        title: "Invalid Name",
        description: "Deliverable name cannot contain white spaces.",
        variant: "destructive",
      });
    }

    if (input.length < 3) {
      // Return a toast if the input is less than three characters
      return toast({
        title: "Invalid Name",
        description: "Deliverable name must be more than three characters.",
        variant: "destructive",
      });
    }

    if (input.length > 30) {
      // Return a toast if the input is more than 30 characters
      return toast({
        title: "Invalid Name",
        description: "Deliverable name must be less than 30 characters.",
        variant: "destructive",
      });
    }

    createDeliverable(); // Call the mutation to create the deliverable
  };


  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto">
      <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold"> Create a Deliverable</h1>
        </div>

        <hr className="bg-red-500 h-px" />
        <div>
          <p className="text-lg font-medium">Name</p>
          <p className="text-xs pb-2">
            Deliverable names including capitalization cannot be changed.
          </p>
          <div className="relative">
            <Input
              value={input}
              onChange={(e: { target: { value: SetStateAction<string>; }; }) => setInput(e.target.value)}
              className="pl-6"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            disabled={isLoading}
            variant="subtle"
            onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => handleCreateDeliverable()}>
            Create Deliverable
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
