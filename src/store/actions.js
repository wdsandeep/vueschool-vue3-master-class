import firebase from 'firebase'
import { findById } from '@/helpers'
export default {

  fetchItem ({ commit, state }, { id, emoji, resource, handleUnsubscribe = null, once = false, onSnapshot = null }) {
    // console.log('🔥', emoji, id)
    return new Promise((resolve) => {
      const unsubscribe = firebase.firestore().collection(resource).doc(id).onSnapshot((doc) => {
        if (once) unsubscribe()
        // console.log('onSnapshot', resource, doc.data())
        if (doc.exists) {
          const item = { ...doc.data(), id: doc.id }
          let previousItem = findById(state[resource].items, id)
          previousItem = previousItem ? { ...previousItem } : null
          commit('setItem', { resource, item })
          // setTimeout(() => resolve(item), 500)
          if (typeof onSnapshot === 'function') {
            const isLocal = doc.metadata.hasPendingWrites
            onSnapshot({ item: { ...item }, previousItem, isLocal })
          }
          resolve(item)
        } else {
          resolve(null)
        }
      })
      if (handleUnsubscribe) {
        handleUnsubscribe(unsubscribe)
      } else {
        commit('appendUnsubscribe', { unsubscribe })
      }
    })
  },
  fetchItems ({ dispatch }, { resource, ids, emoji, onSnapshot = null }) {
    return Promise.all(ids.map(id => dispatch('fetchItem', { id, resource, emoji, onSnapshot })))
  },
  async unsubscribeAllSnapshots ({ state, commit }) {
    state.unsubscribes.forEach(unsubscribe => unsubscribe())
    commit('clearAllUnsubscribes')
  }
}
