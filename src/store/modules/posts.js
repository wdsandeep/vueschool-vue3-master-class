import firebase from 'firebase'
export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {},
  actions: {
    async createPost ({ commit, state, rootState }, post) {
      // post.id = 'gggg' + Math.random() firebase will handle it
      post.userId = rootState.auth.authId
      post.publishedAt = firebase.firestore.FieldValue.serverTimestamp() // Math.floor(Date.now() / 1000)

      const batch = firebase.firestore().batch()
      const postRef = firebase.firestore().collection('posts').doc()
      const threadRef = firebase.firestore().collection('threads').doc(post.threadId)
      const userRef = firebase.firestore().collection('users').doc(rootState.auth.authId)
      batch.set(postRef, post)
      batch.update(threadRef, {
        posts: firebase.firestore.FieldValue.arrayUnion(postRef.id),
        contributors: firebase.firestore.FieldValue.arrayUnion(rootState.auth.authId)
      })
      batch.update(userRef, {
        postsCount: firebase.firestore.FieldValue.increment(1)
      })
      await batch.commit()
      const newPost = await postRef.get()
      // const newPost = await firebase.firestore().collection('posts').add(post)
      // await firebase.firestore().collection('threads').doc(post.threadId).update({
      //   posts: firebase.firestore.FieldValue.arrayUnion(newPost.id),
      //   contributors: firebase.firestore.FieldValue.arrayUnion(state.authId)
      // })
      commit('setItem', { resource: 'posts', item: { ...newPost.data(), id: newPost.id } }, { root: true }) // set the post
      commit('threads/appendPostToThread', { childId: newPost.id, parentId: post.threadId }, { root: true }) // append the post to thread
      commit('threads/appendContributorToThread', { childId: rootState.auth.authId, parentId: post.threadId }, { root: true }) // append the post to thread
    },
    async updatePost ({ commit, state, rootState }, { text, id }) {
      const post = {
        text,
        edited: {
          at: firebase.firestore.FieldValue.serverTimestamp(),
          by: rootState.auth.authId,
          moderated: false
        }
      }
      const postRef = firebase.firestore().collection('posts').doc(id)
      await postRef.update(post)
      const udpatedPost = await postRef.get()
      commit('setItem', { resource: 'posts', item: udpatedPost }, { root: true })
    },
    fetchPosts: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'posts', ids, emoji: '💬' }, { root: true }),
    fetchPost: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'posts', id, emoji: '💬' }, { root: true })
  },
  mutations: {}
}