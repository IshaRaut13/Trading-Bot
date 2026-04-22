# Binance Futures Testnet Trading Bot

## Overview

This project is a browser-based trading bot for **Binance Futures Testnet**. It lets a user prepare and submit futures orders through a clean interface, with support for:

- `BUY` and `SELL`
- `MARKET`
- `LIMIT`
- `STOP_MARKET`
- dry run simulation mode
- live API mode against Binance Futures Testnet
- activity logging inside the interface
- session order history

## Demo Video

[Watch the project demonstration video](PASTE_YOUR_VIDEO_URL_HERE)

## Important Note

The original assignment described in the document was for a **Python CLI application** with logging, reusable structure, and Binance Futures Testnet order placement.

The code in this folder is **not a Python CLI app**. It is a **frontend prototype/UI implementation** using:

- HTML
- CSS
- vanilla JavaScript
- browser `fetch`
- browser `crypto.subtle` for request signing

So this project is best described as:

**A lightweight browser UI for placing or simulating Binance Futures Testnet orders.**

## Main Features

- Clean trading dashboard interface
- API key and API secret input fields
- Binance Futures Testnet base URL input
- Order placement form
- Side toggle for `BUY` and `SELL`
- Order type toggle for `MARKET`, `LIMIT`, and `STOP_MARKET`
- Dynamic form fields based on selected order type
- Client-side validation before submission
- Dry run simulation mode enabled by default
- Live mode for direct Binance Testnet requests
- In-app activity log with timestamps
- Toast notifications for success and error states
- Session-based order history table
- Responsive layout for desktop and mobile widths

## Tech Stack

- `HTML5`
- `CSS3`
- `JavaScript (Vanilla)`
- `Web Crypto API`
- `Fetch API`
- `Binance Futures Testnet REST API`

## Binance Endpoint Used

The app is configured for:

`https://testnet.binancefuture.com`

Order placement is sent to:

`/fapi/v1/order`

## Supported Order Inputs

The interface accepts:

- `symbol` such as `BTCUSDT`
- `side` as `BUY` or `SELL`
- `type` as `MARKET`, `LIMIT`, or `STOP_MARKET`
- `quantity`
- `price` for `LIMIT`
- `stopPrice` for `STOP_MARKET`
- `timeInForce` for `LIMIT`

## Validation Rules

The UI validates:

- symbol must not be empty and should be at least 4 characters
- quantity must be greater than `0`
- limit orders require a valid positive `price`
- stop market orders require a valid positive `stopPrice`
- live mode requires both API key and API secret

If validation fails:

- the order is not submitted
- the user sees a toast message explaining the problem

## How the App Works

### 1. Default startup mode

When the app opens, it starts in **Dry Run Mode**.

In this mode:

- no real Binance request is sent
- a fake order response is generated
- the order is added to the order history table
- log messages are shown in the activity panel

### 2. Live mode

When the user clicks the dry run badge, the app switches to **Live Mode**.

In live mode:

- the app reads the API key and API secret entered by the user
- request parameters are prepared in the browser
- the request is signed using HMAC-SHA256 through the Web Crypto API
- the request is sent to Binance Futures Testnet using `fetch`
- the JSON response is shown in the log flow and reflected in the order history

### 3. Response handling

After an order response is received:

- the session order count increases
- the order is inserted at the top of the history table
- a success or error toast is displayed
- activity is logged in the terminal panel

## Project Structure

```text
trading_bot/
|-- bot/
|   |-- client.js
|   |-- logging_config.js
|   |-- orders.js
|   |-- state.js
|   |-- ui.js
|   `-- validators.js
|-- ui/
|   |-- index.html
|   `-- assets/
|       `-- css/
|           `-- styles.css
|-- README.md
```

## File-by-File Explanation

### `ui/index.html`

This is the main entry point of the application. It contains:

- the page structure
- the credentials form
- the order form
- the stats cards
- the activity log panel
- the order history panel
- script references to the separated JavaScript files

### `ui/assets/css/styles.css`

This file contains the full visual styling for the app, including:

- layout
- typography
- colors
- buttons
- cards
- table styling
- toast styling
- responsive behavior

### `bot/state.js`

This file stores shared runtime state:

- selected side
- selected order type
- dry run status
- session order count
- order history array

### `bot/logging_config.js`

This file handles:

- activity log rendering
- log clearing
- toast messages

### `bot/validators.js`

This file validates user input before an order is submitted.

### `bot/client.js`

This file handles:

- request signing with HMAC-SHA256
- real Binance API order submission
- network/API error reporting

### `bot/orders.js`

This file handles:

- order submission flow
- fake simulated orders in dry run mode
- order response processing
- session order history rendering
- order table clearing

### `bot/ui.js`

This file handles:

- dry run/live toggle behavior
- credential status indicator
- side selection UI
- order type selection UI
- submit button state
- initial startup logs

## How to Run the Project

### Option 1: Open the HTML file directly

Open this file first:

`trading_bot/ui/index.html`

This is the main file for the project.

### Option 2: Run with a simple local server

From inside the `trading_bot` folder, run:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/ui/index.html
```

Using a local server is often cleaner than opening the file directly in the browser.

## How to Use the App

### Dry Run Mode

1. Open the app.
2. Leave the default dry run mode enabled.
3. Enter symbol, side, type, and quantity.
4. Add `price` if using `LIMIT`.
5. Add `stopPrice` if using `STOP_MARKET`.
6. Click the submit button.
7. Review the simulated result in the log and order history table.

### Live Mode

1. Get Binance Futures Testnet API credentials.
2. Enter API key and API secret in the app.
3. Confirm the base URL is `https://testnet.binancefuture.com`.
4. Click the dry run badge to switch to live mode.
5. Fill the order form.
6. Submit the order.
7. Review the response in the activity log and order history.

## Security Notes

This project signs requests directly in the browser. That means:

- the API secret is entered into the frontend UI
- the API secret is handled client-side
- this is acceptable only for learning, demo, or local testing
- this is **not recommended for production**

For production usage, request signing should be done on a secure backend, not in the browser.

## Current Limitations

- This is a frontend UI, not the Python CLI requested in the assignment brief.
- There is no backend server.
- API secrets are handled in the browser.
- Activity logs are shown in the UI only and are not written to a log file.
- Order history is stored only in memory and is lost on page refresh.
- Wallet, available balance, and unrealised PnL cards are visual placeholders and are not currently connected to Binance account endpoints.
- Direct browser requests to Binance may run into browser/network restrictions depending on environment and CORS behavior.
- There is no persistent database or storage.
- There is no automated test suite.

## Assumptions

- The user has a Binance Futures Testnet account.
- The user has generated valid Testnet API credentials.
- The user wants a simple local UI experience instead of a CLI.
- Modern browser support is available for:
  - `fetch`
  - `crypto.subtle`
  - modern JavaScript features

## Known Behavior by Order Type

### `MARKET`

- requires symbol and quantity
- simulated dry run returns status `FILLED`
- simulated executed quantity matches the requested quantity

### `LIMIT`

- requires symbol, quantity, and price
- includes `timeInForce`
- simulated dry run returns status `NEW`

### `STOP_MARKET`

- requires symbol, quantity, and stop price
- available here as an extra type beyond the minimum assignment requirement

## Logging Behavior

The activity panel logs:

- app startup
- dry run/live mode switching
- outgoing order request summary
- endpoint hits
- HTTP responses
- Binance API errors
- network failures
- successful order summaries
- clear actions for logs and order history

## Requirements

The app itself does not need a frontend package manager or build step.

The included `requirements.txt` is present for assignment/repository completeness, but the UI in this folder runs as a static frontend and does not require Python packages to display in the browser.

## Suggested Improvements

- move signing and API communication to a Python or Node backend
- add real wallet/balance fetching
- add persistent order history
- add proper server-side logging to files
- add environment variable support through a backend
- implement stronger symbol and numeric validation
- add loading/error states for account data
- add automated tests
- add a Python CLI version to fully match the assignment brief

## Summary

This project is a separated, multi-file version of a trading bot UI for Binance Futures Testnet. It supports simulated and live order placement through a clean browser interface, and it is most suitable for:

- UI demonstration
- frontend prototyping
- local Testnet experimentation
- showcasing structured separation of a previously single-file app
