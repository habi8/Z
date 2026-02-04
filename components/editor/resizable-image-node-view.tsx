import React, { useRef, useState, useCallback, useEffect } from 'react'
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import { cn } from '@/lib/utils'

export const ResizableImageNodeView = (props: NodeViewProps) => {
    const { node, updateAttributes, selected } = props
    const imageRef = useRef<HTMLImageElement>(null)
    const [resizing, setResizing] = useState(false)
    const [aspectRatio, setAspectRatio] = useState(1)

    useEffect(() => {
        if (imageRef.current) {
            setAspectRatio(imageRef.current.naturalWidth / imageRef.current.naturalHeight || 1)
        }
    }, [node.attrs.src])

    const onMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        setResizing(true)

        const startX = e.clientX
        const startWidth = imageRef.current?.width || 0

        const onMouseMove = (e: MouseEvent) => {
            const currentX = e.clientX
            const diffX = currentX - startX
            const newWidth = Math.max(100, startWidth + diffX)

            updateAttributes({
                width: newWidth,
            })
        }

        const onMouseUp = () => {
            setResizing(false)
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)
        }

        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
    }, [updateAttributes])

    return (
        <NodeViewWrapper className={cn("inline-block leading-none", selected && "outline-2 outline-primary outline")}>
            <div className="resizable-image-container group">
                <img
                    ref={imageRef}
                    src={node.attrs.src}
                    alt={node.attrs.alt}
                    className="block h-auto"
                    style={{
                        width: typeof node.attrs.width === 'number' ? `${node.attrs.width}px` : node.attrs.width,
                        maxWidth: '100%'
                    }}
                />

                {selected && (
                    <div
                        className="resizable-image-handle"
                        onMouseDown={onMouseDown}
                    />
                )}
            </div>
        </NodeViewWrapper>
    )
}
