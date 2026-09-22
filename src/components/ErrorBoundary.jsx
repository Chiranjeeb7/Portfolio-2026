import { Component } from "react";
import { RotateCcw } from "lucide-react";
import styles from "./ErrorBoundary.module.css";

// Error boundaries must be class components — no hooks equivalent exists.
// Scoped around individual experimental/interactive sections (rather than
// the whole app) so a crash in one — e.g. the canvas's pointer/gesture
// math — degrades to a small inline fallback instead of taking the entire
// page to a blank screen that needs a hard reload.
//
// `silent` renders nothing on a crash (for purely decorative layers, like the
// intro loader, that should just step aside); `onError` lets the owner
// clean up after it (e.g. unlock scroll the crashed layer was holding).
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Section crashed:", error, info);
    this.props.onError?.(error);
  }

  reset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.silent) return null;
      return (
        <div className={`container ${styles.fallback}`}>
          <p className={styles.message}>{this.props.message || "This section hit a snag."}</p>
          <button type="button" className={styles.retryBtn} onClick={this.reset}>
            <RotateCcw size={13} /> try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
