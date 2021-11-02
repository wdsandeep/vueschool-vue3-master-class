<template>
  <div  class="text-center" style="margin-bottom:15px;">
      <button class="btn-green btn-xsmall" @click.prevent="getRandomImage">
          Random Avatar
      </button>
      <br/>
      <small style="opacity:0.5;">Powered by <a href="https://pixabay.com">Pixabay</a></small>
  </div>
</template>

<script>
import { arrayRandom } from '@/helpers'
export default {
  methods: {
    async getRandomImage () {
      const searchTerms = ['cats', 'dogs', 'abstract', 'cars', 'mountains', 'beach', 'landscape', 'object', 'food', 'flower']
      const randomWord = arrayRandom(searchTerms)
      const res = await fetch(`https://pixabay.com/api/?key=24143908-9da5692a0ace5d078457420ef&q=${randomWord}`)
      const data = await res.json()
      const randomImage = arrayRandom(data.hits)
      this.$emit('hit', randomImage.webformatURL)
    }
  }
}
</script>

<style>

</style>
