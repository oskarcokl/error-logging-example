# Error logging example

This is a project showcasing how error logging can be done from frontend to backend so that surfaced errors are traceable through entire use interactions.


## Logs schema

| correlationId | requestId | action | status | errorDump |
|---------------|-----------|--------|--------|------------|
| string        | string    | string | string | JSON blob  |

### Definitions
1. **correlationId** This ID ties a group of user actions and server processes together.
2. **requestId** The ID of the request send to the back end. One correlation id can have many request ids.
3. **action** What action the user took, or what function was being called in the backend.
4. **status** Status of the operation, enum success | error.
5. **errorDump** Dump of the error trace that happened, maybe include even more data if necessary.