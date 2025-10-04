import React, { useState } from "react";


//component
function UiGemini() {

  //variable which is used to store chat history  like role or content
  const [messages, setMessages] = useState([]);

  // variable used to store user input 
  const [input, setInput] = useState("");

  //it is used when duplicates requests na ayee jaise ki user gimini kai answers sai pehaile koi or requests na daale
  const [loading, setLoading] = useState(false);


  //function runs after user submit the form
  async function handleSend(e) {
    e.preventDefault();

  // agar input jo h empty ho to stop ho jaye
    if (!input.trim()) return;


    //isme user represent kurta h and uska content
    const newMessage = { role: "user", content: input };

    //jabh user ka message ataa h array mai daal dai message mai and ...messages keeps existing message and newMessage is appended
    setMessages([...messages, newMessage]);

    //clears the message so user can add another request
    setInput("");
    setLoading(true);

    try {
      const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

      //fetching the api url
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          //it tells the api you are sending the data
          method: "POST",

          //it set that content is json
          headers: { "Content-Type": "application/json" },

          //json.stringify means ki data object ko string mai convert kr ruhe h
          body: JSON.stringify({
            contents: [{ parts: [{ text: input }] }],
          }),
        }
      );

      // isme string ko object mai convert kiya
      const data = await res.json();

      // isme hum api ki content ko extract kr ruhe h
      const reply =
      //its a chaning means agar suhe gya to output nahi to error
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠️ No response from Gemini";
      //isme assistant kai reply ko messages mai append kr ruhe h using prev
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } 
        //its a error handling if anything fails this code will run
    catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error: " + err.message },
      ]);
    } finally {
      // it run whether success or error taaaaki user firse re  quest bhaj sake
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-lg mx-auto bg-gray-800 rounded-xl p-4 shadow-lg">
        <h1 className="text-xl font-bold mb-4">Gemini Chat (Direct)</h1>

        <div className="h-64 overflow-y-auto mb-4 space-y-2">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-2 rounded-md ${
                m.role === "user" ? "bg-amber-950 ml-auto w-fit" : "bg-gray-700"
              }`}
            >
              {m.content}
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 rounded-md text-black"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 px-4 rounded-md"
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UiGemini;
