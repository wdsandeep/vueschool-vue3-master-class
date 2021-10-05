<template>
  <h1>Welcome to the Forum</h1>
  <CategoryList :categories="categories"></CategoryList>
</template>

<script>
import sourceData from '@/data.json'
import CategoryList from '@/components/CategoryList'
export default {
  components: {
    CategoryList
  },
  name: 'PageHome',
  data () {
    return {
      categories: sourceData.categories
    }
  }
}
</script>

<style scoped>

</style>
