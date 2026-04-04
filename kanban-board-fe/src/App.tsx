import { useState } from "react";
import Button from "@mui/material/Button";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <section
        className="
            flex flex-col gap-6.25 justify-center items-center grow 
            max-[1024px]:gap-4.5 max-[1024px]:px-5 max-[1024px]:pt-8 max-[1024px]:pb-6"
      >
        <div>
          <h1 className="text-3xl font-bold underline bg-red-500 text-white p-4 rounded-lg">
            Hello world!
          </h1>
        </div>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </Button>
      </section>
    </>
  );
}

export default App;
