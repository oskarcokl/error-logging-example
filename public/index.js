// NOTE: Just for dev purposes don't do this in production
const ELASTIC_ENDPOINT="http://localhost:9200/app-logs/_doc"
const BACKEND_ENDPOINT = "http://localhost:3000/action"

const actionButton = document.getElementById("action-button");
const errorFrontendButton = document.getElementById("error-frontend-button");
const errorBackendButton = document.getElementById("error-backend-button");
const doubleRequestButton = document.getElementById("double-request-button");

const errorMessage = document.getElementById("error-msg");


actionButton.addEventListener("click", () => {
    const requestId = self.crypto.randomUUID();
    const correlationId = self.crypto.randomUUID();
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
    const requestId = self.crypto.randomUUID();
    const correlationId = self.crypto.randomUUID();
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
            "Content-Type": "application/json"
        }
    })

    // show correlationId to user so that he can search it
    errorMessage.innerText = `Error when clicking button errorId: ${correlationId}`;
});

errorBackendButton.addEventListener("click", async () => {
    const requestId = self.crypto.randomUUID();
    const correlationId = self.crypto.randomUUID();
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


doubleRequestButton.addEventListener("click", () => {
    let requestId = self.crypto.randomUUID();
    const correlationId = self.crypto.randomUUID();
    // Log action to elastic search
    fetch(ELASTIC_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({
            action: "double request button click frontend",
            status: "success",
            requestId: requestId,
            correlationId: correlationId
        }),
        headers: {
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

    requestId = self.crypto.randomUUID();
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
