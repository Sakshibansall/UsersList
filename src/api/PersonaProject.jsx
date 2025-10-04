// // persona-gpt.js
// // Usage: npm install openai dotenv
// //        node persona-gpt.js
// import 'dotenv/config';
// import OpenAI from 'openai';

// const client = new OpenAI({ apiKey: process.env.VITE_GOOGLE_API_KEY
//  });

// /**
//  * Configure the persona and system prompt.
//  * Replace PUBLIC_FIGURE and PUBLIC_FIGURE_BRIEF with the person you want.
//  *
//  * IMPORTANT: The assistant is explicitly declared fictional/not the real person.
//  */

// const PUBLIC_FIGURE = "Ada Example"; // change to the public figure name
// const PUBLIC_FIGURE_BRIEF = `Ada Example is a fictionalized educational persona inspired by a well-known tech leader:
// - Focuses on product design, developer experience, and clear explanations.
// - Uses concise, interview-friendly answers with code examples when relevant.`;

// // Pull relevant "memory" / context from your Model Set (inserted from your previous context)
// const USER_MEMORY_SUMMARY = `
// User profile (from saved memory):
// - Preferred name: AI-Enginner (software engineer learning GenAI)
// - Experience: 7 years front-end (React, Angular); learning GenAI
// - Wants deep interview-style explanations and examples for frontend & GenAI topics.
// `;

// // System prompt builds persona + guardrails + memory
// const systemPrompt = `
// You are a conversational assistant that adopts a fictional, educational persona "in the style of" ${PUBLIC_FIGURE}.
// *Crucial:* This is a fictionalized persona for education and simulation only. It does NOT claim to be the actual ${PUBLIC_FIGURE}.
// Persona summary:
// ${PUBLIC_FIGURE_BRIEF}

// Guidelines for responses:
// - Always clearly remind the user that this is a fictionalized persona if the user asks about real opinions or first-person claims.
// - Prefer concise, interview-friendly answers with code examples, step-by-step reasoning, and references when requested.
// - When asked for controversial or legal/medical/financial advice, refuse and provide safer alternatives.

// User memory (use to tailor answers):
// ${USER_MEMORY_SUMMARY}

// Few-shot example (how to answer):
// User: "How would you explain hooks in Angular for an interview?"
// Assistant: "Short summary (2-3 lines), then bullet list of lifecycle hooks with interview-style points: when used, common pitfalls, short code example."

// Now wait for the user's query.
// `;

// /**
//  * Make a chat-like request (Responses-style or chat completions).
//  * Here we use Chat Completions style for clarity; you can adapt to the Responses API.
//  */
// async function run() {
//   try {
//     const messages = [
//       { role: 'system', content: systemPrompt },
//       // optional: some persona priming examples
//       {
//         role: 'user',
//         content: `Act as the persona: give a short intro about yourself and confirm you are a fictional persona.`
//       }
//     ];

//     const response = await client.chat.completions.create({
//       model: 'gpt-4o',        // or 'gpt-4o-mini', 'gpt-4o-realtime-preview' depending on availability
//       messages,
//       max_tokens: 600,
//       temperature: 0.2,
//       // You can enable streaming in production or use the Responses API for richer tool use.
//     });

//     // The SDK returns choices -> output_text or message depending on the version.
//     // Print the assistant's reply:
//     const assistantReply = response.choices?.[0]?.message?.content ?? response.choices?.[0]?.text;
//     console.log("Assistant reply:\n", assistantReply);
//   } catch (err) {
//     console.error("OpenAI error:", err);
//   }
// }

// run();

//ITS FRONTEND  using open api

// import OpenAI from 'openai';
    

///ITS FRONTEND  using groq api
import { useState } from 'react'

function UiGroq () {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState('')

  const handleSend = async e => {
    e.preventDefault()

    if (!input.trim()) return
    setLoading(true)
    try {
      const res = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${import.meta.env.YOUR_KEY_HERE}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant', // ✅ choose Groq model
            messages: [{ role: 'user', content: input }]
          })
        }
      )

      const data = await res.json()
      console.log('Groq API response:', data)

      setResponse(data.choices?.[0]?.message?.content || '⚠️ No response')
    } catch (err) {
      console.error('Error:', err)
      setResponse('Error connecting to Groq API.')
    }
    setInput('')
    setLoading(false)
  }

  return (
    <div>
      <form onSubmit={handleSend}>
        <input
          className='p-5 border me-4'
          type='text'
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder='Ask Groq...'
        />
          
        <button type='submit' className='bg-amber-400 p-5'>
          {loading ? '...' : 'Send'}
        </button>
      </form>
      <p>{input}</p>
      <p>{response}</p>
    </div>
  )
}

export default UiGroq
