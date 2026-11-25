const dotenv = require('dotenv')
const session = require('express-session');
const express = require('express');
const sequelize = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const materialRoutes = require('./routes/materialRoutes');
const helpcenterRoutes = require('./routes/helpcenterRoutes');
const messageRoutes = require('./routes/messageRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const gradeRoutes = require('./routes/gradeRoutes');
const aiRoutes = require('./routes/aiRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const authMiddleware = require('./middleware/authMiddleware');
const path =  require('path');
const flash = require('connect-flash');
const http = require('http');

dotenv.config()

const app = express()

//Template Engine usage
const { engine } = require('express-handlebars');

//Middleware usage
app.use(express.urlencoded({ extended: true }))

//Read the JSON Body requests
app.use(express.json())

app.use(express.static(path.join(__dirname, '../../frontend/src')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const  server = http.createServer(app);
// Initialize socket.io
const io = require('socket.io')(server);

// Share the socket.io instance with others routes trough req
app.use((req,res,next)=>{
  req.io=io;
  next();
});

io.on('connection', (socket)=>{
  socket.on('join request chat', (requestId)=>{
    socket.join(`request_${requestId}`);
  });
});

app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '../../frontend/src/pages/layouts'),
    partialsDir: path.join(__dirname, '../../frontend/src/pages/partials')
}));

app.set('view engine', 'hbs');
app.set('views',path.join(__dirname, '../../frontend/src/pages'));

//Session's middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {secure:false} 
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');     
    next();
});

//Registration of the routes
app.use('/', authRoutes);
app.use('/', authMiddleware.isLoggedIn, materialRoutes);
app.use('/', authMiddleware.isLoggedIn, helpcenterRoutes);
app.use('/', authMiddleware.isLoggedIn, messageRoutes);
app.use('/', authMiddleware.isLoggedIn, calendarRoutes);
app.use('/', authMiddleware.isLoggedIn, gradeRoutes);
app.use('/', authMiddleware.isLoggedIn, notificationRoutes);
app.use('/', authMiddleware.isLoggedIn, aiRoutes);

//DB Connection TEST & Start of the server
sequelize.authenticate()
    .then(() => {
        console.log('Connessione al database stabilita con successo.');
        server.listen(process.env.SERVER_PORT, () => {
            console.log(`Server in ascolto sulla porta ${process.env.SERVER_PORT}`);
        });
    })
    .catch(err => {
        console.error('Impossibile connetterisi al database:', err);
    });

module.exports = app