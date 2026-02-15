import { Image as TiptapImage } from "@tiptap/extension-image";
import { mergeAttributes } from "@tiptap/core";

export interface EnhancedImageOptions {
    /**
     * Controls if images should be rendered inline or as blocks
     * @default false
     */
    inline: boolean;
    /**
     * Controls if images should allow a base64 encoded image as src
     * @default true
     */
    allowBase64: boolean;
    /**
     * HTML attributes to add to the image element
     * @default {}
     */
    HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        enhancedImage: {
            /**
             * Set an image with optional width, height, and alignment
             */
            setImage: (options: {
                src: string;
                alt?: string;
                title?: string;
                width?: string;
                height?: string;
                align?: "left" | "center" | "right";
            }) => ReturnType;
            /**
             * Update image alignment
             */
            setImageAlign: (align: "left" | "center" | "right") => ReturnType;
            /**
             * Update image width
             */
            setImageWidth: (width: string) => ReturnType;
            /**
             * Update image alt text
             */
            setImageAlt: (alt: string) => ReturnType;
            /**
             * Update image title
             */
            setImageTitle: (title: string) => ReturnType;
        };
    }
}

/**
 * Enhanced Image extension with support for alignment, sizing, and metadata
 * Extends the base Tiptap Image extension
 */
export const EnhancedImage = TiptapImage.extend<EnhancedImageOptions>({
    name: "image",

    addOptions() {
        return {
            inline: false,
            allowBase64: true,
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        return {
            src: {
                default: null,
                parseHTML: (element) => element.getAttribute("src"),
                renderHTML: (attributes) => {
                    if (!attributes.src) {
                        return {};
                    }
                    return { src: attributes.src };
                },
            },
            alt: {
                default: null,
                parseHTML: (element) => element.getAttribute("alt"),
                renderHTML: (attributes) => {
                    if (!attributes.alt) {
                        return {};
                    }
                    return { alt: attributes.alt };
                },
            },
            title: {
                default: null,
                parseHTML: (element) => element.getAttribute("title"),
                renderHTML: (attributes) => {
                    if (!attributes.title) {
                        return {};
                    }
                    return { title: attributes.title };
                },
            },
            width: {
                default: null,
                parseHTML: (element) => element.getAttribute("width"),
                renderHTML: (attributes) => {
                    if (!attributes.width) {
                        return {};
                    }
                    return { width: attributes.width };
                },
            },
            height: {
                default: null,
                parseHTML: (element) => element.getAttribute("height"),
                renderHTML: (attributes) => {
                    if (!attributes.height) {
                        return {};
                    }
                    return { height: attributes.height };
                },
            },
            align: {
                default: null,
                parseHTML: (element) => {
                    const align = element.getAttribute("data-align");
                    return align || null;
                },
                renderHTML: (attributes) => {
                    if (!attributes.align) {
                        return {};
                    }
                    return { "data-align": attributes.align };
                },
            },
        };
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "img",
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
        ];
    },

    addCommands() {
        return {
            setImage:
                (options) =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: options,
                        });
                    },
            setImageAlign:
                (align) =>
                    ({ commands }) => {
                        return commands.updateAttributes(this.name, { align });
                    },
            setImageWidth:
                (width) =>
                    ({ commands }) => {
                        return commands.updateAttributes(this.name, { width });
                    },
            setImageAlt:
                (alt) =>
                    ({ commands }) => {
                        return commands.updateAttributes(this.name, { alt });
                    },
            setImageTitle:
                (title) =>
                    ({ commands }) => {
                        return commands.updateAttributes(this.name, { title });
                    },
        };
    },
});

export default EnhancedImage;
