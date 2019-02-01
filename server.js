const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require('passport');
const passportSetup = require('./api/auth/passport');

const relationshipController = require('./api/relationship/controller')
const postController = require('./api/post/controller')

const app = express();

const server = require('http').Server(app)
const io = require('socket.io')(server);

const userRouter = require("./api/user/router");
const relationshipRouter = require("./api/relationship/router");
const postRouter = require("./api/post/router");
const authRouter = require("./api/auth/router");

app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "ALLOWALL");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, DELETE, OPTIONS"
  );
  
  if (req.headers.origin) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", true);

  res.setHeader(
    "Access-Control-Allow-Headers", 
    "Authorization, Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(
  session({
    secret: "cangvonghiacangtot",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));

app.use("/api/users", userRouter);
app.use("/api/relationships", relationshipRouter);
app.use("/api/posts", postRouter);
app.use("/api/auth", authRouter);

app.use(express.static('./public'));

app.get('/', (req, res) => {
  res.sendFile('./public/index.html');
})

mongoose.connect(
  "mongodb://beentogether:beentogether16@ds151993.mlab.com:51993/beentogether",
  { useNewUrlParser: true },
  err => {
    if (err) console.log(err);
    else console.log("connect DB success");
  }
);

const port = process.env.PORT || 3333;

server.listen(port, err => {
  if (err) console.log(err);
  else console.log("server started " + port); 
});

io.on('connection', async(socket) => {
  console.log("co ket noi" + socket.id)
  // socket.on('postId', (data) => {
  //   console.log(data)
  // })
  
  socket.on('disconnect', () => {
    console.log("ngat ket noi")
  })
  
  // socket.on('userId', async (id) => {
  //   const posts = await relationshipController.getPostOfRela(id)
  //   console.log(posts)
  //   io.emit('posts', posts)
  // })
  socket.on('userId', async (userId) => {
    const posts = await relationshipController.getPostOfRela(userId);
    io.emit('posts', posts)
  })
  socket.on('postId', async (postId) => {
    const post = await postController.getOnePost(postId);
    io.emit('post', post)
  })
})



