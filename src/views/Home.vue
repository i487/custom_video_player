<template>
  <div class="container bg-blue-300 py-16 h-100">
    <div class="flex flex-col justify-center items-center gap-8">
      <Player v-for="(item, index) in videos" :key="index"
      :url="item.url"
      :name="item.name"
      :author="item.author"
      class=""
       />
    </div>
  </div>
</template>

<script>
  import Player from '../components/Player.vue';

  export default {
    name: "Home",
    components: {
      Player
    },
    data() {
      return {
        videos: [
          {
            url: require('../assets/video/vid.mp4'),
            name: 'Believer',
            author: 'Imagine Dragons',
          },
          // {
          //   url: require('../assets/video/vid1.mp4'),
          //   name: 'Believer',
          //   author: 'Imagine Dragons',
          // },
          // {
          //   url: require('../assets/video/vid2.mp4'),
          //   name: 'Believer',
          //   author: 'Imagine Dragons',
          // },
        ],
      }
    }
  };
</script>