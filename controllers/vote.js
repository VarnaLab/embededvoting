var FSDocs = require("../modules/fsdocs").FSDocs;

module.exports = function(req, res, next) {
    if(!req.param("pollId")){
        next();
        return;
    }

    var votes = new FSDocs(__dirname+'/../votes');
    votes.get(req.param("pollId"), function(err, doc){
        if(doc == null)
            doc = {};
            
        if(doc[req.param("name")]) {
            res.render("alreadyvoted", { title: "Sorry" });
        } else {
            doc[req.param("name")] = req.param("option");
            votes.put(req.param("pollId"), doc, function(err, ok) {
                if (err) { next(err); return; }
                res.render("thankyou", { title: "thank you" });
            });
        }
    });
};