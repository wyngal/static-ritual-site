import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ListSignup from './ListSignup'

// A plain function, not vi.fn(): on this Vitest/Node pairing a vi.fn() that returns a
// rejected promise fails the test with the rejection itself, even though it is caught.
const calls: string[] = []
let outcome: () => Promise<void> = async () => {}
vi.mock('../lib/list', () => ({
  joinList: (email: string) => {
    calls.push(email)
    return outcome()
  },
}))

const SUCCESS = "YOU'RE ON THE LIST. WATCH YOUR INBOX. TELL NO ONE."

describe('ListSignup', () => {
  beforeEach(() => {
    calls.length = 0
    outcome = async () => {}
  })

  it('blocks an invalid email, keeps focus, and never calls joinList', () => {
    render(<ListSignup id="t" />)
    const input = screen.getByLabelText('Email address')
    fireEvent.change(input, { target: { value: 'not-an-email' } })
    fireEvent.click(screen.getByRole('button', { name: 'GET ON THE LIST —' }))
    expect(screen.getByRole('alert')).toHaveTextContent("THAT'S NOT AN ADDRESS. TRY AGAIN.")
    expect(input).toHaveFocus()
    expect(calls).toEqual([])
  })

  it('shows the success state after joinList resolves', async () => {
    render(<ListSignup id="t" />)
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'a@b.co' } })
    fireEvent.click(screen.getByRole('button', { name: 'GET ON THE LIST —' }))
    await waitFor(() => expect(screen.getByText(SUCCESS)).toBeInTheDocument())
    expect(calls).toEqual(['a@b.co'])
    expect(screen.queryByLabelText('Email address')).toBeNull()
  })

  it('shows a retry message and preserves the email when joinList rejects', async () => {
    outcome = () => Promise.reject(new Error('down'))
    render(<ListSignup id="t" />)
    const input = screen.getByLabelText('Email address')
    fireEvent.change(input, { target: { value: 'a@b.co' } })
    fireEvent.click(screen.getByRole('button', { name: 'GET ON THE LIST —' }))
    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('SIGNAL LOST. HIT IT AGAIN.'),
    )
    expect(input).toHaveValue('a@b.co')
  })

  it('shows the microcopy unless compact', () => {
    const { unmount } = render(<ListSignup id="a" />)
    expect(screen.getByText('No spam. No flyers. Coordinates only.')).toBeInTheDocument()
    unmount()
    render(<ListSignup id="b" compact />)
    expect(screen.queryByText('No spam. No flyers. Coordinates only.')).toBeNull()
  })
})
