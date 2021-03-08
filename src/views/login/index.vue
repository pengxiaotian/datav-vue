<template>
  <div>
    <input v-model="username" type="text">
    <input v-model="password" type="text">
    <button @click="login">
      登录
    </button>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
// import { UserModule } from '@/store/modules/user'
import { userStore } from '@/domains/user'

export default defineComponent({
  name: 'VLogin',
  props: { },
  setup(props) {
    // init here
    console.log(props)
  },
  data() {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    login() {
      userStore().doLogin(this.username, this.password)
        .then(() => {
          this.$router.push({ path: '/' })
        })
    },
  },
})
</script>

<style lang="scss" scoped>
// todo
</style>
