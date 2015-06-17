var Express = require("express")
var router = new Express.Router()

router["get"]("/", function(request, response) {
    response.status(200).send("docs go here")
})

var FS = require("fs")
var DataURI = require("datauri").promises
var YoutubeSubroutinues = require("../utils/youtube.utils.js")
var FluentlySubroutinues = require("../utils/fluently.utils.js")
router["get"]("/youtube/:id.:fmt", function(request, response) {
    var youtube_id = request.params.id
    var file_format = request.params.fmt
    YoutubeSubroutinues.download(youtube_id).then(function(video) {
        return FluentlySubroutinues.transcode(video.file_path, file_format).then(function(file_path) {
            video.initial_file_path = video.file_path
            video.file_path = file_path
            return video
        })
    }).then(function(video) {
        return DataURI(video.file_path).then(function(content) {
            video.content = content
            return video
        })
    }).then(function(video) {
        FS.unlink(video.initial_file_path)
        delete video.initial_file_path
        FS.unlink(video.file_path)
        delete video.file_path
        return video
    }).then(function(video) {
        response.status(200).send(video)
    }).catch(function(error) {
        response.status(400).send(error)
    })
})

var Fusion = require("fusion")
router["post"]("/fusion", function(request, response) {
    var protovideo = request.body
    Fusion(protovideo).then(function(video) {
        response.status(200).send(video)
    }).catch(function(error) {
        response.status(400).send(error)
    })
})

module.exports = router
