const jade = require('jade');

module.exports = (app, User)=>{
  let checkAuthorize = (req, res, next)=> req.isAuthenticated() ? next() : res.redirect('/login')

  app.post('/notes/:id/tasks', checkAuthorize, (req, res)=>{
    if(req.body.text){
      User.findById(req.user._id, (error, user)=>{
        if(error){ res.status(500).send(error) }
        let note = user.notes.id(req.params.id)
        let task = note.tasks.create({text: req.body.text})
        note.tasks.push(task)
        user.save((error, user)=>{
          if(error) return res.status(500).send(error)
          res.send({
            item: jade.renderFile(`${process.cwd()}/app/notes/views/add.jade`, {task: task}),
            csrf: req.csrfToken()
          })
        })
      })
    }else res.status(403).json({error: 'title required'})
  })

  app.patch('/notes/:id/tasks/:task_id', checkAuthorize, (req, res)=>{
    if(req.params.id && req.params.task_id){
      User.findById(req.user._id, (error, user)=>{
        if(error){ res.status(500).send(error) }
        let note = user.notes.id(req.params.id)
        let task = note.tasks.id(req.params.task_id)
        task.status = (JSON.parse(req.body.status) ? 'Finished' : 'Active')
        user.save((error, user)=>{
          if(error) return res.status(500).send(error)
          res.send({ csrf: req.csrfToken() })
        })
      })
    }else res.status(403).json({error: 'note and task id required!'})
  })

  app.delete('/notes/:id/tasks/:task_id', checkAuthorize, (req, res)=>{
    if(req.params.id && req.params.task_id){
      User.findById(req.user._id, (error, user)=>{
        if(error){ res.status(500).send(error) }
        let note = user.notes.id(req.params.id)
        note.tasks.id(req.params.task_id).remove()
        user.save((error, user)=>{
          if(error) return res.status(500).send(error)
          res.send({ csrf: req.csrfToken() })
        })
      })
    }else res.status(403).json({error: 'note and task id required!'})
  })
}
