"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  errorMessage: string | null;
}

/**
 * Component-level Error Boundary to ensure failures in individual charts,
 * widgets, or calculations never crash the entire page.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error?.message || "An unexpected rendering error occurred.",
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log safely for developers without exposing sensitive user information
    console.error("[India Green Grid Boundary caught error]:", {
      name: error?.name,
      message: error?.message,
      componentStack: errorInfo?.componentStack?.slice(0, 300),
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full rounded-xl border border-ivory-300 bg-ivory-50 p-6 text-center space-y-3 shadow-warm my-2">
          <div className="w-10 h-10 rounded-full bg-saffron-100 text-saffron-800 mx-auto flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-saffron-700" />
          </div>
          <div className="max-w-md mx-auto">
            <h4 className="text-sm font-bold text-navy-900">
              {this.props.fallbackTitle || "Information Temporarily Unavailable"}
            </h4>
            <p className="text-xs text-navy-700 mt-1 leading-relaxed">
              {this.props.fallbackMessage ||
                "This visualization or calculation encountered a temporary issue. Last validated statutory snapshot data is maintained across the platform."}
            </p>
          </div>
          <button
            type="button"
            onClick={this.handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-ivory-300 text-navy-800 hover:bg-ivory-100 shadow-2xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-teal-700" />
            <span>Try Reloading Component</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
