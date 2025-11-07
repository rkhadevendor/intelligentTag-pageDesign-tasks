import React, { useState, useMemo } from 'react'
import Calculator from './components/Calculator'

export default function App() {
  const [subtotal, setSubtotal] = useState(100.0)
  const [subtotalInput, setSubtotalInput] = useState(subtotal.toFixed(2))
  const [selectedPercent, setSelectedPercent] = useState(20)
  const [manualOpen, setManualOpen] = useState(false)
  const [manualTip, setManualTip] = useState(null)

  const tipFromPercent = useMemo(() => +(subtotal * (selectedPercent / 100)).toFixed(2), [subtotal, selectedPercent])
  const tipToShow = manualTip !== null ? manualTip : tipFromPercent

  function sanitizeNumberString(str) {
    let cleaned = String(str).replace(/[^0-9.]/g, '')
    const parts = cleaned.split('.')
    if (parts.length > 2) cleaned = parts[0] + '.' + parts.slice(1).join('')
    return cleaned
  }

  function handleSubtotalInputChange(raw) {
    const cleaned = sanitizeNumberString(raw)
    setSubtotalInput(cleaned)
    const n = parseFloat(cleaned)
    if (Number.isFinite(n)) setSubtotal(+n)
    else setSubtotal(0)
  }

  function handleSubtotalBlur() {
    setSubtotalInput(subtotal.toFixed(2))
  }

  // function onReset() {
  //   setSubtotal(100.0)
  //   setSubtotalInput('100.00')
  //   setSelectedPercent(20)
  //   setManualTip(null)
  // }

  return (
    <div className="app-root">
      <nav>
        <div className="nav-text">PatT - Fully Paid - Tip</div>
        <div className="back-btn" title="Back"><i className="fa-solid fa-angle-left"></i></div>
      </nav>

      <main className="main" id="mainContent">
        <div className="container1">
          <div className="subtotal">
            Check Subtotal:&nbsp;
            <span className="dollar">$</span>
            <input
              className="subtotal-input"
              inputMode="decimal"
              value={subtotalInput}
              onChange={(e) => handleSubtotalInputChange(e.target.value)}
              onBlur={handleSubtotalBlur}
              onKeyDown={(e) => {
                const allowedKeys = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End']
                if (allowedKeys.includes(e.key)) return
                if (e.key === '.' && e.currentTarget.value.includes('.')) { e.preventDefault(); return }
                if (!/[0-9.]/.test(e.key)) e.preventDefault()
              }}
            />
          </div>
          <div className="tip">Tip is based on the full check before comps or discounts</div>
        </div>

        <div className="container2">
          <div className="amount-text">Choose the amount to tip</div>
          <div className="amount">
            <div className="small1">${tipToShow.toFixed(2)}</div>
          </div>
        </div>

        <div className="container3">
          {[15, 20, 25].map((p) => (
            <div
              key={p}
              className={`percentage ${selectedPercent === p && manualTip === null ? 'active' : ''}`}
              onClick={() => { setSelectedPercent(p); setManualTip(null) }}
            >
              <div className="big">{p}%</div>
              <div className="small">${(subtotal * (p / 100)).toFixed(2)}</div>
            </div>
          ))}
          <div className="percentage" onClick={() => setManualOpen(true)}>
            <div className="big other">OTHER</div>
          </div>
        </div>

        <div className="container4">
          <div className="tip">
            <div className="big">{tipToShow === 0 ? 'NO TIP' : `TIP $${tipToShow.toFixed(2)}`}</div>
          </div>
        </div>
      </main>

      <div className="footer">
        <div className="left-icon">
          <div className="calculator" title="calculator" onClick={() => setManualOpen(true)}>
            <i className="fa-solid fa-calculator"></i>
          </div>
          <div>
            <a className="reset-link" href="#" onClick={(e) => { e.preventDefault(); onReset() }}>[Reset]</a>
          </div>
        </div>
        <div className="right">
          <div className="info">(Full Comps applied)</div>
          <div className="text" title="Text"><i className="fa-regular fa-file-lines"></i></div>
        </div>
      </div>

      {manualOpen && (
        <div className="calc-overlay">
          <div className="calc-card">
            <button className="calc-close" onClick={() => setManualOpen(false)} title="Close">✕</button>
            <Calculator
              initialValue={manualTip !== null ? manualTip : tipFromPercent}
              onDone={(val) => { setManualTip(+val); setManualOpen(false) }}
              onCancel={() => setManualOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
