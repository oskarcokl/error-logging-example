import express from "express";

const ELASTIC_ENDPOINT="http://localhost:9200/app-logs/_doc"

const app = express()
const port = 3000

app.use(express.static('public'));
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Error logging example');
});

app.post('/action', async (req, res) => {
    const {correlationId, requestId, error: reqError} = req.body

    if (!reqError) {
        // Happy path
        try {
            const esRes = await fetch(ELASTIC_ENDPOINT, {
                method: "POST",
                body: JSON.stringify({
                    action: "/action backend",
                    status: "success",
                    requestId: requestId,
                    correlationId: correlationId
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (!esRes.ok) throw new Error('ES logging failed');

            res.send('Success');
        } catch (error) {
            console.error("Failed to log to ES", { correlationId, requestId, error });
            res.status(500).send('ES logging failed');
        }
        return;
    } else {
        try {
            const resEs = await fetch(ELASTIC_ENDPOINT, {
                method: "POST",
                body: JSON.stringify({
                    action: "/action backend",
                    status: "error",
                    requestId: requestId,
                    correlationId: correlationId,
                    trace: {
                        errorMessage: "Error when processing data",
                        errorCode: "DATA_PROCESSING_ERROR",
                        functionName: "/action handler",
                    }
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (!resEs.ok) throw new Error("ES logging failed");

            res.status(500).send('Error in /action handler');
        } catch (error) {
            console.error("Failed to log to ES", { correlationId, requestId, error });
            res.status(500).send('ES logging failed');
        }
        return;
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
