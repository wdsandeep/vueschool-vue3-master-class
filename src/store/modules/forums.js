import { makeAppendChildToParentMutation, makeFetchItemAction, makeFetchItemsAction } from '@/helpers'
export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {},
  actions: {
    // fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'forums', id, emoji: '🏁' }, { root: true }),
    fetchForum: makeFetchItemAction({ resource: 'forums', emoji: '🏁' }),
    // fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'forums', ids, emoji: '🏁' }, { root: true })
    fetchForums: makeFetchItemsAction({ resource: 'forums', emoji: '🏁' })
  },
  mutations: {
    appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' })
  }
}
