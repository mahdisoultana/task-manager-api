const express = require("express");
require("./db/mongoose");
const userrouter = require("./router/user");
const taskRouter = require("./router/task");
const port = process.env.PORT;

app = express();
 
app.use(express.json());

app.use(userrouter);
app.use(taskRouter)

app.listen(port, () => {
    console.log('server is runnig in port ' + port)
})


 