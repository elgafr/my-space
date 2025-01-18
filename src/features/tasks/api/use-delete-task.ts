import { client } from "@/lib/rcp";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { InferRequestType, InferResponseType } from "hono"
import { useRouter } from "next/navigation";
import { toast } from "sonner";


type ResponseType = InferResponseType<typeof client.api.tasks[":taskId"]["$delete"], 200>
type RequestType = InferRequestType<typeof client.api.tasks[":taskId"]["$delete"]>

export const useDeleteTask = () => {
    const queryClient = useQueryClient()
    const router = useRouter()

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ param }) => {
            const response = await client.api.tasks[":taskId"]["$delete"]({ param })

            if (!response.ok) {
                throw new Error("Failed to delete task")
            }

            return await response.json()
        },
        onSuccess: ({ data }) => {
            toast.success("Task deleted")

            router.refresh()
            queryClient.invalidateQueries({ queryKey: ["tasks"] })
            queryClient.invalidateQueries({ queryKey: ["task", data.$id] })

        },

        onError: () => {
            toast.error("Failed to delete task")
        }
    })


    return mutation
}