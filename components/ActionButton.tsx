"use client"

import { ComponentPropsWithRef, useTransition } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { LoadingSwap } from "./LoadingSwap";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { useRouter } from "next/navigation";

export function ActionButton({
    action,
    requiredAreYouSure = false,
    areYouSureDescription = "This action cannot be undone.",
    ...props
}: Omit<ComponentPropsWithRef<typeof Button>, "onClick"> & {
    action: () => Promise<{ error: boolean; message?: string }>, 
    requiredAreYouSure?: boolean,
    areYouSureDescription?: string
}) {
    const router = useRouter()
    const [isLoading, startTransition] = useTransition()

    function performAction() {
        startTransition(async () => {
            const data = await action()
            if (data.error) {
                toast.error(data.message ?? "Error")
            }
        })
        router.refresh()
    }

    if (requiredAreYouSure){
        return (
            <AlertDialog open={isLoading ? true : undefined}>
                <AlertDialogTrigger asChild>
                    <Button {...props} />
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>{areYouSureDescription}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            disabled={isLoading} 
                            onClick={performAction}
                        >
                            <LoadingSwap isLoading={isLoading}>
                                Yes
                            </LoadingSwap>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
    }

    return (
        <Button 
            {...props} 
            disabled={isLoading} 
            onClick={performAction}
        >
            <LoadingSwap isLoading={isLoading} className="inline-flex items-center gap-2">
                {props.children}
            </LoadingSwap>
        </Button>
    )
}