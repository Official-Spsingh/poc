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
const VFS_COMPILER_LOGIC = (sanitizedSourceJSON: string) => `
  document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Ready. Starting VFS Compiler...");
    try {
      if (!window.Babel) throw new Error("Babel.js failed to load from network.");
      if (!window.React) throw new Error("React.js failed to load from network.");
      
      const vfs = JSON.parse(decodeURIComponent(escape(window.atob("${sanitizedSourceJSON}"))));
      const modules = {};
      
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
        // If missing extension, try resolving to tsx or ts first
        if (!path.endsWith('.tsx') && !path.endsWith('.ts') && !path.endsWith('.css') && !path.endsWith('.json')) {
          if (vfs[path + '.tsx']) path += '.tsx';
          else if (vfs[path + '.ts']) path += '.ts';
        }

        if (modules[path]) return modules[path].exports;
        if (!vfs[path]) throw new Error("Cannot find module: " + id + " (resolved to " + path + ")");

        console.log("Compiling: " + path);
        const module = { exports: {} };
        modules[path] = module;

        // Bypass Babel for CSS since we already injected it in the head <style> tag
        if (path.endsWith('.css')) return module.exports;

        // Force Babel to output ES5 with CommonJS modules
        const compiled = Babel.transform(vfs[path], {
          filename: path,
          presets: [
            ['env', { modules: 'commonjs' }],
            'react',
            'typescript'
          ]
        }).code;

        // Execute in isolated scope
        const factory = new Function('require', 'module', 'exports', 'React', compiled);
        factory(simulateRequire, module, module.exports, window.React);

        return module.exports;
      }

      // Begin execution at main.tsx
      simulateRequire('src/main.tsx');
      console.log("Application mounted successfully.");

    } catch(err) {
      console.error(err.message);
      document.body.innerHTML = "<div class='err-box'><b>Compilation Error:</b><br/>" + err.message + "<br/><br/><small>" + err.stack + "</small></div>";
    }
  });
`;

/**
 * Generates the full HTML for the Vibe Studio sandbox iframe.
 * 
 * @param sanitizedSourceJSON Base64 encoded JSON string of the project files
 * @param indexCss Raw CSS content from src/index.css
 * @returns Full HTML string
 */
export const generateSandboxHTML = (sanitizedSourceJSON: string, indexCss: string) => `
  <!DOCTYPE html><html><head><meta charset="utf-8">
  <title>Sandbox</title>
  ${generateConsoleProxyScript()}
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>${indexCss}
  body { background: transparent; }
  .err-box { background: #fee2e2; border: 1px solid #fecaca; color: #991b1b; padding: 2rem; margin: 2rem; border-radius: 1rem; font-family: monospace; white-space: pre-wrap; }
  </style>
  </head><body><div id="root"></div>
  <script>
    ${VFS_COMPILER_LOGIC(sanitizedSourceJSON)}
  </script>
  </body></html>
`;
