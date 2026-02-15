# EditCrafter

A powerful, customizable rich text editor built with Tiptap for React applications. Features image management with bubble menus, table support, and extensive formatting options.

[![npm version](https://img.shields.io/npm/v/editcrafter.svg)](https://www.npmjs.com/package/editcrafter)
[![License](https://img.shields.io/npm/l/editcrafter.svg)](https://github.com/yourusername/editcrafter/blob/main/LICENSE)

## Features

- 🎨 **Rich Text Formatting**: Bold, italic, underline, strikethrough, code, superscript, subscript
- 🖼️ **Enhanced Image Support**: Upload images with alignment, sizing, and metadata controls
- 📊 **Table Editor**: Full-featured table support with resizing and cell merging
- 📝 **Multiple List Types**: Bullet lists, ordered lists, and task lists
- 🎯 **Text Alignment**: Left, center, right, and justify alignment
- 🌈 **Color & Highlighting**: Text color and highlight with multiple colors
- 🔗 **Link Management**: Easy link insertion and editing
- ✨ **Typography**: Smart typography with auto-formatting
- 🎭 **Custom Image Uploader**: Integrate with your own image upload service
- 📱 **Responsive**: Mobile-friendly toolbar that adapts to screen size
- 🌓 **Theme Support**: Built-in light/dark theme toggle

## Installation

```bash
npm install editcrafter
# or
yarn add editcrafter
# or
pnpm add editcrafter
```

> **Note**: EditCrafter requires React 18+ or React 19+ as a peer dependency.

## Quick Start

### Basic Usage

```tsx
import { EditCrafter } from 'editcrafter';
import 'editcrafter/styles';

function App() {
  const handleContentChange = (html: string) => {
    console.log('Content updated:', html);
  };

  return (
    <EditCrafter
      onContentChange={handleContentChange}
      placeholder="Start writing..."
    />
  );
}
```

### With Tailwind CSS v4

Tailwind v4 changed how CSS is imported. Here's how to integrate EditCrafter:

```tsx
// app.tsx or main.tsx
import { EditCrafter } from 'editcrafter';
// Import the CSS file
import 'editcrafter/styles';

function App() {
  return (
    <div className="container mx-auto p-4">
      <EditCrafter placeholder="Write something amazing..." />
    </div>
  );
}
```

**In your Tailwind CSS file:**

```css
/* app.css or global.css */
@import "tailwindcss";
@import "editcrafter/styles";
```

### With Initial Content

```tsx
const initialContent = `
  <h1>Welcome to EditCrafter</h1>
  <p>This is a <strong>rich text editor</strong> built with Tiptap.</p>
`;

<EditCrafter
  initialValue={initialContent}
  onContentChange={handleContentChange}
/>
```

### Custom Image Uploader

EditCrafter supports custom image upload handlers:

```tsx
const uploadImage = async (
  file: File,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal
): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
    signal: abortSignal,
  });

  const data = await response.json();
  return data.url; // Return the uploaded image URL
};

<EditCrafter
  imageUploaderConfig={{
    enabledefault: true,
    defaultUploadHandler: uploadImage,
  }}
/>
```

### Custom Toolbar Button for Images

For more control over image insertion:

```tsx
import { EditCrafter } from 'editcrafter';

const CustomImageButton = ({ addImage }: { addImage: (url: string) => void }) => {
  const handleClick = async () => {
    // Your custom image selection logic
    const imageUrl = await selectImageFromGallery();
    addImage(imageUrl);
  };

  return <button onClick={handleClick}>Add Image</button>;
};

<EditCrafter
  imageUploaderConfig={{
    enabledefault: false,
    CustomToolbarButton: CustomImageButton,
  }}
/>
```

## Components

### EditCrafter

The main editor component.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialValue` | `string` | `undefined` | Initial HTML content |
| `onContentChange` | `(html: string) => void` | `undefined` | Callback when content changes |
| `wrapperClassName` | `string` | `undefined` | Custom class for wrapper div |
| `contentClassName` | `string` | `undefined` | Custom class for content area |
| `imageUploaderConfig` | `ImageUploaderType` | `undefined` | Image upload configuration |
| `placeholder` | `string` | `"Start writing here..."` | Placeholder text |

### CrafterPreview

Component for rendering saved HTML content (read-only).

```tsx
import { CrafterPreview } from 'editcrafter';

<CrafterPreview
  value={savedHtmlContent}
  className="my-preview"
/>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | HTML content to display |
| `className` | `string` | Custom class for wrapper div |

### EnhancedImage Extension

For advanced users who want to extend the editor:

```tsx
import { useEditor } from '@tiptap/react';
import { EnhancedImage } from 'editcrafter';

const editor = useEditor({
  extensions: [
    // ... other extensions
    EnhancedImage,
  ],
});

// Set image with custom attributes
editor.chain().focus().setImage({
  src: 'image.jpg',
  alt: 'Description',
  width: '500px',
  align: 'center',
}).run();

// Update alignment
editor.chain().focus().setImageAlign('left').run();

// Update width
editor.chain().focus().setImageWidth('100%').run();
```

## Styling

EditCrafter comes with pre-built CSS that includes:
- Editor layout and typography
- Toolbar styling
- Image bubble menu
- Table styling
- Theme variables for customization

### Custom Theming

Override CSS variables to customize the theme:

```css
:root {
  --tt-brand-color-500: #3b82f6;
  --tt-surface-color: #ffffff;
  --tt-text-color: #1f2937;
  --tt-border-color: #e5e7eb;
  --tt-radius-md: 0.5rem;
}

[data-theme="dark"] {
  --tt-surface-color: #1f2937;
  --tt-text-color: #f9fafb;
  --tt-border-color: #374151;
}
```

## TypeScript Support

EditCrafter is written in TypeScript and includes full type definitions.

```tsx
import type {
  EditCrafterProps,
  ImageUploaderType,
  CrafterPreviewProps,
} from 'editcrafter';
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please [file an issue](https://github.com/yourusername/editcrafter/issues).
