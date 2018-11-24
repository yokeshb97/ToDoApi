//const MongoClient=require('mongodb').MongoClient;
const {MongoClient,ObjectID}=require('mongodb');

//var obj=new ObjectID();
//console.log(obj);

MongoClient.connect('mongodb://localhost:27017/ToDoApp',(err,client)=>{
  if(err){
    return console.log('Unable to connect to Mongodb');
  }
  console.log('Connected to Mongodb server');

  const db=client.db('ToDoApp')

db.collection('ToDos').find({
  _id:new ObjectID('5bf8d80a8981df03c8ca0571')
}).toArray().then((docs)=>{
  console.log('Todos');
  console.log(JSON.stringify(docs,undefined,2));
},(err)=>{
  console.log('Unable to fetch Todos',err);
});

  //client.close();
});
