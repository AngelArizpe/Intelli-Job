import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc"
import { cn } from "@/lib/utils"
import remarkGfm from "remark-gfm"


export const markdownClassNames =
  "max-w-none prose prose-natural dark:prose-invert font-sans";

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