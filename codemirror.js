/* eslint-env browser */

// @ts-ignore
import CodeMirror from 'codemirror'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { CodemirrorBinding } from 'y-codemirror'
import 'codemirror/mode/javascript/javascript.js'

window.addEventListener('load', () => {
  const ydoc = new Y.Doc()
  const provider = new WebsocketProvider(
    'wss://demos.yjs.dev',
    'codemirror-demo',
    ydoc
  )
  const yText = ydoc.getText('codemirror')
  let editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
    mode: 'javascript',
    lineNumbers: true,
    theme: 'monokai',
  })

  const binding = new CodemirrorBinding(yText, editor, provider.awareness);

  const connectBtn = /** @type {HTMLElement} */ (document.getElementById('y-connect-btn'))
  connectBtn.addEventListener('click', () => {
    if (provider.shouldConnect) {
      provider.disconnect()
      connectBtn.textContent = 'Connect'
    } else {
      provider.connect()
      connectBtn.textContent = 'Disconnect'
    }
  })

  // @ts-ignore
  window.example = { provider, ydoc, yText, binding, Y }
})
