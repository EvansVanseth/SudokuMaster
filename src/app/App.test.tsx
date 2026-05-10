import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App Component', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByText(/SudokuMaster/i)).toBeInTheDocument()
  })
})
