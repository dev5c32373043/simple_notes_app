const jade = require('jade');

module.exports = (app, User)=>{
  let checkAuthorize = (req, res, next)=> req.isAuthenticated() ? next() : res.redirect('/login')

  app.get('/', checkAuthorize, (req, res)=>{
    User.findById(req.user._id, (error, user)=>{
      if(error) res.status(500).send(error)
      res.render(`${__dirname}/views/index`, {notes: user.notes, csrf: req.csrfToken() })
    })
  })

  app.post('/notes', checkAuthorize, (req, res)=>{
    if(req.body.title){
      User.findById(req.user._id, (error, user)=>{
        if(error){ res.status(500).send(error) }
        let note = user.notes.create({title: req.body.title})
        user.notes.push(note)
        user.save((error, user)=>{
          if(error) res.status(500).send(error)
          res.send({
            item: jade.renderFile(`${__dirname}/views/add.jade`, {note: note}),
            csrf: req.csrfToken()
          })
        })
      })
    }else{
      res.status(403).json({error: 'title required'})
    }
  })

  app.patch('/notes/:id', checkAuthorize, (req, res)=>{
    if(req.params.id && req.body.title){
      User.findById(req.user._id, (error, user)=>{
        if(error){ res.status(500).send(error) }
        let note = user.notes.id(req.params.id)
        note.title = req.body.title
        user.save((error, user)=>{
          if(error) return res.status(500).send(error)
          res.send({ csrf: req.csrfToken() })
        })
      })
    }else res.status(403).json({error: 'note id and title required!'})
  })

  app.delete('/notes/:id', checkAuthorize, (req, res)=>{
    if(req.params.id){
      User.findById(req.user._id, (error, user)=>{
        if(error){ res.status(500).send(error) }
        user.notes.id(req.params.id).remove()
        user.save((error, user)=>{
          if(error) return res.status(500).send(error)
          res.send({ csrf: req.csrfToken() })
        })
      })
    }else res.status(403).json({error: 'note id required!'})
  })
}
