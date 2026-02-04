import React, { useRef, useState, useCallback, useEffect } from 'react'
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import { cn } from '@/lib/utils'

export const ResizableImageNodeView = (props: NodeViewProps) => {
    const { node, updateAttributes, selected } = props
    const imageRef = useRef<HTMLImageElement>(null)
    const [resizing, setResizing] = useState(false)
    const [cropping, setCropping] = useState(false)

    const onResizeMouseDown = useCallback((e: React.MouseEvent) => {
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

    const onCropMouseDown = useCallback((side: 'top' | 'right' | 'bottom' | 'left') => (e: React.MouseEvent) => {
        e.preventDefault()
        const startPos = side === 'left' || side === 'right' ? e.clientX : e.clientY
        const startValue = node.attrs[`crop${side.charAt(0).toUpperCase() + side.slice(1)}`]

        const onMouseMove = (e: MouseEvent) => {
            const currentPos = side === 'left' || side === 'right' ? e.clientX : e.clientY
            const diff = currentPos - startPos

            // Calculate percentage diff (roughly)
            const rect = imageRef.current?.getBoundingClientRect()
            if (!rect) return

            const dimension = side === 'left' || side === 'right' ? rect.width : rect.height
            const percentDiff = (diff / dimension) * 100

            let newValue = startValue + (side === 'right' || side === 'bottom' ? -percentDiff : percentDiff)
            newValue = Math.max(0, Math.min(45, newValue)) // Max 45% crop to avoid disappearing

            updateAttributes({
                [`crop${side.charAt(0).toUpperCase() + side.slice(1)}`]: newValue,
            })
        }

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)
        }

        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
    }, [node.attrs, updateAttributes])

    const { cropTop, cropRight, cropBottom, cropLeft, width } = node.attrs

    return (
        <NodeViewWrapper className="inline-block leading-none">
            <div className="resizable-image-container group relative inline-block leading-[0]">
                <div
                    className="overflow-hidden"
                    style={{
                        clipPath: `inset(${cropTop}% ${cropRight}% ${cropBottom}% ${cropLeft}%)`,
                    }}
                >
                    <img
                        ref={imageRef}
                        src={node.attrs.src}
                        alt={node.attrs.alt}
                        className="block h-auto"
                        style={{
                            width: typeof width === 'number' ? `${width}px` : width,
                            maxWidth: '100%',
                            transform: `scale(${1 + (cropLeft + cropRight) / 100}, ${1 + (cropTop + cropBottom) / 100})`,
                            transformOrigin: 'center'
                        }}
                    />
                </div>

                {selected && (
                    <>
                        {/* Resize Handle - Small Corner Indicator */}
                        <div className="resizable-image-handle-indicator" onMouseDown={onResizeMouseDown} />

                        {/* Crop Button Toggle */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-2 bg-popover border border-border p-1 rounded-md shadow-lg z-50">
                            <button
                                onClick={() => setCropping(!cropping)}
                                className={cn(
                                    "text-[10px] font-bold px-2 py-1 rounded transition-colors",
                                    cropping ? "bg-primary text-white" : "hover:bg-muted"
                                )}
                            >
                                {cropping ? 'CROP DONE' : 'CROP'}
                            </button>
                        </div>

                        {cropping && (
                            <>
                                <div className="crop-handle crop-handle-top" onMouseDown={onCropMouseDown('top')} />
                                <div className="crop-handle crop-handle-right" onMouseDown={onCropMouseDown('right')} />
                                <div className="crop-handle crop-handle-bottom" onMouseDown={onCropMouseDown('bottom')} />
                                <div className="crop-handle crop-handle-left" onMouseDown={onCropMouseDown('left')} />
                            </>
                        )}
                    </>
                )}
            </div>
        </NodeViewWrapper>
    )
}
