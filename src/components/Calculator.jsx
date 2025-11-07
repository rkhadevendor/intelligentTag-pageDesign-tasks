import React, { useState } from 'react'

export default function Calculator({ initialValue = 0, onDone, onCancel }) {
  const [display, setDisplay] = useState(() =>
    initialValue ? String(initialValue.toFixed(2)) : ''
  )

  function pushChar(ch) {
    if (ch === '.' && display.includes('.')) return
    if (display.length > 12) return
    setDisplay(prev => (prev === '0' && ch !== '.' ? ch : prev + ch))
  }

  function backspace() {
    setDisplay(prev => prev.slice(0, -1))
  }

  function clearAll() {
    setDisplay('')
  }

  function done() {
    const n = parseFloat(display)
    onDone(Number.isFinite(n) ? +n.toFixed(2) : 0)
  }

  return (
    <div className="screen">
      <div className="nav">PatT - Partial Comp Pay - Tip Manual Entry</div>
      <div className="modal">
        <div className="header">Enter the amount to tip</div>
        <div className="display">{display === '' ? '-' : `$${display}`}</div>
        <div className="main-keyboard">
          <div className="keyboard">
            {[
              ['7', '8', '9'],
              ['4', '5', '6'],
              ['1', '2', '3'],
              ['.', '0', '⌫']
            ].map((row, i) => (
              <div className="row" key={i}>
                {row.map(k => (
                  <div
                    key={k}
                    className={`key ${k === '⌫' ? 'small2' : k === '.' ? 'small' : ''}`}
                    onClick={() => { if (k === '⌫') backspace(); else pushChar(k) }}
                  >
                    {k}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="done"><button onClick={done}>Done</button></div>
        <div style={{ textAlign: 'center', marginTop: 6 }}>
          <button
            onClick={() => { clearAll(); onCancel() }}
            style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
