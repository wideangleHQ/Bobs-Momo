import React from "react"

type State = {
  error: Error | null
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Render crash:", error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-brand-beige p-6 font-mono text-brand-charcoal">
          <h1 className="mb-4 text-xl font-bold">Render error</h1>
          <pre className="whitespace-pre-wrap text-xs">{this.state.error.stack}</pre>
        </div>
      )
    }

    return this.props.children
  }
}
