import "./App.css";
import { motion } from "framer-motion";

const notes = [
  {
    id: 1,
    title: "Note-1",
    desc: "This is Note-1",
    tags: ["Tag 1", "Tag 2"],
    color: "red",
  },
  {
    id: 2,
    title: "Note-2",
    desc: "This is Note-2",
    tags: ["Tag 2", "Tag 3"],
    color: "blue",
  },
  {
    id: 3,
    title: "Note-3",
    desc: "This is Note-3",
    tags: ["Tag 1", "Tag 3"],
    color: "green",
  },
  {
    id: 4,
    title: "Note-4",
    desc: "This is Note-4",
    tags: ["Tag 2", "Tag 4"],
    color: "yellow",
  },
  {
    id: 5,
    title: "Note-5",
    desc: "This is Note-5",
    tags: ["Tag 1", "Tag 4"],
    color: "orange",
  },
];

function App() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="flex flex-col gap-4 items-center justify-center p-2 "
      >
        <div className="w-full border-2 border-black rounded-md">
          <input
            type="text"
            placeholder="www.example.com"
            className="outline-none border-2 border-black rounded-md"
          />
        </div>
        <div className="flex flex-row justify-start items-center overflow-x-auto gap-4">
          {notes.map((ele, id) => {
            return (
              <div
                key={id}
                className="flex items-center justify-center p-2 px-4 border-[#4e7665] border-2 rounded-xl bg-[#74a892]"
              >
                {" "}
                {ele.title}{" "}
              </div>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}

export default App;
