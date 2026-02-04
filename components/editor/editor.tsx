
'use client'

import { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Youtube from '@tiptap/extension-youtube'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { FileLink } from './file-link-extension'
import { ResizableImage } from './resizable-image'
import { SlashCommand, suggestion } from './slash-command'
import { cn } from '@/lib/utils'


interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
    editable?: boolean
}

export function RichTextEditor({ content, onChange, editable = true }: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            ResizableImage,
            Youtube.configure({
                controls: false,
            }),
            Link.configure({
                openOnClick: false,
            }),
            Placeholder.configure({
                placeholder: 'Type "/" for commands...',
            }),
            FileLink,
            SlashCommand.configure({
                suggestion: suggestion,
            }),
        ],
        content: content,
        editable: editable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none max-w-none min-h-[300px] p-4',
            },
        },
    })

    useEffect(() => {
        const handleInsertImage = (e: any) => {
            const { url } = e.detail
            if (editor && url) {
                editor.chain().focus().setResizableImage({ src: url }).run()
            }
        }

        window.addEventListener('editor-insert-image', handleInsertImage)
        return () => window.removeEventListener('editor-insert-image', handleInsertImage)
    }, [editor])

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            // Only update if content is drastically different to avoid cursor jumps on every keystroke
            // For a real app, you'd handle this better with JSON collaboration.
            // Here we rely on the parent only setting content initially mostly.
            // But if parent updates usage:
            if (editor.isEmpty && content) {
                editor.commands.setContent(content)
            }
        }
    }, [content, editor])

    if (!editor) {
        return null
    }

    return (
        <div className="w-full relative border rounded-md border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            <EditorContent editor={editor} />
        </div>
    )
}
