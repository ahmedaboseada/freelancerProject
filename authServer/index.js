const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const ApiError = require("./utils/apiError");
const errorHandler = require("./middlewares/errorHandler");
require("./utils/responseWrapper");
const passport = require("./config/passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
bodyParser.urlencoded({extended: false});
console.log("Auth Server is running...");

// Logging html
// eslint-disable-next-line import/order
const morgan = require("morgan");

// Express app
const app = express();
const cors = require("cors");

// Routes import
const authRoute = require("./routes/authRoutes");
const googleRoute = require("./routes/googleRoutes");

    // Middlewares - before routes
app.use(cors())


app.use(bodyParser.json());

    if (process.env.NODE_ENV === "development") {
        app.use(morgan("dev"));
        console.log(`mode: ${process.env.NODE_ENV}`);
    } else if (process.env.NODE_ENV === "production") {
        app.use(morgan("combined"));
        console.log(`mode: ${process.env.NODE_ENV}`);
    }

// Express session setup before Passport
app.use(session({
    name: "freelancer.sid",
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }
}));


// Passport initialization
    app.use(passport.initialize());
    app.use(passport.session());


// Routes using
    app.use('/api/auth/', googleRoute);
    app.use('/api/auth', authRoute);


// Handling invalid routes
    app.use((req, res, next) => {
        next(new ApiError(`Can't find ${req.originalUrl} on this server`, 400));
    });

// Global error handling middleware for express
    app.use(errorHandler);

// Database connection
    const db = require("./config/db");

// Server configuration
    const PORT = process.env.PORT;
    const server = app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });

// Handle unhandled rejections outside async functions
    process.on("unhandledRejection", (err) => {
        console.log(`Unhandled Rejection: ${err.message}`);
        console.log(`MongoDB Connection Error: ${err.name} | ${err.message}`);
        server.close(() => {
            // Stop pending processes
            console.log("Server closed");
            process.exit(1);
        }); // close server to prevent memory leak
    });
// }

