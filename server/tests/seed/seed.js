const {ObjectID}=require('mongodb');
const jwt=require('jsonwebtoken');

const {Todo}=require('./../../models/todo');
const {User}=require('./../../models/user');


const user1id=new ObjectID();
const user2id=new ObjectID();
const users=[{
  _id:user1id,
  email:"byokeshb@gmail.com",
  password:'abc123',
  tokens:[{
    access:'auth',
    token:jwt.sign({_id:user1id,access:'auth'},process.env.JWT_SECRET).toString()
  }]

},
{ _id:user2id,
  email:"byokesh@gmail.com",
  password:'abc123',
  tokens:[{
    access:'auth',
    token:jwt.sign({_id:user2id,access:'auth'},process.env.JWT_SECRET).toString()
  }]
}];



const todos=[{
  _id:new ObjectID(),
  text:"First todo",
  _creator:user1id
},
{ _id:new ObjectID(),
  text:"Second todo",
  _creator:user2id,
  completed:true,
  completedAt:333
}];

const populateTodos=(done)=>{
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);
  }).then(()=>done());
};

const populateUsers=(done)=>{
  User.remove({}).then(()=>{
    var user1=new User(users[0]).save();
    var user2=new User(users[1]).save();

    return Promise.all([user1,user2]);
  }).then(()=>done());
};


module.exports={todos,populateTodos,users,populateUsers};
