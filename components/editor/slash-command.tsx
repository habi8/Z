import React, { useState, useEffect, useCallback } from 'react'
import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import { ReactRenderer } from '@tiptap/react'
import tippy, { Instance } from 'tippy.js'
import {
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Image as ImageIcon,
    Video,
    File,
    Type,
} from 'lucide-react'
import { triggerFileUpload } from './upload-handler'

// Define the command interface
interface CommandItemProps {
    title: string
    description: string
    icon: React.ElementType
    command: (editor: any) => void
}

interface CommandListProps {
    items: CommandItemProps[]
    command: (item: CommandItemProps) => void
    editor: any
    range: any
}

// Command List Component
const CommandList = React.forwardRef<any, CommandListProps>(({
    items,
    command,
}, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const selectItem = useCallback(
        (index: number) => {
            const item = items[index]
            if (item) {
                command(item)
            }
        },
        [command, items]
    )

    useEffect(() => {
        setSelectedIndex(0)
    }, [items])

    React.useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }: { event: KeyboardEvent }) => {
            if (event.key === 'ArrowUp') {
                setSelectedIndex((selectedIndex + items.length - 1) % items.length)
                return true
            }
            if (event.key === 'ArrowDown') {
                setSelectedIndex((selectedIndex + 1) % items.length)
                return true
            }
            if (event.key === 'Enter') {
                selectItem(selectedIndex)
                return true
            }
            return false
        },
    }))

    return (
        <div className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-border bg-popover p-1 shadow-md animate-in fade-in-0 zoom-in-95">
            <div className="flex flex-col gap-1 p-1">
                {items.map((item: CommandItemProps, index: number) => (
                    <button
                        key={index}
                        onClick={() => selectItem(index)}
                        className={`flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors ${index === selectedIndex
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                    >
                        <div className="flex h-5 w-5 items-center justify-center rounded-sm border border-muted-foreground/20 bg-background">
                            <item.icon className="h-3 w-3" />
                        </div>
                        <div className="flex flex-col items-start gap-0.5">
                            <span className="font-medium">{item.title}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
})

CommandList.displayName = 'CommandList'

// Suggestion configuration
const renderItems = () => {
    let component: ReactRenderer | null = null
    let popup: Instance[] | null = null

    return {
        onStart: (props: any) => {
            component = new ReactRenderer(CommandList, {
                props,
                editor: props.editor,
            })

            if (!props.clientRect) {
                return
            }

            popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
            })
        },

        onUpdate: (props: any) => {
            component?.updateProps(props)

            if (!props.clientRect) {
                return
            }

            popup?.[0].setProps({
                getReferenceClientRect: props.clientRect,
            })
        },

        onKeyDown: (props: any) => {
            if (props.event.key === 'Escape') {
                popup?.[0].hide()
                return true
            }

            // @ts-ignore
            return component?.ref?.onKeyDown(props)
        },

        onExit: () => {
            popup?.[0].destroy()
            component?.destroy()
        },
    }
}

// Commands definition
const getSuggestionItems = ({ query }: { query: string }) => {
    const items: CommandItemProps[] = [
        {
            title: 'Text',
            description: 'Just start typing with plain text.',
            icon: Type,
            command: ({ editor, range }: any) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleNode('paragraph', 'paragraph')
                    .run()
            },
        },
        {
            title: 'Heading 1',
            description: 'Big section heading.',
            icon: Heading1,
            command: ({ editor, range }: any) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode('heading', { level: 1 })
                    .run()
            },
        },
        {
            title: 'Heading 2',
            description: 'Medium section heading.',
            icon: Heading2,
            command: ({ editor, range }: any) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode('heading', { level: 2 })
                    .run()
            },
        },
        {
            title: 'Heading 3',
            description: 'Small section heading.',
            icon: Heading3,
            command: ({ editor, range }: any) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode('heading', { level: 3 })
                    .run()
            },
        },
        {
            title: 'Bullet List',
            description: 'Create a simple bullet list.',
            icon: List,
            command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).toggleBulletList().run()
            },
        },
        {
            title: 'Numbered List',
            description: 'Create a list with numbering.',
            icon: ListOrdered,
            command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).toggleOrderedList().run()
            },
        },
        {
            title: 'Image',
            description: 'Upload or embed an image.',
            icon: ImageIcon,
            command: ({ editor, range }: any) => {
                triggerFileUpload('image/*', (url) => {
                    editor.chain().focus().deleteRange(range).setResizableImage({ src: url }).run()
                })
            },
        },
        {
            title: 'Video',
            description: 'Embed a video from YouTube.',
            icon: Video,
            command: ({ editor, range }: any) => {
                const url = window.prompt('Enter YouTube URL')
                if (url) {
                    editor.chain().focus().deleteRange(range).setYoutubeVideo({ src: url }).run()
                }
            },
        },
        {
            title: 'File',
            description: 'Upload a file.',
            icon: File,
            command: ({ editor, range }: any) => {
                triggerFileUpload('*/*', (url) => {
                    const fileName = url.split('/').pop()?.split('_').slice(1).join('_') || 'File Link'
                    editor.chain().focus().deleteRange(range).insertContent(`<a href="${url}" data-type="file-link" class="text-blue-600 hover:underline cursor-pointer">${fileName}</a>`).run()
                })
            }
        }
    ]

    return items.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
    )
}

// Slash Command Extension
export const SlashCommand = Extension.create({
    name: 'slashCommand',

    addOptions() {
        return {
            suggestion: {
                char: '/',
                command: ({ editor, range, props }: any) => {
                    props.command({ editor, range })
                },
            },
        }
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ]
    },
})

export const suggestion = {
    items: getSuggestionItems,
    render: renderItems,
}

export default SlashCommand
