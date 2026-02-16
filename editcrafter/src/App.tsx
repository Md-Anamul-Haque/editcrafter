import "editcrafter/styles.css";
import { useState } from "react";
import { CrafterPreview, EditCrafter } from "./index";
// import { EditCrafter } from "editcrafter";
function App() {
  const [value, setValue] = useState<string>("");
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
      }}
    >
      <EditCrafter
        initialValue={value}
        onContentChange={(content) => setValue(content)}
        imageUploaderConfig={{
          CustomToolbarButton: ({ addImage }) => {
            return (
              <div>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        addImage(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
            );
          },
        }}
      />
      <CrafterPreview value={value} />
    </div>
  );
}

export default App;
