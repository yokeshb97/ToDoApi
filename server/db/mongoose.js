var mongoose=require('mongoose');

mongoose.Promise=global.Promise;
//mongoose.connect('mongodb://localhost:27017/Todoapp');
let db = {
  localhost: 'mongodb://localhost:27017/TodoApp',
  mlab: 'mongodb://yoks:asdf1234@ds063158.mlab.com:63158/todorest101'
};
mongoose.connect( process.env.PORT ? db.mlab : db.localhost);
module.exports={mongoose};
