const express = require('express');
const app = express();

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});

app.get('/', (req, res)=> {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ name: "Mostafiz", description: "freelancer"}));
  res.send('hello world')
})
