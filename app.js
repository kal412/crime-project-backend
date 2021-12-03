const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const app = express();
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const { env } = require("process");

const port = 4000 || env.port;

/* OpenAPI */
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Crime Report",
      description: "Backend Api",
      contact: {
        name: "Kal",
      },
      servers: "http://localhost:3636",
    },
  },
  apis: ["app.js", ".routes/*.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

/* CORS */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders:
      "Content-Type, Authorization, Origin, X-Requested-With, Accept",
  })
);
app.use(logger("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//Import Routes
const usersRouter = require("./routes/users");
const reportsRouter = require("./routes/reports");
const authRouter = require("./routes/auth");
const listsRouter = require("./routes/lists");
const crimesRouter = require("./routes/crimes");

//Define Routes
app.use("/api/users", usersRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/auth", authRouter);
app.use("/api/lists", listsRouter);
app.use("/api/crimes", crimesRouter);

//Create server
app.listen(port, () => {
  console.log(`Server is running at port no ${port}`);
});

module.exports = app;
