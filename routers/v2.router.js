var Express = require("express")
var router = new Express.Router()

router["get"]("/", function(request, response) {
    response.status(200).send("docs go here")
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

var fs = require("fs")
var DataURI = require("datauri").promises
var YoutubeUtils = require("../utils/youtube.utils.js")
var FluentlyUtils = require("../utils/fluently.utils.js")

router["get"]("/youtube/:youtube_id.:file_format", function(request, response) {
    var youtube_id = request.params.youtube_id
    var file_format = request.params.file_format
    YoutubeUtils.download(youtube_id).then(function(video) {
        return FluentlyUtils.transcode(video.file_path, file_format).then(function(file_path) {
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
        fs.unlink(video.initial_file_path)
        delete video.initial_file_path
        fs.unlink(video.file_path)
        delete video.file_path
        return video
    }).then(function(video) {
        response.status(200).send(video)
    }).catch(function(error) {
        response.status(400).send(error)
    })
})

module.exports = router
