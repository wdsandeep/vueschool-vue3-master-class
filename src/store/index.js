import { createStore } from 'vuex'
import sourceData from '@/data'
import { findById, upsert } from '@/helpers'

export default createStore({
  state: {
    ...sourceData,
    authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3'
  },

  getters: {
    authUser: (state, getters) => {
      return getters.user(state.authId)
    },
    user: state => {
      return (id) => {
        const user = findById(state.users, id)
        if (!user) return null
        return {
          ...user,
          // authUser.posts
          // authUser.getPosts()
          get posts () {
            return state.posts.filter(post => post.userId === user.id)
          },
          // authUser.postCount
          get postsCount () {
            return this.posts.length
          },
          get threads () {
            return state.threads.filter(thread => thread.userId === user.id)
          },
          get threadsCount () {
            return this.threads.length
          }
        }
      }
    },
    thread: state => {
      return (id) => {
        const thread = findById(state.threads, id)
        return {
          ...thread,
          get author () {
            return findById(state.users, thread.userId)
          },
          get repliesCount () {
            return thread.posts.length - 1
          },
          get contributorsCount () {
            return thread.contributors?.length
          }
        }
      }
    }
  },

  actions: {
    createPost ({ commit, state }, post) {
      post.id = 'gggg' + Math.random()
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)
      commit('setPost', { post }) // set the post
      commit('appendPostToThread', { childId: post.id, parentId: post.threadId }) // append the post to thread
      console.log('appendContributorToThread', post.threadId, state.authId)
      commit('appendContributorToThread', { childId: state.authId, parentId: post.threadId }) // append the post to thread
    },
    async createThread ({ commit, state, dispatch }, { text, title, forumId }) {
      const id = 'gggg' + Math.random()
      const userId = state.authId
      const publishedAt = Math.floor(Date.now() / 1000)
      const thread = { forumId, title, publishedAt, userId, id }
      commit('setThread', { thread })
      commit('appendThreadToUser', { userId, threadId: id }) // we can use like below function to make it higher order functionality
      commit('appendThreadToForum', { parentId: forumId, childId: id })
      dispatch('createPost', { text, threadId: id })

      return findById(state.threads, id)
    },

    async updateThread ({ commit, state }, { title, text, id }) {
      console.log('Entering updateThread action')
      const thread = findById(state.threads, id)
      console.log('thread passed')
      const post = findById(state.posts, thread.posts[0])
      console.log('After finding thread and post')

      const newThread = { ...thread, title }
      const newPost = { ...post, text }

      commit('setThread', { thread: newThread })
      commit('setPost', { post: newPost })

      return newThread
    },

    updateUser ({ commit }, user) {
      commit('setUser', { user, userId: user.id })
    }
  },

  mutations: {
    setPost (state, { post }) {
      upsert(state.posts, post)
    },

    setThread (state, { thread }) {
      upsert(state.threads, thread)
    },

    setUser (state, { user, userId }) {
      const userIndex = state.users.findIndex(user => user.id === userId)
      state.users[userIndex] = user
    },

    appendPostToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'posts' }),

    appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' }),

    appendThreadToUser (state, { userId, threadId }) { // we can use same function as above here
      const user = findById(state.users, userId)
      user.threads = user.threads || []
      user.threads.push(threadId)
    },
    appendContributorToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'contributors' })
  }

})

function makeAppendChildToParentMutation ({ parent, child }) {
  return (state, { childId, parentId }) => {
    const resource = findById(state[parent], parentId)
    resource[child] = resource[child] || []
    if (!resource[child].includes(childId)) {
      resource[child].push(childId)
    }
  }
}
