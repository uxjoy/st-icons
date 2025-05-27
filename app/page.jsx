import path from "path";
import IconLayout from "./components/IconLayout";

const App = () => {
  const baseDir = path.join(process.cwd(), "public/icons/ShareT");

  return (
    <div className="wrapper h-screen">
      <IconLayout />
    </div>
  );
};

export default App;
