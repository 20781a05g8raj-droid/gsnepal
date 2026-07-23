import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-2xl mx-auto my-12 bg-white rounded-3xl border border-rose-200 shadow-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-xl font-bold">
            ⚠️
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Admin ERP Portal Recovered</h2>
          <p className="text-xs text-slate-600">
            An unexpected error occurred: <span className="font-mono text-rose-600">{this.state.error?.toString()}</span>
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              Try Again
            </button>
            <button
              onClick={this.handleReset}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
            >
              Reset Data & Reload Admin ERP
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
