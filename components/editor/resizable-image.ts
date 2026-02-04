import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ResizableImageNodeView } from './resizable-image-node-view'

export interface ResizableImageOptions {
    HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        resizableImage: {
            setResizableImage: (options: {
                src: string;
                alt?: string;
                title?: string;
                width?: string | number;
                height?: string | number;
                cropTop?: number;
                cropRight?: number;
                cropBottom?: number;
                cropLeft?: number;
            }) => ReturnType
        }
    }
}

export const ResizableImage = Node.create<ResizableImageOptions>({
    name: 'resizableImage',

    addOptions() {
        return {
            HTMLAttributes: {},
        }
    },

    inline: false,
    group: 'block',
    draggable: true,

    addAttributes() {
        return {
            src: {
                default: null,
            },
            alt: {
                default: null,
            },
            title: {
                default: null,
            },
            width: {
                default: '100%',
            },
            height: {
                default: 'auto',
            },
            cropTop: {
                default: 0,
            },
            cropRight: {
                default: 0,
            },
            cropBottom: {
                default: 0,
            },
            cropLeft: {
                default: 0,
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'img[data-type="resizable-image"]',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-type': 'resizable-image' })]
    },

    addNodeView() {
        return ReactNodeViewRenderer(ResizableImageNodeView)
    },

    addCommands() {
        return {
            setResizableImage:
                (options) =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: {
                                ...options,
                                cropTop: options.cropTop ?? 0,
                                cropRight: options.cropRight ?? 0,
                                cropBottom: options.cropBottom ?? 0,
                                cropLeft: options.cropLeft ?? 0,
                            },
                        })
                    },
        }
    },
})
