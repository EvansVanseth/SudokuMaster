import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App Component', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /Bienvenido a SudokuMaster/i })).toBeInTheDocument()
  })
})
