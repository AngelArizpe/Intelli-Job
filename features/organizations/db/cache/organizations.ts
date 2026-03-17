import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getOrganizationGlobalTag() {
    return getGlobalTag("organizations")
}

export function getOrganizationIdTag(id: string) {
    return getIdTag("organizations", id)
}

export function revalidateOrganizationsCache(id: string) {
    revalidateTag(getOrganizationGlobalTag(), "max")
    revalidateTag(getOrganizationIdTag(id), "max")
}