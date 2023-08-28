# EBB Proto
Still getting up and running.

## How to set up Pyodide
Go to https://github.com/pyodide/pyodide/releases/ and get a release tarball. Unzip to a folder named pyodide-data.
To configure vite to server data from that folder, use `{server: {fs: {allow: ['pyodide-data']}}` in vite.config.js
The rest of the work is done by Paul Everitt's [PWC Pyodide](https://github.com/pauleveritt/pwc-pyodide/tree/main).
