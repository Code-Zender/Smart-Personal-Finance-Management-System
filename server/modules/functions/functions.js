const { connectDB, addUser, findUserByEmail, clearCollection, addTransaction, getTransactions, delTransaction, editTransaction } = require('../database/db.js');

function functions(app)
{
app.post('/addFinances', async (req, res) => {
    try {
      const transaction = req.body;
      await addTransaction(transaction);
      res.status(200).send('Transaction successfully added');
    } catch (error) {
      console.error('Error adding transaction:', error);
      res.status(500).send('Error adding transaction');
    }
  });
  
  app.post('/getTransactions', async (req, res) => {
    const { id } = req.body;
    const transactions = await getTransactions(id);
    res.json(transactions);
  });
  
  app.post('/delTransaction', async (req, res) => {
    const { id } = req.body;
    const isDel = await delTransaction(id);
    res.json(isDel);
  });
  
  app.post('/editTransaction', async (req, res) => {
    const { _id, type, amount, currency, category, description, frequency, date } = req.body;
    res.send(await editTransaction(_id, type, amount, currency, category, description, frequency, date));
  });
}
module.exports = {functions};