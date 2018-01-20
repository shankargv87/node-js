module.exports = {
  getComments(req, res) {
    let posts = req.store.posts
    res.status(200).send(posts[req.params.postId].comments)
  }, 
  addComment(req, res) {
    let newComment = req.body
    let comments = req.store.posts[req.params.postId].comments
    let id = comments.length
    comments.push(newComment)
    res.status(201).send({id: id})
  },
  updateComment(req, res) {
    let comments = req.store.posts[req.params.postId].comments
    comments[req.params.commentId] = req.body
    res.status(200).send(comments[req.params.commentId])
  },
  removeComment(req, res) {
    let comments = req.store.posts[req.params.postId].comments
    comments.splice(req.params.commentId, 1)
    res.status(204).send()
  }  
}