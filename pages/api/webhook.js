// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const crypto = require('crypto');

export default async function webhook(req, res) {
  const query = req.query;
  const { consumer_key , crc_token } = query;

  return(
    res.status(200).json({
      response_token: crypto.createHmac('sha256', consumer_key).update(crc_token).digest('base64')
    })
  );
}
