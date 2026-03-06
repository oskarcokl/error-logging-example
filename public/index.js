// NOTE: Just for dev purposes don't do this in production
const ELASTIC_API_KEY="a0NxVndad0JwVkoxdHhGbFdDQXI6TG1LZW9heVNNODF3cE0wdjFyRkotQQ==";
const ELASTIC_ENDPOINT="http://localhost:9200/app-logs/_doc"

const BACKEND_ENDPOINT = "http://localhost:3000/action"

const actionButton = document.getElementById("action-button");
const errorFrontendButton = document.getElementById("error-frontend-button");
const errorBackendButton = document.getElementById("error-backend-button");

const errorMessage = document.getElementById("error-msg");

const correlationId = self.crypto.randomUUID();
const requestId = self.crypto.randomUUID();

actionButton.addEventListener("click", () => {
    // Log action to elastic search
    fetch(ELASTIC_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({
            action: "button click frontend",
            status: "success",
            requestId: requestId,
            correlationId: correlationId
        }),
        headers: {
            "Authorization": `ApiKey ${ELASTIC_API_KEY}`,
            "Content-Type": "application/json"
        }
    })

    // Perform backend call
    fetch(BACKEND_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({
            requestId: requestId,
            correlationId: correlationId
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
});

errorFrontendButton.addEventListener("click", () => {
    // Log action to elastic search
    fetch(ELASTIC_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({
            action: "button click frontend",
            status: "error",
            requestId: requestId,
            correlationId: correlationId,
            trace: {
                errorMessage: "Error when user clicked button",
                errorCode: "USER_BUTTON_CLICK_ERROR",
                buttonClicked: errorFrontendButton.id,
            }
        }),
        headers: {
            "Authorization": `ApiKey ${ELASTIC_API_KEY}`,
            "Content-Type": "application/json"
        }
    })

    // show correlationId to user so that he can search it
    errorMessage.innerText = `Error when clicking button errorId: ${correlationId}`;
});

errorBackendButton.addEventListener("click", async () => {
    // Log action to elastic search
    fetch(ELASTIC_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({
            action: "button click frontend",
            status: "success",
            requestId: requestId,
            correlationId: correlationId
        }),
        headers: {
            "Authorization": `ApiKey ${ELASTIC_API_KEY}`,
            "Content-Type": "application/json"
        }
    })

    // Perform backend call
    const res = await fetch(BACKEND_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({
            requestId: requestId,
            correlationId: correlationId,
            error: true,
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })

    if (res.status === 500) {
        errorMessage.innerText = `Server error errorId: ${correlationId}`;
    }
});