import "./App.css";
import { EditCrafter } from "./components/edit-crafter/EditCrafter";
// import { EditCrafter } from "editcrafter";
function App() {
  return (
    <EditCrafter
      imageUploaderConfig={{
        CustomToolbarButton: ({ addImage }) => {
          return <div>
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
          </div>;
        },
      }}
    />
  );
}

export default App;
