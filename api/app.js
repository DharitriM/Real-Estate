import express from "express";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
const app = express();
app.use(express.json());
const port = process.env.PORT || 8800;

app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
