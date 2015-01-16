var express = require("express")
var sendGreeting = require("./source/greeter").sendGreeting
var sendSqrt = require("./source/square-rooter").sendSqrt

var app = express()

app.get("/greet", sendGreeting)
app.get("/sqrt", sendSqrt)


var server = app.listen(3000, function()
{
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})
