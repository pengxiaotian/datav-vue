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
import { UserModule } from '@/store/modules/user'

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
      UserModule.login({ username:this.username, password:this.password })
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
