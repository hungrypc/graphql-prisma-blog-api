import bcrypt from 'bcryptjs'
import prisma from '../../src/prisma'
import jwt from 'jsonwebtoken'

const userOne = {
  input: {
    name: 'Jen',
    email: 'jen@example.com',
    password: bcrypt.hashSync('red12345')
  },
  user: undefined,
  jwt: undefined
}

const userTwo = {
  input: {
    name: 'Jack',
    email: 'jack@example.com',
    password: bcrypt.hashSync('red12345')
  },
  user: undefined,
  jwt: undefined
}

const postOne = {
  input: {
    title: 'Test Published Post',
    body: '',
    published: true,
  },
  post: undefined
}

const postTwo = {
  input: {
    title: 'Test Draft Post',
    body: '',
    published: false,
  },
  post: undefined
}

const commentOne = {
  input: {
    text: 'comment one',
  },
  post: undefined,
  author: undefined
}

const commentTwo = {
  input: {
    text: 'comment two',
  },
  post: undefined,
  author: undefined
}

const seedDatabase = async () => {
  // delete test data
  await prisma.mutation.deleteManyComments()
  await prisma.mutation.deleteManyPosts()
  await prisma.mutation.deleteManyUsers()

  // create user one
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  })
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)
  
  // create user two
  userTwo.user = await prisma.mutation.createUser({
    data: userTwo.input
  })
  userTwo.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

  // create post one
  postOne.post = await prisma.mutation.createPost({
    data: {
      ...postOne.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  })

  // create post two
  postTwo.post = await prisma.mutation.createPost({
    data: {
      ...postTwo.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  })

  // create comment one
  commentOne.comment = await prisma.mutation.createComment({
    data: {
      ...commentOne.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      },
      post: {
        connect: {
          id: postOne.post.id
        }
      }
    },
  })
  
  // create comment two
  commentTwo.comment = await prisma.mutation.createComment({
    data: {
      ...commentTwo.input,
      author: {
        connect: {
          id: userTwo.user.id
        }
      },
      post: {
        connect: {
          id: postTwo.post.id
        }
      }
    },
  })
}

export { seedDatabase as default, userOne, postOne, postTwo }