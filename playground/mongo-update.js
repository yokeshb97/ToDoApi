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

db.collection('ToDos').findOneAndUpdate({
  _id :new ObjectID('5bf908a8b28e09ea4b949db5')
},{
  $set:{
    completed:false
  }
},{
  returnOriginal: false
}).then((result)=>{
  console.log(result);
});

  //client.close();
});
