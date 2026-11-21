
import React, { useEffect, useState } from 'react';

const API = 'http://localhost/smart-calculator/backend/api/calculations.php';

function calculate(expression) {
  if (!expression || !/^[0-9+\-*\/().\s]+$/.test(expression)) {
    throw new Error('Invalid expression');
  }

  const compact = expression.replace(/\s+/g, '');
  const tokens = compact.match(/(?:\d+(?:\.\d*)?|\.\d+)|[()+\-*\/]/g);

  if (!tokens || tokens.join('') !== compact) {
    throw new Error('Invalid expression');
  }

  let index = 0;

  function primary() {
    const token = tokens[index++];

    if (token === '+') return primary();
    if (token === '-') return -primary();

    if (token === '(') {
      const value = sum();

      if (tokens[index++] !== ')') {
        throw new Error('Missing closing parenthesis');
      }

      return value;
    }

    const value = Number(token);

    if (token === undefined || !Number.isFinite(value)) {
      throw new Error('Invalid number');
    }

    return value;
  }

  function product() {
    let value = primary();

    while (tokens[index] === '*' || tokens[index] === '/') {
      const op = tokens[index++];
      const right = primary();

      if (op === '/' && right === 0) {
        throw new Error('Cannot divide by zero');
      }

      value = op === '*' ? value * right : value / right;
    }

    return value;
  }

  function sum() {
    let value = product();

    while (tokens[index] === '+' || tokens[index] === '-') {
      const op = tokens[index++];
      const right = product();

      value = op === '+' ? value + right : value - right;
    }

    return value;
  }

  const result = sum();

  if (index !== tokens.length || !Number.isFinite(result)) {
    throw new Error('Invalid expression');
  }

  return Number(result.toFixed(8)).toString();
}

export default function App() {
  const [expression, setExpression] = useState('');
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  async function loadHistory() {
    try {
      const response = await fetch(API);

      if (!response.ok) throw new Error();

      setHistory(await response.json());
      setError('');
    } catch {
      setError('Cannot connect to PHP API. Check Apache and MySQL.');
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  function press(value) {
    setError('');

    if (value === 'C') {
      setExpression('');
      setDisplay('0');
      return;
    }

    if (value === '⌫') {
      const next = expression.slice(0, -1);
      setExpression(next);
      setDisplay(next || '0');
      return;
    }

    if (value === '=') {
      solve();
      return;
    }

    const next = expression + value;
    setExpression(next);
    setDisplay(next);
  }

  async function solve() {
    try {
      const result = calculate(expression);

      setDisplay(result);

      const response = await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          expression,
          result
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not save calculation');
      }

      setExpression(result);
      await loadHistory();

    } catch (e) {
      setError(e.message || 'Unable to calculate.');
    }
  }

  async function deleteItem(id) {
    try {
      const response = await fetch(`${API}?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error();

      await loadHistory();

    } catch {
      setError('Could not delete history item.');
    }
  }

  const keys = [
    'C', '⌫', '(', ')',
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+'
  ];

  return (
    <main className="page">
      <header>
        <div className="brand-mark">＋</div>

        <div>
          <p className="eyebrow">EVERYDAY TOOL</p>
          <h1>Calculator</h1>
          <p className="subtitle">
            A simple calculator with saved calculation history.
          </p>
        </div>
      </header>

      <section className="layout">

        <div className="calculator panel">
          <div className="screen">
            <span>YOUR CALCULATION</span>
            <div className="expression">{expression || ' '}</div>
            <div className="result">{display}</div>
          </div>

          <div className="keys">
            {keys.map(key => (
              <button
                key={key}
                onClick={() => press(key)}
                className={`
                  ${['/', '*', '-', '+'].includes(key) ? 'operator' : ''}
                  ${key === '=' ? 'equals' : ''}
                  ${['C', '⌫'].includes(key) ? 'utility' : ''}
                `}
              >
                {key}
              </button>
            ))}
          </div>

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
        </div>

        <aside className="history panel">
          <div className="history-head">
            <div>
              <p className="eyebrow">YOUR RECORDS</p>
              <h2>History</h2>
            </div>

            <button
              className="refresh"
              onClick={loadHistory}
              title="Refresh history"
            >
              ↻
            </button>
          </div>

          {history.length === 0 ? (
            <div className="empty">
              <div>◷</div>
              <strong>No calculations yet</strong>
              <p>Your saved results will appear here.</p>
            </div>
          ) : (
            <ul>
              {history.map(item => (
                <li key={item.id}>
                  <div>
                    <span className="history-expression">
                      {item.expression}
                    </span>

                    <strong>
                      = {Number(item.result).toString()}
                    </strong>

                    <small>
                      {new Date(item.created_at).toLocaleString()}
                    </small>
                  </div>

                  <button
                    className="delete"
                    onClick={() => deleteItem(item.id)}
                    aria-label="Delete calculation"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

      </section>

      <footer>
        SMART CALCULATOR <span>•</span> REACT + PHP + MYSQL
      </footer>
    </main>
  );
}
