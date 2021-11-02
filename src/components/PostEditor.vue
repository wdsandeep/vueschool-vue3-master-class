<template>
  <div class="col-full">
    <VeeForm @submit="save" :key="formKey">
      <AppFormField as="textarea" v-model="postCopy.text" name="text" label="" rules="required" cols="30" rows="10" />
      <div class="form-actions">
        <button type="submit" class="btn-blue">{{ post.id ? 'Update Post' : 'Submit Post' }}</button>
      </div>
    </VeeForm>
  </div>
</template>

<script>

export default {
  name: 'PostEditor',
  props: {
    post: {
      type: Object,
      default: () => ({ text: null })
    }
  },
  data () {
    return {
      postCopy: { ...this.post },
      formKey: Math.random()
    }
  },
  methods: {
    save () {
      this.$emit('save', { post: this.postCopy })
      this.postCopy.text = ''
      this.formKey = Math.random()
    }
  }
}
</script>

<style scoped>

</style>
