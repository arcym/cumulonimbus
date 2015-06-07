var Express = require("express")
var router = new Express.Router()

router["get"]("/", function(request, response) {
    response.status(200).send("Hello World!! How are you?")
})

router["all"]("*", function(request, response) {
    response.status(404).send("Uh oh!! Something went wrong!")
})

module.exports = router
