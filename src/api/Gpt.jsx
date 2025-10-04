import React, { useState } from 'react'

function gpt() {

  // used to store messages
  const [messages, setMessages] = useState([]);

  //used get input from user
  const [input, setInput] = useState("");

  //loading prevents duplicate requests
  const [loading, setLoading] = useState(false)


  // function
  async function handlesend(e) {
    if (!input.trim()) return;

    const newMessages = { role: "user", content: input };

    //isme hum existimg messages ko rukh ruhe h and sath mai jo new messages ayenge unko append kr ruhe h 
    setMessages([...messages, newMessages]);

    setInput("")
    setLoading(true);

    try {
      const API_KEY = import.meta.env.YOUR_KEY_HERE;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,

        {
          method: "POST",
          headers: { 'Content/Type': "application/json" },
          body: JSON.stringify({
            content: [{ parts: [{ text: input }] }]
          }),

        }
      );

      const data=res.json;
      const reply=data.condidates?.[0]?.content?.parts?.[0]?.text||"no response from gemini"

      setMessages((prev)=>[...prev,{role:"assistant",content:reply}])

    }
    catch(err){
      setMessages((prev)=>[...prev,{role:"assistant",content:"error"+err.message}])
    }
    finally{
      setLoading(false)
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
  )
}

export default gpt
