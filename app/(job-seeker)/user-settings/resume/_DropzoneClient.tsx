"use client"

import { UploadDropZone } from "@/services/uploadthing/components/UploadThing"
import { useRouter } from "next/navigation"

export function DropzoneClient() {
    const router = useRouter()
    return (
        <UploadDropZone 
            endpoint="resumeUploader"
            onClientUploadComplete={() => router.refresh()}
        />
    )
}