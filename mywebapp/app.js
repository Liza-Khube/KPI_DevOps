const express = require('express');
const tasksRouter = require('./routes/tasks');
const healthRouter = require('./routes/health');

const app = express();
app.use(express.json());
app.use('/tasks', tasksRouter);
app.use('/health', healthRouter);

app.get('/', (req, res) => {
  if (!req.accepts('text/html')) {
    return res.status(406).send('Invalid Accept Header: this endpoint only supports text/html.');
  }
  res.status(200).send(`
    <html><body><h1>mywebapp — Task Tracker</h1>
        <ul>
          <li>GET /tasks — список всіх задач</li>
          <li>POST /tasks — створити нову задачу</li>
          <li>POST /tasks/:id/done — змінити статус задачі на виконано</li>
        </ul>
      </body></html>
  `);
});

module.exports = app;
