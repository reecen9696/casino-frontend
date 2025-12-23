class AntiDebug {
  private debuggerActive = false;
  private intervals: NodeJS.Timeout[] = [];

  constructor() {
    // Check if anti-debug is enabled via environment variable
    const enableAntiDebug = import.meta.env.VITE_ENABLE_ANTI_DEBUG !== "false";

    // Only run in production and when enabled
    if (import.meta.env.PROD && enableAntiDebug) {
      this.init();
    }
  }

  private init() {
    // Method 1: DevTools size detection
    this.intervals.push(
      setInterval(() => {
        if (this.isDevToolsOpen()) {
          this.triggerDebugger();
        }
      }, 1000)
    );

    // Method 2: Console timing detection
    this.intervals.push(
      setInterval(() => {
        const start = performance.now();
        console.clear();
        const end = performance.now();
        if (end - start > 100) {
          this.triggerDebugger();
        }
      }, 2000)
    );

    // Method 3: toString detection
    let element = document.createElement("div");
    Object.defineProperty(element, "id", {
      get: () => {
        this.triggerDebugger();
        return "debug-detected";
      },
    });
    console.log(element);

    // Method 4: Function toString detection
    this.intervals.push(
      setInterval(() => {
        if (console.log.toString().includes("native code")) {
          // Console hasn't been overridden, likely devtools open
          this.triggerDebugger();
        }
      }, 3000)
    );

    // Disable right-click
    document.addEventListener("contextmenu", (e) => e.preventDefault());

    // Disable F12, Ctrl+Shift+I, Ctrl+U
    document.addEventListener("keydown", function (e) {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "C") ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
        debugger;
      }
    });
  }

  private isDevToolsOpen(): boolean {
    const threshold = 160;
    return (
      window.outerHeight - window.innerHeight > threshold ||
      window.outerWidth - window.innerWidth > threshold
    );
  }

  private triggerDebugger() {
    if (this.debuggerActive) return;
    this.debuggerActive = true;

    // Clear console
    console.clear();

    // Show warning
    console.log(
      "%c🛡️ SECURITY WARNING",
      "color: red; font-size: 20px; font-weight: bold;"
    );
    console.log(
      "%cDeveloper tools detected! Network inspection blocked.",
      "color: orange; font-size: 14px;"
    );

    // Infinite debugger loop
    const infiniteDebugger = () => {
      debugger;
      setTimeout(infiniteDebugger, 100);
    };
    infiniteDebugger();
  }

  public destroy() {
    this.intervals.forEach((interval) => clearInterval(interval));
  }
}

// Auto-initialize only in production and when enabled
if (
  typeof window !== "undefined" &&
  import.meta.env.PROD &&
  import.meta.env.VITE_ENABLE_ANTI_DEBUG !== "false"
) {
  new AntiDebug();
}

export default AntiDebug;
