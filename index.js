import express from "express";
import route from "./routes/route.js";
const app = express();
app.use("/fetch", route);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
