const express = require('express')
const ejs = require('ejs')
const app = express()
const port = 3000

app.set('view engine','ejs')
app.engine('html',ejs.renderFile)

app.use(express.static('public'))

app.get('', function(req,res){
    res.render('index.html')
});

var server = app.listen(port,() => 
    console.log(`app listening on port ${port}.`)
)