import firebase from '@/helpers/firebase'
import { makeFetchItemAction, makeFetchItemsAction } from '@/helpers'
export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {},
  actions: {
    // fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'categories', id, emoji: '#' }, { root: true }),
    fetchCategory: makeFetchItemAction({ resource: 'categories', emoji: '#' }),
    fetchAllCategories ({ commit }) {
      // console.log('🔥', 'cat', 'all')
      return new Promise((resolve) => {
        const unsubscribe = firebase.firestore().collection('categories').onSnapshot((querySnapshot) => {
          const categories = querySnapshot.docs.map(doc => {
            const item = { id: doc.id, ...doc.data() }
            commit('setItem', { resource: 'categories', item }, { root: true })
            return item
          })
          unsubscribe()
          resolve(categories)
        })
      })
    },
    // fetchCategories: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'categories', ids, emoji: '#' }, { root: true })
    fetchCategories: makeFetchItemsAction({ resource: 'categories', emoji: '#' })
  },
  mutations: {}
}
