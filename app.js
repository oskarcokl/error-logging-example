import express from "express";

const ELASTIC_API_KEY="a0NxVndad0JwVkoxdHhGbFdDQXI6TG1LZW9heVNNODF3cE0wdjFyRkotQQ==";
const ELASTIC_ENDPOINT="http://localhost:9200/app-logs/_doc"

const app = express()
const port = 3000

app.use(express.static('public'));
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Error logging example');
});

app.post('/action', (req, res) => {
    const body = req.body

    if (!body.error) {
        // Happy path
        fetch(ELASTIC_ENDPOINT, {
            method: "POST",
            body: JSON.stringify({
                action: "/action backend",
                status: "success",
                requestId: body.requestId,
                correlationId: body.correlationId
            }),
            headers: {
                "Authorization": `ApiKey ${ELASTIC_API_KEY}`,
                "Content-Type": "application/json"
            }
        })

        res.send('Success');
        return;
    } else {
        fetch(ELASTIC_ENDPOINT, {
            method: "POST",
            body: JSON.stringify({
                action: "/action backend",
                status: "error",
                requestId: body.requestId,
                correlationId: body.correlationId,
                trace: {
                    errorMessage: "Error when processing data",
                    errorCode: "DATA_PROCESSING_ERROR",
                    functionName: "/action handler",
                }
            }),
            headers: {
                "Authorization": `ApiKey ${ELASTIC_API_KEY}`,
                "Content-Type": "application/json"
            }
        })
        res.status(500).send('Error in /action handler');
        return;
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});