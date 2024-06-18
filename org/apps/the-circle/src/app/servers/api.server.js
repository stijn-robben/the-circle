const express = require('express');
const app = express();
const cors = require('cors');
const port = 5055;

app.use(cors());
const messages = [
  {
    _id: '667156e81d11f88864ddb835',
    username: 'Hans',
    text: 'Good!',
    dateTime: '2024-06-18T11:44:08.191+02:00',
  },
  {
    _id: '667161fade4c2fc6c2195281',
    username: 'Hans',
    text: 'Hello',
    dateTime: '2024-06-18T12:31:22.709+02:00',
  },
  {
    _id: '66716211de4c2fc6c2195285',
    username: 'Ammar',
    text: 'Bonjour',
    dateTime: '2024-06-18T12:31:45.351+02:00',
  },
  {
    _id: '6671621dde4c2fc6c219528a',
    username: 'Stefan',
    text: 'How are you guys?',
    dateTime: '2024-06-18T12:31:57.904+02:00',
  },
];
const publicKeys = {
  Ammar:
    '\n  -----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwt0Muxf4CihKvuiu/nyn\nZ3rbcZVs4AfUf0QLj7tGsHLMBJg0YdMud4EAVxp7QaIDOOiRZphI0a+UCV+CuDZZ\nLqy1AOQ87idIF3C9ggzbcwYH8ixG4aKDSQbsKb3BjGxNqwxCzfJYYFqXZRvX6la2\nFSUzzBcFKGPRmkmcH9OurhLLU0cPS00ugdyj08NjKKTJGtiBs28W4o+q6HNT4jAp\nExlNProjFhaFkLXB2wXqebinpCEztSLi2WDdfLb+otx/0B/y18P6BNtoYPuFdgyg\nRhIGJCD7e3F3O/4sAbNmveeAvb28p8xA+6Ftq75htTR3ZFWGVnHDELMBbc7KNQlb\nyQIDAQAB\n  -----END PUBLIC KEY-----\n  ',
};

app.get('/api/transparentPerson/:username/publicKey', (req, res) => {
  const username = req.params.username;
  const publicKey = publicKeys[username];
  if (publicKey) {
    res.json({ publicKey });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.get('/api/message/:username', (req, res) => {
  const username = req.params.username;
  const userMessages = messages.filter((msg) => msg.username === username);
  res.json(messages);
});
app.post('/api/message', (req, res) => {
  const newMessage = req.body;
  newMessage._id = Date.now().toString();
  newMessage.dateTime = new Date().toISOString();
  messages.push(newMessage);
  res.status(201).json(newMessage);
});
app.listen(port, () => {
  console.log(`Mock server running at http://localhost:${port}`);
});
