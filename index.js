const express = require("express");
const app = express();
const dbConnect = require("./util/dbConect");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
dotenv.config();

// MIDDLEWARES IMPORT
const err = require("./middleware/error");

//ROUTES IMPORTATION
const companyRoute = require("./routes/company");
const loginRoute = require("./routes/login");
const orderRoute = require("./routes/orders");
const invoiceRoute = require("./routes/invoice");
const generatePDFRoute = require("./routes/generatePDF");
const adminCardsRoute = require("./routes/adminCard");
const locationRoute = require("./routes/location");
const statesInNigeriaRoute = require("./routes/statesInNigeria");
const AuthRoutes = require("./routes/forgot_pwd");
const OTPRoute = require("./routes/otp");

const PORT = process.env.PORT;

//DB INITIALIZATION
dbConnect();

//Middlewares
const corsoption = {
  origin: [
    "http://localhost:5173",
    "https://madson-project.vercel.app",
    "https://www.callandload.com",
  ],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsoption));
app.use(cookieParser());
app.use(express.json());

//ROUTES
app.use("/api/login", loginRoute);
app.use("/api/company", companyRoute);
app.use("/api/orders", orderRoute);
app.use("/api/generateinvoice", generatePDFRoute);
app.use("/api/invoice", invoiceRoute);
app.use("/api/adminCards", adminCardsRoute);
app.use("/otp", OTPRoute);
app.use("/api/locations", locationRoute);
app.use("/api/statesinnigeria", statesInNigeriaRoute);
app.use("/api/auth", AuthRoutes);

//ERROR HANDLING MIDDLEWARE
app.use(err);

// Start the server
const server = app.listen(PORT, () => {
  console.log(`server connected on PORT ${PORT}`);
});

// Optionally, handle process termination gracefully
process.on("SIGINT", () => {
  console.log("Server shutting down...");
  server.close(() => {
    console.log("Server shut down successfully.");
    process.exit(0);
  });
});
