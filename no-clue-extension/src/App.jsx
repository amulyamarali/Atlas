import { useEffect, useState } from "react";
import "./App.css";
import { motion } from "framer-motion";
import Markdown from "marked-react";
import { FaExternalLinkAlt } from "react-icons/fa";

const notes = [
  {
    id: 1,
    title: "Note-1",
    desc: "This is **Note-1**",
    tags: ["Tag 1", "Tag 2"],
    color: "red",
  },
  {
    id: 2,
    title: "Note-2",
    desc: "This is *Note-2*",
    tags: ["Tag 2", "Tag 3"],
    color: "blue",
  },
  {
    id: 3,
    title: "Note-3",
    desc: "This is `Note-3`",
    tags: ["Tag 1", "Tag 3"],
    color: "green",
  },
  {
    id: 4,
    title: "Note-4",
    desc: "This is ***Note-4***",
    tags: ["Tag 2", "Tag 4"],
    color: "yellow",
  },
  {
    id: 5,
    title: "Note-5",
    desc: "This is ~~Note-5~~",
    tags: ["Tag 1", "Tag 4"],
    color: "orange",
  },
];

function getColorHex(colorName) {
  switch (colorName) {
    case "red":
      return "#FF0000";
    case "blue":
      return "#0000FF";
    case "green":
      return "#00FF00";
    case "yellow":
      return "#FFFF00";
    case "orange":
      return "#FFA500";
    default:
      return "#FFFFFF";
  }
}

function App() {
  const [selectedNote, setSelectedNote] = useState({
    id: 1,
    title: "Note-1",
    desc: "This is Note-1",
    tags: ["Tag 1", "Tag 2"],
    color: "red",
  });
  const [inputValue, setInputValue] = useState("");
  const [editMode, setEditMode] = useState(true);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSaveClick = () => {
    // Here you can save the inputValue to a string or perform any other action
    console.log("Saved:", inputValue);
  };

  useEffect(() => {
    setInputValue(selectedNote.desc);
  }, [selectedNote]);

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
        className="flex flex-col gap-3 items-center justify-center"
      >
        <div className="w-full">
          <input
            type="text"
            placeholder="www.example.com"
            className="w-full outline-none border-2 text-black border-slate-200 bg-white rounded-lg p-2 px-4"
          />
        </div>
        <div className="flex flex-row justify-center items-center gap-2">
          <div className="flex flex-row max-w-[350px] justify-start items-center overflow-x-auto gap-4 px-2">
            {notes.map((ele, id) => (
              <div
                key={id}
                className=" cursor-pointer relative flex items-center min-w-[100px] max-w-[150px] justify-center p-3 text-black border-slate-200 border-2 rounded-md bg-white"
                onClick={()=> setSelectedNote(ele)}
              >
                <div
                  className="absolute top-1 right-1 w-2 h-2 rounded-full border-slate-200 border-2"
                  style={{ backgroundColor: getColorHex(ele.color) }}
                ></div>
                <div className="text-xs ">{ele.title}</div>
              </div>
            ))}
          </div>
          <div className="cursor-pointer flex items-center justify-center p-2 w-[80px] border-[#e34848] rounded-md bg-[#c7522a]">
            New +
          </div>
        </div>
        {/* <div className="w-full h-[400px] bg-white  p-3 flex overflow-y-scroll rounded-lg"> <div className={`text-${selectedNote.desc.length==0 ? 'slate-500' : 'black'}`}>{selectedNote.desc.length==0 ? "Nothing to Show" : selectedNote.desc }</div></div> */}
        <div className="w-full flex flex-row items-center justify-between p-2">
          <div className="text-2xl font-bold">{selectedNote.title}</div>
          <div className="flex gap-2">
            {selectedNote.tags.slice(0, 2).map((tag, index) => (
              <div key={index} className="text-sm font-medium text-gray-500 p-1 px-3 rounded-full bg-[#b7ffb2] border-[#66ff5b]">
                {tag}
              </div>
            ))}
          </div>
        </div>
        <div className="w-[425px] h-[250px] bg-white border-black p-3 rounded-lg">
          {editMode ? (
            <textarea
              value={inputValue}
              onChange={handleInputChange}
              className="w-full min-h-full max-h-full outline-none border-2 text-black border-white bg-transparent rounded-xl p-2"
              placeholder="Enter description (Markdown supported)"
            ></textarea>
          ) : (
            <div className="prose max-w-full max-h-full border-2 text-black border-white bg-transparent rounded-xl p-2 overflow-y-auto text-left">
              <Markdown>{inputValue}</Markdown>
            </div>
          )}
        </div>
        <div className="w-full flex flex-row justify-around items-center">
          <button
            onClick={() => setEditMode(!editMode)}
            className="mr-2 p-2 px-4 border-[#e34848] border-2 rounded-md bg-[#c7522a] text-white"
          >
            {editMode ? "Preview" : "Edit"}
          </button>
          <button
            onClick={handleSaveClick}
            className="p-2 px-4 border-[#e34848] border-2 rounded-md bg-[#c7522a] text-white"
          >
            Save
          </button>
        </div>
        <div className="w-full">
          <a
            href={`https://no-clue.vercel.app/`}
            target="_blank"
            className="cursor-pointer text-slate-500 underline text-xs flex justify-center items-center gap-2"
          >
            Checkout your entire collection <FaExternalLinkAlt />
          </a>
        </div>
      </motion.div>
    </>
  );
}

export default App;
