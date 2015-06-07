var Express = require("express")
var router = new Express.Router()

router["all"]("*", function(request, response) {
    response.status(403).send("v1 is not supported anymore.")
})

module.exports = router
