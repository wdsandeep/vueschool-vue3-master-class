<template>
  <div class="col-full push-top">

    <h1>Editing <i>{{ thread.title }}</i></h1>

    <ThreadEditor :title="thread.title" :text="text" @save="save" @cancel="cancel" />
  </div>
</template>

<script>
import ThreadEditor from '@/components/ThreadEditor'
import { findById } from '@/helpers'
export default {
  name: 'ThreadEdit',
  components: {
    ThreadEditor
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    thread () {
      return findById(this.$store.state.threads, this.id)
    },
    text () {
      return findById(this.$store.state.posts, this.thread.posts[0]).text
    }
  },
  methods: {
    async save ({ title, text }) {
      console.log('hitting save')
      const thread = await this.$store.dispatch('updateThread', {
        id: this.id,
        title,
        text
      })
      console.log('hitting save end')
      // dispatch a vuex action
      await this.$router.push({ name: 'ThreadShow', params: { id: thread.id } })
    },
    cancel () {
      this.$router.push({ name: 'ThreadShow', params: { id: this.id } })
    }
  }
}
</script>

<style scoped>

</style>
