import { ApiError } from '../types'
import './ErrorDisplay.css'

interface ErrorDisplayProps {
  error: ApiError
  onRetry?: () => void
}

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3>Error</h3>
      <p className="error-message">{error.message}</p>
      {error.errors && (
        <ul className="error-list">
          {Object.entries(error.errors).map(([field, messages]) => (
            <li key={field}>
              <strong>{field}:</strong> {messages.join(', ')}
            </li>
          ))}
        </ul>
      )}
      {onRetry && (
        <button className="retry-button" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  )
}
