import { findById, docToResource, makeAppendChildToParentMutation, makeFetchItemAction, makeFetchItemsAction } from '@/helpers'
import firebase from '@/helpers/firebase'
import chunk from 'lodash/chunk'
export default {
  namespaced: true,
  state: {
    items: [] // state.threads.items
  },
  getters: {
    thread: (state, getters, rootState) => {
      return (id) => {
        const thread = findById(state.items, id)
        if (!thread) return {}
        return {
          ...thread,
          get author () {
            return findById(rootState.users.items, thread.userId)
          },
          get repliesCount () {
            return thread.posts.length - 1
          },
          get contributorsCount () {
            if (!thread.contributors) return 0
            return thread.contributors?.length
          }
        }
      }
    }
  },
  actions: {
    async createThread ({ commit, state, dispatch, rootState }, { text, title, forumId }) {
      const userId = rootState.auth.authId
      const publishedAt = firebase.firestore.FieldValue.serverTimestamp() // Math.floor(Date.now() / 1000)

      const threadRef = firebase.firestore().collection('threads').doc()
      const thread = { forumId, title, publishedAt, userId, id: threadRef.id }

      const userRef = firebase.firestore().collection('users').doc(userId)
      const forumRef = firebase.firestore().collection('forums').doc(forumId)
      const batch = firebase.firestore().batch()

      batch.set(threadRef, thread)
      batch.update(userRef, {
        threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id)
      })
      batch.update(forumRef, {
        threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id)
      })
      await batch.commit()
      const newThread = await threadRef.get()

      commit('setItem', { resource: 'threads', item: { ...newThread.data(), id: newThread.id } }, { root: true })
      commit('users/appendThreadToUser', { userId, threadId: threadRef.id }, { root: true })
      commit('forums/appendThreadToForum', { parentId: forumId, childId: threadRef.id }, { root: true })
      await dispatch('posts/createPost', { text, threadId: threadRef.id, firstInThread: true }, { root: true })

      return findById(state.items, threadRef.id)
    },
    async updateThread ({ commit, state, rootState }, { title, text, id }) {
      const thread = findById(state.items, id)
      const post = findById(rootState.posts.items, thread.posts[0])

      let newThread = { ...thread, title }
      let newPost = { ...post, text }

      const threadRef = firebase.firestore().collection('threads').doc(id)
      const postRef = firebase.firestore().collection('posts').doc(post.id)
      const batch = firebase.firestore().batch()
      batch.update(threadRef, newThread)
      batch.update(postRef, newPost)
      await batch.commit()
      newThread = await threadRef.get()
      newPost = await postRef.get()

      commit('setItem', { resource: 'threads', item: newThread }, { root: true })
      commit('setItem', { resource: 'posts', item: newPost }, { root: true })

      return docToResource(newThread)
    },
    // fetchThread: ({ dispatch }, { id, once = false }) => dispatch('fetchItem', { resource: 'threads', id, once, emoji: '????' }, { root: true }),
    fetchThread: makeFetchItemAction({ resource: 'threads', emoji: '????' }),
    fetchThreads: makeFetchItemsAction({ resource: 'threads', emoji: '????' }),
    // fetchThreads: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'threads', ids, emoji: '????' }, { root: true }),
    fetchThreadsByPage: async ({ dispatch, commit }, { ids, page, perPage = 10 }) => {
      commit('clearThreads')
      const chunks = chunk(ids, perPage)
      // console.log(ids)
      // console.log(chunks)
      const limitedIds = chunks[page - 1]
      // console.log(limitedIds)
      return await dispatch('fetchThreads', { ids: limitedIds })
    }
  },
  mutations: {
    appendPostToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'posts' }),
    appendContributorToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'contributors' }),
    clearThreads (state) {
      state.items = []
    }
  }
}
