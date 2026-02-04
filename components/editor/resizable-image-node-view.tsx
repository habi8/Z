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
        <NodeViewWrapper className={cn("inline-block leading-none", selected && "outline-2 outline-primary outline")}>
            <div className="resizable-image-container group relative">
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
                        {/* Resize Handle */}
                        <div className="resizable-image-handle" onMouseDown={onResizeMouseDown} />

                        {/* Crop Button Toggle */}
                        <button
                            onClick={() => setCropping(!cropping)}
                            className="absolute -top-10 left-0 bg-primary text-white text-xs px-2 py-1 rounded shadow-lg z-10"
                        >
                            {cropping ? 'Done Cropping' : 'Crop'}
                        </button>

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
