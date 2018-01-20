const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const errorHandler = require('errorhandler')
const {post, comments} = require('./routes')

const app = express()
app.use(bodyParser.json())
app.use(logger('dev'))
app.use(errorHandler())

let store = {
  posts: [
    {
        name: 'Top 10 ES6 Features every Web Developer must know',
        url: 'https://webapplog.com/es6',
        text: 'This essay will give you a quick introduction to ES6. If you don’t know what is ES6, it’s a new JavaScript implementation.',
        comments: [
            {'text': 'Cruel…..var { house, mouse} = No type optimization at all'},
            {'text': 'I think you’re undervaluing the benefit of ‘let’ and ‘const’.'},
            {'text': '(p1,p2)=>{ … } ,i understand this ,thank you !'}
        ]
    }
  ]
}

app.use((req, res, next) => {
    req.store = store
    next()
})


app.get('/posts', post.getPosts)
app.post('/posts', post.addPost)
app.put('/posts/:postId', post.updatePost)
app.delete('/posts/:postId', post.removePost)

app.get('/posts/:postId/comments', comments.getComments)
app.post('/posts/:postId/comments', comments.addComment)
app.put('/posts/:postId/comments/:commentId', comments.updateComment)
app.delete('/posts/:postId/comments/:commentId', comments.removeComment)

app.listen(3000)