const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const publicKeys = {
  Ammar: `
  -----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwt0Muxf4CihKvuiu/nyn
Z3rbcZVs4AfUf0QLj7tGsHLMBJg0YdMud4EAVxp7QaIDOOiRZphI0a+UCV+CuDZZ
Lqy1AOQ87idIF3C9ggzbcwYH8ixG4aKDSQbsKb3BjGxNqwxCzfJYYFqXZRvX6la2
FSUzzBcFKGPRmkmcH9OurhLLU0cPS00ugdyj08NjKKTJGtiBs28W4o+q6HNT4jAp
ExlNProjFhaFkLXB2wXqebinpCEztSLi2WDdfLb+otx/0B/y18P6BNtoYPuFdgyg
RhIGJCD7e3F3O/4sAbNmveeAvb28p8xA+6Ftq75htTR3ZFWGVnHDELMBbc7KNQlb
yQIDAQAB
  -----END PUBLIC KEY-----
  `,
};

app.get("/publicKey/:username", (req, res) => {
  const username = req.params.username;
  const publicKey = publicKeys[username];
  console.log(`Request for public key of user: ${username}`);
  if (publicKey) {
    console.log(`Public key found: ${publicKey}`);
    res.json({ publicKey });
  } else {
    console.log("User not found");
    res.status(404).json({ message: "User not found" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
