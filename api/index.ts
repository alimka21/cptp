import app from "../server";

export default function handler(req, res) {
  try {
    return app(req, res);
  } catch (e) {
    res.status(500).json({ error: e.message, stack: e.stack, name: e.name });
  }
}
