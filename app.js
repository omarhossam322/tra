const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const user = require('./user.js');
const fs = require('fs')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
var MongoDBStore = require('connect-mongodb-session')(session);
var  username;
var secret;
const u =""
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views'))
app.use(bodyParser.urlencoded({ extended: false }))
var port = process.env.PORT || 8080;
const db= 'mongodb+srv://SOS:SOS@cluster0.slpzxvc.mongodb.net/?retryWrites=true&w=majority'
try {
  mongoose.connect(
   db,
   {
     useNewUrlParser: true
   }
 ).then( console.log('MongoDB is Connected...'+" "+db))

} catch (err) {
   console.log("hello");
 console.error(err.message);
 process.exit(1);
}
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})


app.use(session({
  secret: username,
  store: new MongoDBStore({
    uri: 'mongodb+srv://SOS:SOS@cluster0.slpzxvc.mongodb.net/?retryWrites=true&w=majority', 
    collection: 'sessions'}),
  resave: false,
  saveUninitialized: false
}));

async function authenticated(req, res, next) {
    if (req.session.user) {
        console.log(req.session.user)
        username=req.session.user.username
    
      const u = await user.findOne({name:username})
     console.log('authenticated')
      next();
    } else {
        console.log('not authenticated')
      res.redirect('/');
    }
  }  

function show(){
  console.log("yes")
    }

app.get('/', function(req,res){
    res.render('login',{

    })
}) 


app.get('/delete',function(req,res){
    fs.writeFileSync('account.json',JSON.stringify([]))
    res.redirect('/')
})
app.post('/register',async function ( req,res){
    var data = req.body;

    console.log(data);
    const  x=await user.findOne({name:req.body.username})
    if(x){
       console.log("test no");
       res.send("Username already taken")
    }
    else if(req.body.username== "")
        res.send("Please put in an applicable username");
    else if(req.body.password== "")
        res.send("Please put in an applicable password");
    else{
    const u =new user({
        name: req.body.username,
        password:req.body.password
    })
    u .save()
   
       res.redirect('/');

    }
});
app.get('/annapurna',authenticated, function(req,res){
    res.render('annapurna',{
    })
}) 

app.get('/bali', authenticated,function(req,res){
    res.render('bali',{
    })
}) 
app.get('/cities', authenticated,function(req,res){
    res.render('cities',{
    })
}) 
app.get('/hiking', authenticated,function(req,res){
    res.render('hiking',{
    })
}) 
app.get('/inca', authenticated,function(req,res){
    res.render('inca',{
    })
}) 
app.get('/islands', authenticated,function(req,res){
    res.render('islands',{
    })
}) 
app.get('/paris', authenticated,function(req,res){
    res.render('paris',{
    })
}) 
app.get('/rome', authenticated,function(req,res){
    res.render('rome',{
    })
}) 
app.get('/santorini', authenticated,function(req,res){
    res.render('santorini',{
    })
}) 
app.get('/home', authenticated, function(req,res){
    console.log(u)
    res.render('home',{
    })
}) 
app.post('/', async function(req,res){
    var data = req.body;
    const { username, password } = req.body;
    req.session.user = { username };
const u=await user.findOne({name:req.body.username})
    
    if(req.body.username== "")
    res.send("please dont leave username empty");

    
    else if(req.body.password== "")
    res.send("Please dont leave password empty");
    
    else if(!u){
        console.log("NO");
        res.send("Please input a correct username :)")
    }
    
    else if(!(u.password===req.body.password)){
        console.log("NO");
        res.send("Please input a correct password :)")

     }

    else{
        console.log(u)
        console.log(u.password===req.body.password)
        req.session.user = { username };

        res.redirect('/home');
    }
});
app.get('/wanttogo', authenticated ,async function(req,res){
    
    const x = await user.findOne({name:username})
     var List= x.wanttogo
     console.log("here")
    res.render('wanttogo',{list: List})
}) 
app.get('/searchresults', function(req,res){
    res.render('searchresults',{
    })
}) 
app.post('/search',function(req,res){
    var btngan = req.body.Search;
    var data = btngan.toLowerCase();
    console.log(data);
    
    var searchResults = [];
    var tempArray = [{"name":"inca trail to machu picchu","img":"inca.png","location":'/inca'},
    {"name":"rome","img":"/rome.png","location":'/rome'},
    {"name": "paris","img":"paris.png","location":'/paris'},
      {"name": "santorini island","img":"santorini.png","location":'/santorini'},
      {"name": "annapurna circuit","img":"annapurna.png","location":'/annapurna'},
      {"name": "bali island","img":"bali.png","location":'/bali'}
    ];
   
    for(var i=0 ; i< tempArray.length; i++){
      if((tempArray[i].name.includes(data))){
          searchResults.push(tempArray[i]);
      }

  }console.log(searchResults)
  if(searchResults.length==0){
      return  res.send("Destination not found")
  }
  if(data==="")
    return res.send("please enter a valid item name")


    console.log("here")
return res.render('searchresults',{searchResults: searchResults})  


})
app.get('/registration', function(req,res){
    res.render('registration',{
       
    })
})
app.post('/addtowant', async  function(req,res){
    var data = req.body.name;
    var full
    var tempArray = [{"name":"Inca Trail to Machu Picchu","img":"inca.png","location":'/inca'},
    {"name":"Rome","img":"/rome.png","location":'/rome'},
    {"name": "Paris","img":"paris.png","location":'/paris'},
      {"name": "Santorini Island","img":"santorini.png","location":'/santorini'},
      {"name": "Annapurna Circuit","img":"annapurna.png","location":'/annapurna'},
      {"name": "Bali Island","img":"bali.png","location":'/bali'}
    ];
    for(var i=0 ; i< tempArray.length; i++){
        if(tempArray[i].name.includes(data)){
           full=tempArray[i]
        }}
       
        
        console.log(full)

        username=req.session.user.username
    
        const x = await user.findOne({name:username})

    for(i=0;i<x.wanttogo.length;i++){
            console.log(i+":"+x.wanttogo[i])
            if(x.wanttogo[i].name==full.name){
                console.log("here")
              return  res.send("Destination already exists in your want to go list")
              
            }
        }
    

        var u = await user.findOneAndUpdate({name:username}, {
            $push:   {wanttogo:full  },   
          },
          { new: true })
          var List = x.wanttogo
       res.redirect("/home")

})

app.listen(port,function() {
    console.log("app running on port 8080"); });