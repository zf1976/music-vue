<template>
  <div id="myiframe" >
    <iframe :src="src"
            id="iframeContain"
            name="iframeContain"
            seamless
            scrolling="yes"
            style="height: 1200px; width: 100%;">
    </iframe>
  </div>
</template>

<script>

export default {
  name: 'Api',
  data () {
    return {
      src: 'http://localhost:8888/swagger-ui.html'
    }
  }
}
</script>

<style scoped>

</style>
