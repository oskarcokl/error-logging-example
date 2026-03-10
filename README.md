# Error logging example

This is a project showcasing how error logging can be done from frontend to backend so that surfaced errors are traceable through entire use interactions.

## Prerequisites

- Node.js **18 or newer** (the backend and setup scripts rely on the built-in `fetch` available from Node 18+)
- Docker + Docker Compose

## Getting started

Initialize Elastic and Kibana containers by running. This will create the containers and necessary index and data view. The containers will be up and running after this command.

```sh
npm run kibana:init
```

Start the dev server by running

```sh
npm run dev
```

Stop kibana

```sh
npm run kibana:stop
````

Start kibana

```sh
npm run kibana:start
```

Tear down kibana

```sh
npm run kibana:teardown
```

## How to use this demo

This repo is meant to show how a single **correlationId** can tie together multiple frontend and backend logs for one unit of user work.

### 1. Open the app

1. Start everything as described above (`npm run kibana:init` and `npm run dev`).
2. Open the app in your browser at `http://localhost:3000`.

You will see four buttons:
- `Action`
- `Error frontend`
- `Error backend`
- `Double request`

### 2. Trigger different paths

- **Happy path (`Action`)**
  1. Click `Action`.
  2. The frontend logs a **success** event with a fresh `correlationId` and `requestId`.
  3. The backend logs a **success** event for `/action` with the same IDs.

- **Frontend error path (`Error frontend`)**
  1. Click `Error frontend`.
  2. The frontend logs an **error** event (with a `trace` object) and shows a message:
     - `Error when clicking button errorId: <correlationId>`
  3. Copy this `correlationId` value.

- **Backend error path (`Error backend`)**
  1. Click `Error backend`.
  2. The frontend logs a **success** event and calls the backend with `error: true`.
  3. The backend logs an **error** event (with a backend `trace` object) and returns HTTP 500.
  4. The frontend shows:
     - `Server error errorId: <correlationId>`
  5. Copy this `correlationId` value.

- **Multiple backend requests (`Double request`)**
  1. Click `Double request`.
  2. The frontend logs a **single** success event for the button click with one `correlationId`.
  3. It then makes **two** backend calls with:
     - Same `correlationId`
     - Two different `requestId` values

### 3. Inspect logs in Kibana using correlationId

1. Open Kibana in your browser at `http://localhost:5601`.
2. Go to **Discover** and select the **App Logs** data view.
3. In the search bar, paste the `correlationId` you copied from the UI, for example:

   ```kql
   correlationId: "<your-correlation-id>"
   ```

4. You should now see:
   - All **frontend** logs for that action.
   - All **backend** logs for that same action.

For the `Double request` button, you’ll see multiple documents with:
- The **same** `correlationId` (one user action)
- **Different** `requestId` values (each concrete backend request)

This is the core idea the demo showcases: a **correlationId** ties together all the logs for a single user action, while **requestId** lets you distinguish individual backend calls within that action.

## Login
You don't need to login because we are running everything in an unsafe way.


## Logs schema

| correlationId | requestId | action | status | trace |
|---------------|-----------|--------|--------|------------|
| keyword        | keyword    | keyword | keyword | object  |

### Definitions
1. **correlationId** This ID ties a group of user actions and server processes together.
2. **requestId** The ID of the request send to the back end. One correlation id can have many request ids.
3. **action** What action the user took, or what function was being called in the backend.
4. **status** Status of the operation, enum success | error.
5. **trace** Dump of the error trace that happened, maybe include even more data if necessary.

## Disclaimer

Do not use this kind of elastic + kibana setup in production it is not safe and you will get your data stolen from you. This repo is just meant to showcase how to do error log handling for traceability.
