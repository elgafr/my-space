import { client } from "@/lib/rcp";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { InferRequestType, InferResponseType } from "hono"
import { useRouter } from "next/navigation";
import { toast } from "sonner";


type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"], 200>
type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"]>

export const useResetInviteCode = () => {
    const router = useRouter()
    const queryClient = useQueryClient()
   
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({param}) => {
            const response = await client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"]({ param })

            if(!response.ok) {
                throw new Error("Failed to reset invite code")
            }

            return await response.json()
        },
        onSuccess: ({data}) => {
            toast.success("Invite code reseted")

            router.refresh()
            queryClient.invalidateQueries({ queryKey: ["workspaces"] })
            queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] })
        },

        onError: () => {
            toast.error("Failed to reset invite code")
        }
    })


    return mutation
}