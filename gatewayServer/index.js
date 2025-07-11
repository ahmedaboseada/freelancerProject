// // // gateway: 8000, authServer: 5000, user,other...:5001,5002,5003, front: 3000
const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const ApiError = require("./utils/apiError");
const errorHandler = require("./middlewares/errorHandler");
require("./utils/responseWrapper");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require('cookie-parser');
bodyParser.urlencoded({extended: false});

// Logging html
// eslint-disable-next-line import/order
const morgan = require("morgan");

// Express app
const app = express();
const cors = require("cors");

app.set("trust proxy", 1);


// Middlewares - before routes
// app.use(cors({
//     origin: `${process.env.ENDPOINT_AUTH}`,
//     credentials: true
// }));
app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());  // Add this middleware at the top of your middleware stack

app.use(session({
    name: "freelancer.sid",
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI}),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }
}));


if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
    console.log(`mode: ${process.env.NODE_ENV}`);
} else if (process.env.NODE_ENV === "production") {
    app.use(morgan("combined"));
    console.log(`mode: ${process.env.NODE_ENV}`);
}

// Routes import
const authRoute = require("./routes/authRoutes");
const jobRoute = require("./routes/jobRoutes");
const proposalRoute = require("./routes/proposalRoutes");
const milestoneRoute = require("./routes/milestoneRoutes");

// Routes using
app.use('/api/auth', authRoute);
app.use('/api/job', jobRoute);
app.use('/api/proposal', proposalRoute);
app.use('/api/milestone', milestoneRoute);


// Handling invalid routes
app.use((req, res, next) => {
    next(new ApiError(`Can't find ${req.originalUrl} on this server`, 400));
});

// Global error handling middleware for express
app.use(errorHandler);

// Connect to DB and configure Google OAuth
const db = require("./config/db")

// Server configuration
const PORT = process.env.GATEWAYPORT;
const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

// authServerRun()


// Events => listen on events => callback Fn(err)
// Handle rejections outside async functions
process.on("unhandledRejection", (err) => {
    console.log(`Unhandled Rejection: ${err.message}`);
    console.log(`MongoDB Connection Error: ${err.name} | ${err.message}`);
    server.close(() => {
        // Stop pending processes
        console.log("Server closed");
        process.exit(1);
    }); // close server - to prevent memory leak
});

