import got from "got";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  try {
    const result = await got(req.body.url);
    console.log(result);
    return res.json({ exists: true });
  } catch {
    return res.json({ exists: false });
  }
};

export default handler;
