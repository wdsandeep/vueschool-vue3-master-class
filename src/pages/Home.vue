<template>
  <h1 class="push-top">Welcome to the Forum</h1>
  <CategoryList :categories="categories"></CategoryList>
</template>

<script>
import CategoryList from '@/components/CategoryList'
export default {
  components: {
    CategoryList
  },
  name: 'PageHome',
  computed: {
    categories () {
      return this.$store.state.categories
    }
  }
}
</script>

<style scoped>

</style>
