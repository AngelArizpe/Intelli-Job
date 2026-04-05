"use client"

import { ReactNode, useEffect, useState } from "react"

export function IsBreakPoint({ 
    breakpoint,
    children, 
    otherwise
}: { 
    breakpoint: string,
    children: ReactNode,
    otherwise: ReactNode
}) {
    const IsBreakPoint = useIsBreakPoint(breakpoint)
    return IsBreakPoint ? children : otherwise
}

function useIsBreakPoint(breakpoint: string) {
    const [isBreakPoint, setIsBreakPoint] = useState(false)

    useEffect(() => {
        const controller = new AbortController()
        const media = window.matchMedia(`(${breakpoint})`)
        media.addEventListener(
            "change",
            e => {
                setIsBreakPoint(e.matches)
            },
            { signal: controller.signal }
        )
        setIsBreakPoint(media.matches)

        return () => {
            controller.abort
        }
    }, [breakpoint])

    return isBreakPoint
}