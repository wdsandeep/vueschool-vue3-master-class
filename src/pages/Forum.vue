<template>
  <div v-if="asyncDataStatus_ready" class="container">
    <div v-if="forum" class="col-full push-top">
      <AppHead>
        <title>{{ forum?.name }}</title>
        <meta property="og:title" :content="forum?.name">
        <meta name="twitter:title" :content="forum?.name">
      </AppHead>
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
      <v-pagination
        v-model="page"
        :pages="totalPages"
        active-color="#57AD8D"
      />

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
      threadLoaded: false,
      page: parseInt(this.$route.query.page) || 1,
      perPage: 10
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
      // return this.forum.threads.map(threadId => this.$store.getters['threads/thread'](threadId))
      return this.$store.state.threads.items
        .filter(thread => thread.forumId === this.forum.id)
        .map(thread => this.$store.getters['threads/thread'](thread.id))
    },
    threadCount () {
      return this.forum.threads?.length || 0
    },
    totalPages () {
      if (!this.threadCount) return 0
      return Math.ceil(this.threadCount / this.perPage)
    }
  },
  methods: {
    ...mapActions('forums', ['fetchForum']),
    ...mapActions('threads', ['fetchThreads', 'fetchThreadsByPage']),
    ...mapActions('users', ['fetchUsers'])
  },
  async created () {
    // console.log('forum created')
    const forum = await this.fetchForum({ id: this.id })
    // const threads = await this.fetchThreads({ ids: forum.threads })
    const threads = await this.fetchThreadsByPage({ ids: forum.threads, page: this.page, perPage: this.perPage })
    // console.log(threads)
    await this.fetchUsers({ ids: threads.map(thread => thread.userId) })
    this.threadLoaded = true
    this.asyncDataStatus_fetched()
  },
  watch: {
    async page (page) {
      // const threads = await this.fetchThreadsByPage({ ids: this.forum.threads, page: this.page, perPage: this.perPage })
      // await this.fetchUsers({ ids: threads.map(thread => thread.userId) })
      this.$router.push({ query: { page: this.page } })
    }
  }
}
</script>

<style scoped>

</style>
