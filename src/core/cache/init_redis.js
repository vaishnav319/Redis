const redis = require("redis");

const client = redis.createClient();
client.on("connect", function () {
  console.log("Connected to redis!");
});
client.on("error", (err) => console.log("Redis Client Error", err));

client.on("ready", () => {
  console.log("Redis Ready");
});

client.on("error", (err) => {
  console.log(err.message);
});

client.on("end", () => {
  console.log("Disconnected From Redis");
});

process.on("SIGINT", () => {
  client.quit();
});

client.connect();
module.exports = client;
