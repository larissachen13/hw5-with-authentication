import Post from '../models/post_model';

export const createPost = (req, res) => {
  const post = new Post();
  post.title = req.body.title;
  post.tags = req.body.tags;
  post.content = req.body.content;
  post.save()
    .then(result => {
      res.json({ message: 'Post created!' });
    })
    .catch(error => {
      res.json({ error });
    });
};

export const getPosts = (req, res) => {
  Post.find()
  .then(posts => {
    // this cleans the posts because we use id instead of dangling _id
    // and we purposefully don't return content here either
    const cleanPosts = posts.map(post => {
      return { id: post._id, title: post.title, tags: post.tags, content: post.content };
    });
    res.json(cleanPosts);
  })
  .catch(error => {
    res.json({ error });
  });
};

export const getPost = (req, res) => {
  const id = req.params.id;
  Post.findById(id)
  .then(post => {
    post = { id: post._id, title: post.title, tags: post.tags, content: post.content };
    res.json(post);
  })
  .catch(error => {
    res.json({ error });
  });
};

export const deletePost = (req, res) => {
  const id = req.params.id;
  Post.findByIdAndRemove(id)
  .then(result => {
    res.json(result);
  })
  .catch(error => {
    res.json({ error });
  });
};


export const updatePost = (req, res) => {
  const id = req.params.id;
  console.log(id);
  // const post = new Post();
  // post.title = req.body.title;
  // post.tags = req.body.tags;
  // post.content = req.body.content;
  Post.findById(id)
  .then(post => {
    post.title = req.body.title;
    post.tags = req.body.tags;
    post.content = req.body.content;
    console.log(post);
    post.save();
    res.json(post);
  })
  .catch(error => {
    res.json({ error });
  });
};
