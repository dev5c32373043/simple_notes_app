module.exports = (app, User, passport)=>{
  app.get('/login', (req, res)=>{
    res.render(`${__dirname}/views/login`, {csrf: req.csrfToken()})
  })

  app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res)=>{
    res.redirect('/')
  })

  app.get('/sign_up', (req, res)=>{
    res.render(`${__dirname}/views/sign_up`, { message: req.flash('error'), csrf: req.csrfToken() })
  })

  app.post('/sign_up', (req, res)=>{
    if(req.body.nickname && req.body.password){
      let nickname = req.body.nickname;
      let password = req.body.password;
      User.findOne({nickname: nickname}, (error, user)=>{
        if(error){
          req.flash('error', error)
          res.redirect('/sign_up')
        }else{
          if(user){
            req.flash('error', 'user already exists!')
            res.redirect('/sign_up')
          }else{
            let user = new User({nickname: nickname, password: User.generateHash(password)})
            user.save((error, user)=>{
              if(error){
                req.flash('error', error)
                res.redirect('/sign_up')
              }else{
                req.login(user, (error)=> {
                  if (error) console.log(error)
                  res.redirect('/');
                });
              }
            })
          }
        }
      })
    }else{
      req.flash('error', 'email and password required!')
      res.redirect('/sign_up')
    }
  })
}
