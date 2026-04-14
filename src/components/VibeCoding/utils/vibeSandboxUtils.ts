/**
 * Vibe Engine Sandbox Utilities
 * 
 * This file contains the logic for generating the standalone sandbox environment
 * that runs in the Vife Studio iframe. It includes console bridging,
 * CDN loading, and the runtime VFS compiler.
 */

/**
 * Generates the console proxy script that bridges the iframe's console
 * logs to the parent Studio window.
 */
export const generateConsoleProxyScript = () => `
  <script>
    // Extremely early console bridge to catch Babel load errors
    window.onerror = function(msg, url, line) { 
      window.parent.postMessage({ type: "SANDBOX_CONSOLE", level: "error", payload: "Global Run Error: " + msg + " at line " + line }, "*"); 
      return false; 
    };
    const cBridge = (lvl) => (...args) => {
      window.parent.postMessage({ type: "SANDBOX_CONSOLE", level: lvl, payload: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') }, "*");
    };
    window.console.log = cBridge("log");
    window.console.warn = cBridge("warn");
    window.console.error = cBridge("error");
    console.log("Sandbox VM Booting...");
  </script>
`;

/**
 * The core logic for the Virtual File System (VFS) compiler.
 * This script runs inside the sandbox to transpile and execute modules.
 */

// Maximum allowed compiled output size per module (500 KB)
const MAX_COMPILED_SIZE = 500_000;

const VFS_COMPILER_LOGIC = `
  (function() {
    let vfs = {};
    let modules = {};
    let root = null;

    // Safe error renderer — never sets innerHTML with user-controlled strings
    function renderError(title, err) {
      var box = document.createElement('div');
      box.className = 'err-box';
      var heading = document.createElement('b');
      heading.textContent = title;
      var br1 = document.createElement('br');
      var msg = document.createElement('span');
      msg.textContent = err && err.message ? err.message : String(err);
      var br2 = document.createElement('br');
      var br3 = document.createElement('br');
      var stack = document.createElement('small');
      stack.textContent = err && err.stack ? err.stack : '';
      box.appendChild(heading);
      box.appendChild(br1);
      box.appendChild(msg);
      box.appendChild(br2);
      box.appendChild(br3);
      box.appendChild(stack);
      document.body.textContent = '';
      document.body.appendChild(box);
    }

    function simulateRequire(id) {
      if (id === 'react') return window.React;
      if (id === 'react-dom') return window.ReactDOM;
      if (id === 'react-dom/client') return window.ReactDOM;

      // Minimal Lucide-React Mock for Icons
      if (id === 'lucide-react') {
        return new Proxy({}, { get: (target, prop) => (props) =>
          window.React.createElement("svg", { width: props.size||24, height: props.size||24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
            window.React.createElement("circle", { cx: 12, cy: 12, r: 10 }),
            window.React.createElement("text", { x: "50%", y: "50%", textAnchor: "middle", dy: ".3em", fontSize: "10", stroke: "none", fill: "currentColor" }, prop.charAt(0))
          )
        });
      }

      let path = id.replace(/^\\.\\//, '').replace(/^\\//, '');
      if (!path.startsWith('src/')) path = 'src/' + path;
      if (!path.endsWith('.tsx') && !path.endsWith('.ts') && !path.endsWith('.css') && !path.endsWith('.json')) {
        if (vfs[path + '.tsx']) path += '.tsx';
        else if (vfs[path + '.ts']) path += '.ts';
      }

      if (modules[path]) return modules[path].exports;
      if (!vfs[path]) throw new Error("Cannot find module: " + id + " (resolved to " + path + ")");

      console.log("Compiling: " + path);
      const module = { exports: {} };
      modules[path] = module;

      if (path.endsWith('.css')) return module.exports;

      const compiled = Babel.transform(vfs[path], {
        filename: path,
        presets: [
          ['env', { modules: 'commonjs' }],
          'react',
          'typescript'
        ]
      }).code;

      // Guard: Babel must produce a string within a safe size before we execute it
      if (typeof compiled !== 'string') {
        throw new Error('Transpiler produced unexpected output type for: ' + path);
      }
      if (compiled.length > ${MAX_COMPILED_SIZE}) {
        throw new Error('Compiled output for ' + path + ' exceeds the ' + ${MAX_COMPILED_SIZE / 1000} + ' KB safety limit.');
      }

      const factory = new Function('require', 'module', 'exports', 'React', compiled);
      factory(simulateRequire, module, module.exports, window.React);

      return module.exports;
    }

    // Export a globally accessible update function
    window.__STUDIO_UPDATE_VFS = function(newVfsEncoded) {
      try {
        console.log("Hot Update Received. Syncing VFS...");
        vfs = JSON.parse(decodeURIComponent(escape(window.atob(newVfsEncoded))));

        // Reset module cache (essential for picking up new code)
        modules = {};

        // Target the root container
        const container = document.getElementById('root');
        if (!container) return;

        // Cleanup previous React instance if it exists
        if (window._reactRoot) {
           window._reactRoot.unmount();
           container.innerHTML = "";
        }

        // Initialize new logic
        console.log("Executing entry point: src/main.tsx");
        simulateRequire('src/main.tsx');
        console.log("Live Sync Complete.");
      } catch (err) {
        console.error("Hot Update Failed: " + err.message);
        renderError("Live Sync Error:", err);
      }
    };

    window.addEventListener("message", (e) => {
      if (e.data.type === 'STUDIO_VFS_UPDATE') {
        window.__STUDIO_UPDATE_VFS(e.data.payload);
      }
    });

    console.log("VFS Engine Online. Waiting for Studio payload...");
  })();
`;

/**
 * Generates the full HTML for the Vibe Studio sandbox iframe.
 * Now acts as a persistent shell (Base HTML).
 * 
 * @param indexCss Raw CSS content from src/index.css
 * @returns Full HTML string
 */
export const generateSandboxBaseHTML = (indexCss: string) => `
  <!DOCTYPE html><html><head><meta charset="utf-8">
  <title>Sandbox Shell</title>
  ${generateConsoleProxyScript()}
  <!-- CDN scripts pinned to exact versions.
       React/ReactDOM use crossorigin for better error reporting (unpkg supports CORS).
       Babel and Tailwind CDN omit crossorigin — their servers may not send CORS headers,
       which would block the script entirely if crossorigin="anonymous" is set.
       TODO: Add SRI integrity hashes once computed:
         openssl dgst -sha384 -binary <file> | openssl base64 -A -->
  <script src="https://unpkg.com/react@18.2.0/umd/react.development.js" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.development.js" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/@babel/standalone@7.23.6/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>${indexCss}
  body { background: transparent; }
  .err-box { background: #fee2e2; border: 1px solid #fecaca; color: #991b1b; padding: 2rem; margin: 2rem; border-radius: 1rem; font-family: monospace; white-space: pre-wrap; }
  </style>
  <script>
    // Hack to capture the React root for unmounting later
    const originalCreateRoot = window.ReactDOM.createRoot;
    window.ReactDOM.createRoot = function(el) {
      const root = originalCreateRoot(el);
      window._reactRoot = root;
      return root;
    };
  </script>
  </head><body><div id="root"></div>
  <script>${VFS_COMPILER_LOGIC}</script>
  </body></html>
`;

