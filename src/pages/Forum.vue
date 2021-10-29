<template>
  <div v-if="asyncDataStatus_ready" class="container">
    <div v-if="forum" class="col-full push-top">
      <div class="forum-header">
        <div class="forum-details">
          <h1>{{ forum.name }}</h1>
          <p class="text-lead">{{ forum.description }}</p>
        </div>
        <router-link :to="{ name: 'ThreadCreate', params: {forumId: forum.id}}" class="btn-green btn-small">Start a thread</router-link>
      </div>
    </div>
    <div v-if="threadLoaded" class="col-full push-top">
      <thread-list :threads="threads" />
    </div>
  </div>
</template>

<script>
import ThreadList from '@/components/ThreadList'
import asyncDataStatus from '@/mixins/asyncDataStatus'
import { findById } from '@/helpers'
import { mapActions } from 'vuex'
export default {
  name: 'Forum',
  mixins: [asyncDataStatus],
  data () {
    return {
      threadLoaded: false
    }
  },
  components: {
    ThreadList
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  computed: {
    forum () {
      if (!this.id) return null
      return findById(this.$store.state.forums.items, this.id) || null
    },
    threads () {
      if (!this.forum) return []
      return this.forum.threads.map(threadId => this.$store.getters['threads/thread'](threadId))
    }
  },
  methods: {
    ...mapActions('forums', ['fetchForum']),
    ...mapActions('threads', ['fetchThreads']),
    ...mapActions('users', ['fetchUsers'])
  },
  async created () {
    const forum = await this.fetchForum({ id: this.id })
    const threads = await this.fetchThreads({ ids: forum.threads })
    await this.fetchUsers({ ids: threads.map(thread => thread.userId) })
    this.threadLoaded = true
    this.asyncDataStatus_fetched()
  }
}
</script>

<style scoped>

</style>
