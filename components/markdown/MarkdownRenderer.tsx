import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc"
import { markdownClassNames } from "./_MarkdownEditor"
import { cn } from "@/lib/utils"
import remarkGfm from "remark-gfm"

export function MarkDownRenderer({ 
    className, 
    options, 
    ...props 
}: 
    MDXRemoteProps & {className?: string
}) {
    return (
        <div className={cn(markdownClassNames, className)}>
            <MDXRemote {...props} options={{
                mdxOptions: {
                    remarkPlugins: [
                        remarkGfm,
                        ...options?.mdxOptions?.remarkPlugins ?? []
                    ],
                    ...options?.mdxOptions,
                },
            }} />
        </div>
    )
}