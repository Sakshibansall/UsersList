import { useState } from 'react'

function Data () {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState('')
  const [strategy, setStrategy] = useState('zero-shot')

  const personaBase = {
    role: 'system',
    content: 'you are a helpfull mentor, just give direct orders and clear and act like a teacher'
  }

  const fewShots = [
    { role: 'user', content: 'how to build website' },
    {
      role: 'system',
      content: 'dont just give code just explain the process step by step'
    },
    { role: 'user', content: 'i want to find a co-founder' },
    {
      role: 'system',
      content:
        'go to hackthons, startup companies,look for people who aleady shipped projects'
    }
  ]

  const buildStrategy = () => {
    if (strategy === 'zero-shot') {
      return [personaBase, { role: 'user', content: input }]
    }
    if (strategy === 'few-shot') {
      return [personaBase, ...fewShots, { role: 'user', content: input }]
    }
    if (strategy === 'cot') {
      return [
        {
          role: 'system',
          content:
            'you are a helpfull mentor, think thoughtfully before answering , and discribe in 2 and 3 steps '
        },
        { role: 'user', content: input }
      ]
    }
    return [{ role: 'user', content: input }]
  }

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
           Authorization: `Bearer ${import.meta.env.VITE_OPEN_API_KEY}`, // 👈 check your .env key name
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: buildStrategy()
          })
        }
      )
      const data = await res.json()
      console.log('api resposne', data)
      setResponse(data.choices?.[0]?.message?.content || 'no response')
    } catch (err) {
      console.error('api error', err)
      setResponse('error connecting to api')
    }
    setInput('')
    setLoading(false)
  }

return (
  <div className='p-6'>
    <form onSubmit={handleSend} className='mb-4'>
      <select
        value={strategy}
        onChange={e => setStrategy(e.target.value)}
        className='border p-2 me-4'
      >
        <option value='zero-shot'>Zero-Shot</option>
        <option value='few-shot'>Few-Shot</option>
        <option value='cot'>Chain-of-Thought</option>
      </select>

      <input
        className='p-3 border me-4'
        type='text'
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder='Ask Groq...'
      />

      <button type='submit' className='bg-amber-400 p-3' disabled={loading}>
        {loading ? 'Loading...' : 'Send'}
      </button>
    </form>

    <div className='p-4 border rounded bg-gray-50'>
      <b>Response:</b>
      <p>{response}</p>
    </div>
  </div>
)
}
export default Data
