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

/*  db.collection('ToDos').insertOne({
  text:'abcd',
  completed:true
},(err,result)=>{
  if(err){
    return console.log('Unable to insert');
  }
  console.log(JSON.stringify(result.ops,undefined,2));
})

db.collection('Users').insertOne({
 name:'Yokesh',
 age:21,
 location:"Chennai"
},(err,result)=>{
 if(err){
   return console.log('Unable to insert');
 }
 console.log(JSON.stringify(result.ops,undefined,2));
})
*/

  client.close();
});
