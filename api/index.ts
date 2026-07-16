import app from "../server";

process.on('uncaughtException', (err) => {
  console.error("Uncaught Exception:", err);
});
process.on('unhandledRejection', (err) => {
  console.error("Unhandled Rejection:", err);
});

export default function handler(req, res) {
  return app(req, res);
}
