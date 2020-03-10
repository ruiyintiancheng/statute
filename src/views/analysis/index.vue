<template>
  <div class="search-result base-container">
  </div>  
</template>
<script>
export default {
  data() {
    return {

    }
  },
  mounted() {
    this.$router.push({
      path: '/search',
      query: {
        type: 'analysis'
      }
    })
  },
  methods: {
  }
}
</script>
<style lang="scss">

</style>
