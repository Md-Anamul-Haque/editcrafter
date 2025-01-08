import React, { createContext, ReactNode, useContext } from 'react';

// Define the type for the custom image uploader component
export type CustomImageUploaderType = React.ComponentType<({
    onUploads: (urls: string[]) => void;
    onUpload: (src: string) => void;
})> | null;

// Define the context type
interface ImageUploaderContextType {
    CustomImageUploader?: CustomImageUploaderType;
}

// Create the context with a default value
const ToolbarContext = createContext<ImageUploaderContextType>({
    CustomImageUploader: null,
});

interface ToolbarProviderProps {
    children: ReactNode;
    CustomImageUploader?: CustomImageUploaderType; // Optional custom uploader
}

export const ToolbarProvider: React.FC<ToolbarProviderProps> = ({
    children,
    CustomImageUploader = null,
}) => {
    return (
        <ToolbarContext.Provider value={{ CustomImageUploader }}>
            {children}
        </ToolbarContext.Provider>
    );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useToolbarContext = () => {
    const context = useContext(ToolbarContext);

    if (!context) {
        throw new Error(
            'useImageUploaderContext must be used within an ImageUploaderProvider'
        );
    }

    return context;
};
