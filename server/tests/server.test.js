const expect =require('expect');
const request = require('supertest');
const {ObjectID}=require('mongodb');

const {app}=require('./../server');
const {Todo}=require('./../models/todo');
const {User}=require('./../models/user');
const {todos,populateTodos,users,populateUsers}=require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);


describe('POST /todos',()=>{
  it('should create a new todo',(done)=>{
    var text='Test todo test';

    request(app)
    .post('/todos')
    .set('x-auth',users[0].tokens[0].token)
    .send({text})
    .expect(200)
    .expect((res)=>{
      expect(res.body.text).toBe(text);
    })
    .end((err,res)=>{
      if(err){
        return done(err);
      }
      Todo.find({text}).then((todos)=>{
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e)=>{
        done(e);
      });
    });
  });
  it('should create todo without proper body',(done)=>{


    request(app)
    .post('/todos')
    .set('x-auth',users[0].tokens[0].token)
    .send()
    .expect(400)
    .end((err,res)=>{
      if(err){
        return done(err);
      }
      Todo.find().then((todos)=>{
        expect(todos.length).toBe(2);
        done();
      }).catch((e)=>{
        done(e);
      });
    });
  });

});
describe('GET /todos',()=>{
  it('should get all todos',(done)=>{
    request(app)
    .get('/todos')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.length).toBe(1);
    })
    .end(done);

    });
});

describe('GET /todos/:id',()=>{
  it('should get todo doc',(done)=>{
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(todos[0].text);
})
    .end(done);

    });

    it('should return 404 if not found',(done)=>{
      request(app)
      .get(`/todos/5bfa3eaca1cc25214c041a17.toHexString()}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(404)
      .end(done);
      });
      it('should return 404 for non object ids',(done)=>{
        request(app)
        .get(`/todos/123.toHexString()}`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(404)
        .end(done);
        });
        it('should not get todo doc created by user',(done)=>{
          request(app)
          .get(`/todos/${todos[0]._id.toHexString()}`)
          .set('x-auth',users[1].tokens[0].token)
          .expect(404)

          .end(done);

          });
});

describe('DELETE /todos/:id',()=>{
  it('should remove todo',(done)=>{
    var hexid=todos[0]._id.toHexString();
    request(app)
    .delete(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo._id).toBe(hexid);
})
    .end((err,res)=>{
      if(err){
        return done(err);
      }
      Todo.findById(hexid).then((todo)=>{
        expect(todo).toBeFalsy();
        done();
      }).catch((e)=>{
        done(e);
      });
    });

    });

    it('should return 404 if not found',(done)=>{
      request(app)
      .delete(`/todos/5bfa3eaca1cc25214c041a17.toHexString()}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(404)
      .end(done);
      });
      it('should return 404 for non object ids',(done)=>{
        request(app)
        .delete(`/todos/123.toHexString()}`)
        .set('x-auth',users[1].tokens[0].token)
        .expect(404)
        .end(done);
        });
        it('should not remove todo by another user',(done)=>{
          var hexid=todos[0]._id.toHexString();
          request(app)
          .delete(`/todos/${todos[0]._id.toHexString()}`)
          .set('x-auth',users[1].tokens[0].token)
          .expect(404)

          .end((err,res)=>{
            if(err){
              return done(err);
            }
            Todo.findById(hexid).then((todo)=>{
              expect(todo).toBeTruthy();
              done();
            }).catch((e)=>{
              done(e);
            });
          });

          });
});

describe('PATCH /todos/:id',()=>{
  it('should update todo',(done)=>{
    var hexid=todos[0]._id.toHexString();
    var text="Updated todo";
    request(app)
    .patch(`/todos/${hexid}`)
    .set('x-auth',users[0].tokens[0].token)
    .send({
      text,
      completed:true
    })
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(true);
      expect(typeof res.body.todo.completedAt).toBe('number');
})
    .end(done);

    });

    it('should clear completedAt when not completed',(done)=>{
      var hexid=todos[1]._id.toHexString();
      var text="Updated todo";
      request(app)
      .patch(`/todos/${hexid}`)
      .send({
        text,
        completed:false
      })
      .expect(200)
      .set('x-auth',users[1].tokens[0].token)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeFalsy();
  })

      .end(done);
      });

      it('should not update todo of another user',(done)=>{
        var hexid=todos[0]._id.toHexString();
        var text="Updated todo";
        request(app)
        .patch(`/todos/${hexid}`)
        .set('x-auth',users[1].tokens[0].token)
        .send({
          text,
          completed:true
        })
        .expect(404)

        .end(done);

        });

});


describe('GET /users/me',()=>{
  it('should return user if authenticated',(done)=>{
    request(app)
    .get('/users/me')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  });

  it('should return 401 if not authenticated',(done)=>{
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res)=>{
      expect(res.body).toEqual({});
    })
    .end(done);
  });

});

describe('POST /users',()=>{
  it('should return a user',(done)=>{
    var email='abc@gmail.com';
    var password='abc123';
    request(app)
    .post('/users')
    .send({email,password})
    .expect(200)
    .expect((res)=>{
      expect(res.headers['x-auth']).toBeTruthy();
      expect(res.body._id).toBeTruthy();
      expect(res.body.email).toBe(email);
    })
    .end(done);
  });
  it('should return validation errors if invalid',(done)=>{
    var email='abc';
    var password='abc123';
    request(app)
    .post('/users')
    .send({email,password})
    .expect(400)
    .end(done);
  })
  it('should not create when email already exists',(done)=>{
    var email='byokeshb@gmail.com';
    var password='abc123';
    request(app)
    .post('/users')
    .send({email,password})
    .expect(400)
    .end(done);
});
});
describe('POST /users/login',()=>{

  it('should login for valid credentials',(done)=>{
    request(app)
    .post('/users/login')
    .send({
      email:users[1].email,
      password:users[1].password
    })
    .expect(200)
    .expect((res)=>{
      expect(res.headers['x-auth']).toBeTruthy();
    })
    .end((err,res)=>{
      if(err){
        return done(err);
      }
      User.findById(users[1]._id).then((user)=>{
        expect(user.toObject().tokens[1]).toMatchObject({
          access:'auth',
          token:res.headers['x-auth']
        });
        done();
      }).catch((e)=>done(e));
    });
  });



});
