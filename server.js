const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://demo:demo@cluster0-q2ojb.mongodb.net/test?retryWrites=true";
const dbName = "demo";

app.listen(3001, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('messages').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {messages: result})
  })
})

app.post('/messages', (req, res) => {
  
  console.log('input:' + req.body.msg.toLowerCase())

  let isPalindrome = req.body.msg.toLowerCase() === req.body.msg.toLowerCase().split("").reverse().join("") ? " - Yes! It's a palindrome!": " - No, it's not a palindrome."
  
  console.log('reverse:' + req.body.msg.toLowerCase().split("").reverse().join(""))

  db.collection('messages').insertOne({ msg: req.body.msg, palindrome: isPalindrome}
  
    , (err, result) => {

    if (err) return console.log(err)

    console.log('saved to database')
    
    res.redirect('/')
  })
})

app.delete('/messages', (req, res) => {
  db.collection('messages').findOneAndDelete({msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})