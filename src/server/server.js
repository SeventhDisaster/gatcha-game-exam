const app = require('./app');

const port = process.env.port || 8080;

app.listen(port, () => {
    console.log('Started server on port: ' + port);
})