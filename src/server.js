const app = require('./app');

const PORT = process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log(`Explore server listening on port ${PORT}`)
})