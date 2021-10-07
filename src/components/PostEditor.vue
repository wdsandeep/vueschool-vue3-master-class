<template>
  <div class="col-full">
    <form @submit.prevent="save">
      <div class="form-group">
        <textarea v-model="text"  name="" id="" cols="30" rows="10" class="form-input"></textarea>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-blue">Submit Post</button>
      </div>
    </form>
  </div>
</template>

<script>

export default {
  name: 'PostEditor',
  data () {
    return {
      text: ''
    }
  },
  methods: {
    save () {
      const post = {
        text: this.text
      }
      this.$emit('save', { post })
      // console.log(post)
      // this.posts.push(post)
      // this.thread.posts.push(postId)
      this.text = ''
    }
  }
}
</script>

<style scoped>

</style>
