var fs = require("fs");
var loadPollSettings = function(pollId, next) {
    fs.readFile(__dirname+"/../public/polls/"+pollId+".json", function(err, data){
        if(err) { next(err); return; }
        try {
            data = JSON.parse(data);
        } catch(err) {
            next(err);
            return;
        }

        loadPollOptionsData(data, function(err, options, optionsRender){
            if(err) { next(err); return; }

            data.options = options;
            data.optionsRender = optionsRender;
            next(null, data);
        })
    });
}

var loadPollOptionsData = function(poll,next) {
    if(typeof poll.options.source == "string" && poll.options.render == "image") {
        fs.readdir(__dirname+"/../public/polls"+poll.options.source, function(err, files){
            if(err) { next(err); return; }

            var options = [];
            for(var i = 0;i<files.length; i++) {
               options.push({ imageSource: "/polls"+poll.options.source+"/"+files[i], imageId: files[i]});
            }
            next(null, options, poll.options.render);
        });
    }
}

module.exports = function(req, res, next){
    if(req.param("pollId",null) == null) {
        next();
        return;
    }

    loadPollSettings(req.param("pollId"), function(err, poll){
        if(err)
            next(err);
        else {
            poll.pollId = req.param("pollId");
            res.render(poll.render, poll);
        }
    })
    
};