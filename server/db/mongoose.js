var mongoose=require('mongoose');

mongoose.Promise=global.Promise;
//mongoose.connect('mongodb://localhost:27017/Todoapp');

mongoose.connect (process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');
module.exports={mongoose};
