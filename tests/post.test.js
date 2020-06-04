import 'cross-fetch/polyfill'
import { gql } from 'apollo-boost'
// import prisma from '../src/prisma'
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'

const client = getClient()

beforeEach(seedDatabase)

test('Should expose published posts', async () => {
  const getPosts = gql`
    query {
      posts {
        id
        title
        body
        published
      }
    }
  `

  const response = await client.query({
    query: getPosts
  })

  expect(response.data.posts.length).toBe(1)
  expect(response.data.posts[0].published).toBe(true)
})

test('Should return users posts', async () => {
  const client = getClient(userOne.jwt)
  const getPosts = gql`
    query {
      myPosts {
        id
        title
        body
        published
      }
    }
  `

  const { data } = await client.query({ query: getPosts })

  expect(data.myPosts.length).toBe(2)
})