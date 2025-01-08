import { cn } from '@/lib/utils'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import { Typography } from '@tiptap/extension-typography'
import { Underline } from '@tiptap/extension-underline'
import type { Content, Editor, UseEditorOptions } from '@tiptap/react'
import { useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import * as React from 'react'
import { toast } from 'sonner'
import {
  CodeBlockLowlight,
  Color,
  FileHandler,
  HorizontalRule,
  Image,
  Link,
  ResetMarksOnEnter,
  Selection,
  UnsetAllMarks
} from '../extensions'
import { CustomTable, CustomTableCell, CustomTableRow, TableHeader } from '../extensions/table/customTable'
import { getOutput, randomId } from '../utils'
import { useThrottle } from './use-throttle'
type src = string
export type OnFileUpload = (file: File) => Promise<src>;
export interface UseEditCrafterEditorProps extends UseEditorOptions {
  value?: Content
  output?: 'html' | 'json' | 'text'
  placeholder?: string
  editorClassName?: string
  throttleDelay?: number
  onUpdate?: (content: Content) => void
  onBlur?: (content: Content) => void
  onFileUpload: OnFileUpload | null
}
const createExtensions = (placeholder: string, onFileUpload: OnFileUpload | null = null) => [
  StarterKit.configure({
    horizontalRule: false,
    codeBlock: false,
    paragraph: { HTMLAttributes: { class: 'text-node' } },
    heading: { HTMLAttributes: { class: 'heading-node' } },
    blockquote: { HTMLAttributes: { class: 'block-node' } },
    bulletList: { HTMLAttributes: { class: 'list-node' } },
    orderedList: { HTMLAttributes: { class: 'list-node' } },
    code: { HTMLAttributes: { class: 'inline', spellcheck: 'false' } },
    dropcursor: { width: 2, class: 'ProseMirror-dropcursor border' }
  }),
  Link,
  Underline,
  Image.configure({
    allowedMimeTypes: ['image/*'],
    maxFileSize: 5 * 1024 * 1024,
    allowBase64: false,
    uploadFn: onFileUpload ? async file => {
      // NOTE: This is a fake upload function. Replace this with your own upload logic.
      // This function should return the uploaded image URL.
      const src = await onFileUpload(file)
      // either return { id: string | number, src: string } or just src
      // return src;
      return { id: randomId(), src }
    } : undefined,
    onToggle(editor, files, pos) {
      editor.commands.insertContentAt(
        pos,
        files.map(image => {
          const blobUrl = URL.createObjectURL(image)
          const id = randomId()

          return {
            type: 'image',
            attrs: {
              id,
              src: blobUrl,
              alt: image.name,
              title: image.name,
              fileName: image.name
            }
          }
        })
      )
    },
    onImageRemoved({ id, src }) {
      console.log('Image removed', { id, src })
    },
    onValidationError(errors) {
      errors.forEach(error => {
        toast.error('Image validation error', {
          position: 'bottom-right',
          description: error.reason
        })
      })
    },
    onActionSuccess({ action }) {
      const mapping = {
        copyImage: 'Copy Image',
        copyLink: 'Copy Link',
        download: 'Download'
      }
      toast.success(mapping[action], {
        position: 'bottom-right',
        description: 'Image action success'
      })
    },
    onActionError(error, { action }) {
      const mapping = {
        copyImage: 'Copy Image',
        copyLink: 'Copy Link',
        download: 'Download'
      }
      toast.error(`Failed to ${mapping[action]}`, {
        position: 'bottom-right',
        description: error.message
      })
    }
  }),
  FileHandler.configure({
    allowBase64: false,
    allowedMimeTypes: ['image/*'],
    maxFileSize: 5 * 1024 * 1024,
    onDrop: onFileUpload ? (editor, files, pos) => {
      files.forEach(async file => {
        const src = await onFileUpload(file)
        editor.commands.insertContentAt(pos, {
          type: 'image',
          attrs: { src }
        })
      })
    } : undefined,
    onPaste: onFileUpload
      ? async (editor, files) => {
        for (const file of files) {
          try {
            // Upload the file and get the S3 URL
            const src = await onFileUpload(file);

            // Insert the uploaded image into the editor
            editor.commands.insertContent({
              type: 'image',
              attrs: { src },
            });
          } catch (error) {
            console.error('Image upload failed:', error);
            toast.error('Failed to upload image');
          }
        }
      }
      : undefined,
    onValidationError: errors => {
      errors.forEach(error => {
        toast.error('Image validation error', {
          position: 'bottom-right',
          description: error.reason
        })
      })
    }
  }),
  Color,
  TextStyle,
  Selection,
  Typography,
  UnsetAllMarks,
  HorizontalRule,
  ResetMarksOnEnter,
  CodeBlockLowlight,
  Placeholder.configure({ placeholder: () => placeholder }),

  CustomTable.configure({
    resizable: true,
    HTMLAttributes: {
      class: 'wp-table',
    },
  }),
  CustomTableRow,
  TableHeader,
  CustomTableCell,

]

export const useEditCrafterEditor = ({
  value,
  output = 'html',
  placeholder = '',
  editorClassName,
  throttleDelay = 0,
  onUpdate,
  onBlur,
  onFileUpload,
  ...props
}: UseEditCrafterEditorProps) => {
  const throttledSetValue = useThrottle((value: Content) => onUpdate?.(value), throttleDelay)

  const handleUpdate = React.useCallback(
    (editor: Editor) => throttledSetValue(getOutput(editor, output)),
    [output, throttledSetValue]
  )

  const handleCreate = React.useCallback(
    (editor: Editor) => {
      if (value && editor.isEmpty) {
        editor.commands.setContent(value)
      }
    },
    [value]
  )

  const handleBlur = React.useCallback((editor: Editor) => onBlur?.(getOutput(editor, output)), [output, onBlur])

  const editor = useEditor({
    extensions: createExtensions(placeholder, onFileUpload),
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        class: cn('focus:outline-none', editorClassName)
      }
    },
    onUpdate: ({ editor }) => handleUpdate(editor),
    onCreate: ({ editor }) => handleCreate(editor),
    onBlur: ({ editor }) => handleBlur(editor),
    ...props
  })

  return editor
}

export default useEditCrafterEditor
