import { findById, upsert, docToResource } from '@/helpers'
export default {
  setItem (state, { resource, item }) {
    upsert(state[resource], docToResource(item))
  },
  appendUnsubscribe (state, { unsubscribe }) {
    state.unsubscribes.push(unsubscribe)
  },
  clearAllUnsubscribes (state) {
    state.unsubscribes = []
  },

  appendPostToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'posts' }),

  appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' }),

  appendThreadToUser: makeAppendChildToParentMutation({ parent: 'threads', child: 'users' }),

  appendContributorToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'contributors' })
}

function makeAppendChildToParentMutation ({ parent, child }) {
  return (state, { childId, parentId }) => {
    const resource = findById(state[parent], parentId)

    if (!resource) {
      console.warn(`Appending ${child} ${childId} to ${parent} ${parentId} failed because parent didn't exists.`)
      return
    }

    resource[child] = resource[child] || []

    if (!resource[child].includes(childId)) {
      resource[child].push(childId)
    }
  }
}