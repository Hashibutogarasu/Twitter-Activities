// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const crypto = require('crypto');

export default function webhook(req, res) {
  const query = req.query;
  const { consumer_key , crc_token } = query;

  res.status(200).json({
    response_token: crypto.createHmac('sha256', consumer_key).update(query.crc_token).digest('base64')
  });
}
