import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ResizableImageNodeView } from './resizable-image-node-view'

export interface ResizableImageOptions {
    HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        resizableImage: {
            setImage: (options: { src: string; alt?: string; title?: string; width?: string | number; height?: string | number }) => ReturnType
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
            setImage:
                (options) =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: options,
                        })
                    },
        }
    },
})
