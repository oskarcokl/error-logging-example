# Error logging example

This is a project showcasing how error logging can be done from frontend to backend so that surfaced errors are traceable through entire use interactions.

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
