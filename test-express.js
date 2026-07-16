import express from "express";
import http from "http";

const app = express();
app.get("/", (req, res) => {
  res.set("X-Test", "1");
  res.send("Hello");
});

const server = http.createServer(app);
server.listen(3000, () => {
  http.get("http://localhost:3000/", (resp) => {
    let data = '';
    resp.on('data', chunk => data += chunk);
    resp.on('end', () => {
      console.log("Headers:", resp.headers);
      console.log("Body:", data);
      server.close();
    });
  });
});
