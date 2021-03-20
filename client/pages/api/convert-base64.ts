import { NextApiHandler } from "next";

import http from "https";

const getBuffer = (base64: string) => {
  const buffer = Buffer.from(
    base64.substring(base64.indexOf(",") + 1),
    "base64"
  );

  return buffer.length / 1e6; // MB
};

const handler: NextApiHandler = async (req, res) => {
  http
    .get(req.body.url, (resp) => {
      resp.setEncoding("base64");
      let body = "data:" + resp.headers["content-type"] + ";base64,";
      resp.on("data", (data) => {
        body += data;
      });
      resp.on("end", () => {
        const sizeMB = getBuffer(body);
        return res.json({ base64: body, sizeMB });
        //return res.json({result: body, status: 'success'});
      });
    })
    .on("error", (e) => {
      console.log(`Got error: ${e.message}`);
    });
};

export default handler;
