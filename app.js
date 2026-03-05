import express from "express";

const app = express()
const port = 3000

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Error logging example');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});