// NOTE: Just for dev purposes don't do this in production
const ELASTIC_API_KEY="a0NxVndad0JwVkoxdHhGbFdDQXI6TG1LZW9heVNNODF3cE0wdjFyRkotQQ==";
const ELASTIC_ENDPOINT="http://localhost:9200/app-logs/_doc"

const actionButton = document.getElementById("action-button");
const errorFrontendButton = document.getElementById("error-frontend-button");
const errorBackendButton = document.getElementById("error-backend-button");

const correlationId = self.crypto.randomUUID();
const requestId = self.crypto.randomUUID();

actionButton.addEventListener("click", () => {
    fetch(ELASTIC_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({
            action: "button click",
            status: "success",
            requestId: requestId,
            correlationId: correlationId
        }),
        headers: {
            "Authorization": `ApiKey ${ELASTIC_API_KEY}`,
            "Content-Type": "application/json"
        }
    })
});

errorFrontendButton.addEventListener("click", () => {
    console.log("Error frontend button");
});

errorBackendButton.addEventListener("click", () => {
    console.log("Error backend button");
});