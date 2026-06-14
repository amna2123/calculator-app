# Calculator

A sleek, modern calculator web application built with HTML, CSS, and JavaScript.

## Features

- Basic arithmetic operations: addition, subtraction, multiplication, division
- Percentage calculations
- Sign toggle (±)
- Expression display showing the current operation
- Keyboard support for efficient use
- Error handling for division by zero
- Clean, dark-themed UI with responsive design

## Project Structure

```
calculator-app/
├── index.html          # Entry point
├── package.json        # npm configuration & scripts
├── .gitignore
├── src/
│   ├── styles.css      # All styles
│   └── app.js          # Application logic
└── node_modules/       # Dependencies (installed)
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)

### Install & Run

```bash
# Install dependencies
npm install

# Start the dev server (opens browser with live reload)
npm start
```

### Open Directly

You can also open `index.html` directly in your browser without the dev server:

```powershell
start index.html
```

### Keyboard Shortcuts

| Key | Action |
|------|--------|
| `0-9` | Enter numbers |
| `.` | Decimal point |
| `+`, `-`, `*`, `/` | Operators |
| `Enter` or `=` | Calculate result |
| `Backspace` | Delete last digit |
| `Escape` | Clear all (AC) |
| `%` | Percentage |

## Technologies

- HTML5
- CSS3 (Flexbox, Grid, gradients, transitions)
- Vanilla JavaScript (ES6+)
- [lite-server](https://github.com/johnpapa/lite-server) (development server with live reload)