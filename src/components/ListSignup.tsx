import { FormEvent, useRef, useState } from 'react'
import { joinList } from '../lib/list'

interface Props {
  id: string
  compact?: boolean
}

type Status = 'idle' | 'submitting' | 'done'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ListSignup({ id, compact = false }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!EMAIL.test(email.trim())) {
      setError("THAT'S NOT AN ADDRESS. TRY AGAIN.")
      inputRef.current?.focus()
      return
    }
    setError('')
    setStatus('submitting')
    try {
      await joinList(email.trim())
      setStatus('done')
    } catch {
      setStatus('idle')
      setError('SIGNAL LOST. HIT IT AGAIN.')
    }
  }

  if (status === 'done') {
    return (
      <p role="status" className="font-mono text-white text-xs sm:text-sm uppercase tracking-[0.2em]">
        YOU'RE ON THE LIST. WATCH YOUR INBOX. TELL NO ONE.
      </p>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="max-w-xl">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          ref={inputRef}
          id={`list-email-${id}`}
          type="email"
          aria-label="Email address"
          aria-invalid={error !== ''}
          placeholder="your@email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-transparent border border-white/30 focus:border-white outline-none px-4 py-3 font-mono text-white text-sm placeholder:text-white/30 transition-colors duration-300"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="border border-white bg-white text-black px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] hover:bg-transparent hover:text-white disabled:opacity-50 transition-colors duration-300"
        >
          {status === 'submitting' ? 'TRANSMITTING…' : 'GET ON THE LIST —'}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-3 font-mono text-[#f0f] text-[10px] sm:text-xs uppercase tracking-[0.2em]">
          {error}
        </p>
      )}
      {!compact && (
        <p className="mt-3 text-white/40 text-[10px] sm:text-xs font-light">
          No spam. No flyers. Coordinates only.
        </p>
      )}
    </form>
  )
}
