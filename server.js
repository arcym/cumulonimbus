var Express = require("express")
var BodyParser = require("body-parser")
var CrossOriginResourceSharing = require("cors")

var application = new Express()

application.use(BodyParser.json())
application.use(CrossOriginResourceSharing())

application.use("/v1", require("./routers/v1.router.js"))
application.use("/v2", require("./routers/v2.router.js"))
application.use("/", require("./routers/default.router.js"))

application.listen(process.env.PORT || 6789)
console.log("Listening on", process.env.PORT || 6789)
