router = module.exports = require("express").Router();

var execute = require("child_process").exec;
var database = {/*not actually the database*/};

router.get("/youtube", function(request, response)
{
	response.send(database);
});

router.get("/youtube/:ytid.:ext", function(request, response)
{
	var ytid = request.params.ytid;
	var ext = request.params.ext;
	console.log(ext);
	
	if(ext != "mp4" && ext != "webm" && ext != "ogv" && ext != "flv")
	{
		return response.send(404, {error: "Not a supported video extension."});
	}
	
	if(!database[ytid])
	{
		return response.send(404, {error: "Unable to access the video."});
	}
	
	response.sendfile("./archived_assets/" + ytid + "." + ext);
});

router.get("/youtube/:ytid", function(request, response)
{
	var ytid = request.params.ytid;
	
	if(database[ytid])
	{
		response.send(200, database[ytid]);
	}
	else
	{
		response.send(404, "Not Authorized");
	}
});

router.post("/youtube/:ytid", function(request, response)
{
	var ytid = request.params.ytid;
	
	if(!database[ytid])
	{
		var yturl = "http://www.youtube.com/watch?v=" + ytid;
		var path = "archived_assets/" + ytid + ".flv";
		
		database[ytid] = {status: "downloading"};
		response.send(200, database[ytid]);
		
		execute("ytdl " + yturl + " > " + path, function()
		{
			database[ytid].status = "archived";
		});
	}
	else
	{
		response.send(404, "Video already downloaded");
	}
});