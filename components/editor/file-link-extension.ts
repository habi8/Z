import { Node, mergeAttributes } from '@tiptap/core'

export const FileLink = Node.create({
    name: 'fileLink',

    group: 'inline',

    inline: true,

    selectable: true,

    draggable: true,

    atom: true,

    addAttributes() {
        return {
            href: {
                default: null,
            },
            target: {
                default: '_blank',
            },
            class: {
                default: 'text-blue-600 hover:underline cursor-pointer',
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'a[data-type="file-link"]',
            },
        ]
    },

    renderHTML({ HTMLAttributes, node }) {
        return ['a', mergeAttributes(HTMLAttributes, { 'data-type': 'file-link' }), 0]
    },

    addKeyboardShortcuts() {
        return {
            Backspace: () => this.editor.commands.deleteSelection(),
        }
    },
})
