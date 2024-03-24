import { useEffect, useState } from "react";
import "./App.css";
import { motion } from "framer-motion";
import Markdown from "marked-react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  addDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import axios from "axios";
import { LuSend } from "react-icons/lu";
import { FaFilePdf } from "react-icons/fa6";
import { Comment } from "react-loader-spinner";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";

// const notes = [
//   {
//     id: 1,
//     title: "Note-1",
//     desc: "This is **Note-1**",
//     tags: ["Tag 1", "Tag 2"],
//     color: "red",
//   },
//   {
//     id: 2,
//     title: "Note-2",
//     desc: "This is *Note-2*",
//     tags: ["Tag 2", "Tag 3"],
//     color: "blue",
//   },
//   {
//     id: 3,
//     title: "Note-3",
//     desc: "This is `Note-3`",
//     tags: ["Tag 1", "Tag 3"],
//     color: "green",
//   },
//   {
//     id: 4,
//     title: "Note-4",
//     desc: "This is ***Note-4***",
//     tags: ["Tag 2", "Tag 4"],
//     color: "yellow",
//   },
//   {
//     id: 5,
//     title: "Note-5",
//     desc: "This is ~~Note-5~~",
//     tags: ["Tag 1", "Tag 4"],
//     color: "orange",
//   },
// ];

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
  const [selectedNote, setSelectedNote] = useState(null);
  const [notes, setNotes] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currUrl, setCurrUrl] = useState("");
  const [saveNote, setSaveNote] = useState(true);
  const [gettingMsg, setGettingMsg] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translation, setTranslation] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        let notesData = JSON.parse(sessionStorage.getItem("User1"));
        if (!notesData) {
          const notesRef = collection(db, "User1");
          const snapshot = await getDocs(notesRef);

          const newNotesData = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));

          setNotes(newNotesData);
          sessionStorage.setItem("User1", JSON.stringify(newNotesData));
          console.log("done-->", newNotesData);
        } else {
          setNotes(notesData);
          console.log("done-->", notesData);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    const fetchMessages = async () => {
      try {
        const messagesRef = collection(db, "messages");
        const snapshot = await getDocs(messagesRef);
        const messagesData = snapshot.docs.map((doc) => doc.data());
        const sortedMessages = messagesData.sort(
          (a, b) => a.timestamp - b.timestamp
        );
        setMessages(sortedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchNotes();
    fetchMessages();
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSaveClick = async () => {
    try {
      if (selectedNote) {
        const timestamp = serverTimestamp();
        if (selectedNote.id) {
          // If the note already has an id, update it in the collection
          await updateDoc(doc(db, "User1", selectedNote.id), {
            title: selectedNote.title,
            desc: inputValue,
            tags: selectedNote.tags,
            color: selectedNote.color,
            timestamp: timestamp, // Include timestamp
          });
          console.log("Note updated successfully");
        } else {
          // If the note doesn't have an id, add it to the collection
          const docRef = await addDoc(collection(db, "User1"), {
            title: selectedNote.title,
            desc: inputValue,
            tags: selectedNote.tags,
            color: selectedNote.color,
            timestamp: timestamp,
          });
          const newNote = {
            ...selectedNote,
            desc: inputValue,
            id: docRef.id,
            timestamp: timestamp,
          };
          const updatedNotes = [...notes, newNote];
          setNotes(updatedNotes);
          sessionStorage.setItem("User1", JSON.stringify(updatedNotes));
        }
      }
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleNewNoteClick = () => {
    const newNote = {
      title: `Note-${notes.length + 1}`,
      desc: "",
      tags: [],
      color: "gray",
    };
    setSelectedNote(newNote);
    setInputValue("");
    setEditMode(true);
  };

  const handleUrlChange = (event) => {
    // event.preventDefault();

    // try {
    //   const url = "https://7630-1-6-74-117.ngrok-free.app/chatbot";
    //   const requestBody = { url: event.target.elements.url.value, query: 'Tell me more' };

    //   const response = await axios.post(url, requestBody);
    //   console.log('res-->', response.data);
    // } catch (error) {
    //   console.error('Error fetching data:', error);
    // }
    console.log(event.target.value);
    setCurrUrl(event.target.value);
  };

  /////////////
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const createPDF = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      const { width, height } = await pdfDoc.embedFont('Helvetica');

      notes.forEach((note, index) => {
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();

        page.drawText(note.desc, {
          x: 50,
          y: height - 100,
          size: 12,
          color: rgb(0, 0, 0),
        });
      });

      const pdfBytes = await pdfDoc.save();
      saveAs(new Blob([pdfBytes], { type: "application/pdf" }), "combined_notes.pdf");
      console.log('PDF file has been saved!');
    } catch (error) {
      console.error("Error creating PDF:", error);
    }
  };

  const handleMessage = (event) => {
    setNewMessage({ sender: "user", content: event.target.value });
  };

  const handleSubmit = async (event) => {
    if (currUrl == "") {
      setMessages([
        ...messages,
        {
          sender: "bot",
          content: "Please enter a valid URL in the prev section",
        },
      ]);
      setNewMessage({ sender: "user", content: "" });
    }
    setGettingMsg(true);
    event.preventDefault();
    let botRes = {};
    if (newMessage?.content?.trim() !== "") {
      event.preventDefault();
      const timestamp = serverTimestamp();

      try {
        const url = "https://cd2a-106-221-194-3.ngrok-free.app/chatbot";
        const requestBody = {
          url: currUrl,
          query: newMessage.content,
        };

        const response = await axios.post(url, requestBody);
        console.log("res-->", response.data);
        botRes = { sender: "bot", content: response.data.message };
        await addDoc(collection(db, "messages"), {
          sender: "user",
          content: newMessage.content,
          timestamp: timestamp,
        });
        await addDoc(collection(db, "messages"), {
          sender: "bot",
          content: response.data.message,
          timestamp: timestamp,
        });
      } catch (error) {
        botRes = { sender: "bot", content: "Something went wrong 😔" };
        console.error("Error fetching data:", error);
      }
      console.log("before set msg here");
      setMessages([
        ...messages,
        { ...newMessage, timestamp: timestamp },
        { ...botRes, timestamp: timestamp },
      ]);
      console.log("after set msg here");

      setNewMessage({ sender: "user", content: "" });
      console.log("after set msg here 2");
    }
    setGettingMsg(false);
  };

  const translate = async () => {
    try {
      const url = "https://7630-1-6-74-117.ngrok-free.app/translate"; 
      const requestBody = { text: inputValue, lang: selectedLanguage };
      const response = await axios.post(url, requestBody);
      console.log(response.data.translation);
      setTranslation(response.data.translation);
    } catch (error) {
      console.error("Error translating text:", error);
    }
  };

  const handleTranslateClick = () => {
    translate();
  };

  useEffect(() => {
    if (selectedNote) setInputValue(selectedNote.desc);
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
        <div className="w-full flex flex-row justify-between items-center">
        <div className="w-[90%] flex-row bg-white text-black rounded-md flex justify-center items-center">
          <div
            className={`w-[45%] p-2 border-r-2 border-black cursor-pointer`}
            onClick={() => setSaveNote(true)}
          >
            Notes 📝
          </div>
          <div
            className={`w-[45%] p-2 cursor-pointer`}
            onClick={() => setSaveNote(false)}
          >
            Chat 🤖
          </div>
        </div>
        <div className="p-2 flex justify-center items-center rounded-md bg-white text-black cursor-pointer" onClick={createPDF}><FaFilePdf /></div></div>
        {saveNote ? (
          <>
            <div className="w-full">
              <div className=" flex flex-row justify-center items-center gap-5 mb-2">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="p-2 border-2 border-[#e34848] rounded-lg bg-[#c7522a]"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="kn">Kannada</option>
                  <option value="ta">Tamil</option>
                  <option value="t">Telegu</option>

                </select>
                <input
                  type="text"
                  name="url"
                  value={currUrl}
                  onChange={handleUrlChange}
                  placeholder="https://example.com"
                  className="w-[300px] outline-none border-2 text-black border-slate-200 bg-white rounded-lg p-2 px-4"
                />
                <button className="p-2 px-4 border-2 border-[#e34848] rounded-lg bg-[#c7522a]">
                  Save
                </button>
              </div>
            </div>
            <div className="flex flex-row justify-center items-center gap-2">
              <div className="flex flex-row max-w-[350px] justify-start items-center overflow-x-auto gap-4 px-2">
                {notes &&
                  notes.map((ele, id) => (
                    <div
                      key={id}
                      className=" cursor-pointer relative flex items-center min-w-[100px] max-w-[150px] justify-center p-3 text-black border-slate-200 border-2 rounded-md bg-white"
                      onClick={() => setSelectedNote(ele)}
                    >
                      <div
                        className="absolute top-1 right-1 w-2 h-2 rounded-full border-slate-200 border-2"
                        style={{ backgroundColor: getColorHex(ele.color) }}
                      ></div>
                      <div className="text-xs ">{ele.title}</div>
                    </div>
                  ))}
              </div>
              <div
                onClick={() => handleNewNoteClick()}
                className="cursor-pointer flex items-center justify-center p-2 w-[80px] border-[#e34848] rounded-md bg-[#c7522a]"
              >
                New +
              </div>
            </div>
            <div className="w-full flex flex-row items-center justify-between p-2">
              {selectedNote && (
                <>
                  <div className="text-2xl font-bold">{selectedNote.title}</div>
                  <div className="flex gap-2">
                    {selectedNote.tags &&
                      selectedNote.tags.slice(0, 2).map((tag, index) => (
                        <div
                          key={index}
                          className="text-sm font-medium text-gray-500 p-1 px-3 rounded-full bg-[#b7ffb2] border-[#66ff5b]"
                        >
                          {tag}
                        </div>
                      ))}
                  </div>
                </>
              )}
            </div>
            <div className="w-[425px] h-[220px] bg-white border-black p-3 rounded-lg">
              {selectedNote ? (
                editMode ? (
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
                )
              ) : (
                <div className="flex justify-center items-center h-full text-gray-500">
                  Get started by clicking a note or creating a new one
                </div>
              )}
            </div>
            <div className="w-full flex flex-row justify-around items-center">
              <button
                onClick={() => setEditMode(!editMode)}
                disabled={!selectedNote}
                className="mr-2 p-2 px-4 border-[#e34848] border-2 rounded-md bg-[#c7522a] text-white"
              >
                {editMode ? "Preview" : "Edit"}
              </button>
                <button
                onClick={handleTranslateClick}
                className="p-2 px-4 border-[#e34848] border-2 rounded-md bg-[#c7522a] text-white"
              >
                Translate
              </button>
              <button
                onClick={handleSaveClick}
                disabled={!selectedNote}
                className="p-2 px-4 border-[#e34848] border-2 rounded-md bg-[#c7522a] text-white"
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <div className="w-[425px]">
            <div className="w-full rounded-md flex flex-col gap-2">
              <div className="h-[300px] bg-white rounded-md w-full border-2 border-black text-black overflow-y-auto p-2">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`w-full flex ${
                      message.sender == "bot" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`${
                        message.sender == "bot"
                          ? "bg-[#51ba49]"
                          : "bg-[#b7ffb2]"
                      } max-w-[225px] p-2 m-1 border-sm rounded-lg`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {gettingMsg && (
                  <div className="max-w-[225px] flex justify-start">
                    <div className="bg-[#F4442E] p-2 border-sm rounded-lg">
                      <Comment
                        visible={true}
                        height="30"
                        width="30"
                        ariaLabel="comment-loading"
                        color="#fff"
                        backgroundColor="#F4442E"
                      />
                    </div>
                  </div>
                )}
              </div>
              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-row justify-center items-center gap-2"
              >
                <input
                  type="text"
                  value={newMessage.content}
                  onChange={handleMessage}
                  placeholder="Type your message here"
                  className="h-[50px] w-[80%] bg-white text-black rounded-md p-2"
                />
                <button
                  type="submit"
                  disabled={gettingMsg}
                  className="w-[15%] h-[40px] border-[#e34848] border-2 bg-[#c7522a] text-white flex justify-center items-center"
                >
                  <LuSend />
                </button>
              </form>
            </div>
          </div>
        )}
        <div className="w-full">
          <a
            href={`https://no-clue.vercel.app/`}
            target="_blank"
            className="cursor-pointer text-slate-500 underline text-xs flex justify-center items-center gap-2"
          >
            Check out your entire collection <FaExternalLinkAlt />
          </a>
        </div>
      </motion.div>
    </>
  );
}

export default App;
