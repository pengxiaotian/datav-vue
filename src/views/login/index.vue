<template>
  <div class="login-container">
    <background-particles />
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      label-position="left"
      class="login-form"
    >
      <live2d />
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          autocomplete="on"
          prefix-icon="el-icon-s-custom"
        />
      </el-form-item>
      <el-tooltip
        v-model="capsTooltip"
        content="大写锁定已打开"
        placement="right"
        manual
      >
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            name="password"
            prefix-icon="el-icon-key"
            show-password
            @keyup="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
      </el-tooltip>
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px;"
        @click.prevent="handleLogin"
      >
        登录
      </el-button>
      <div style="position: relative;">
        <div class="tips">
          <span>账号 : admin</span>
          <span>密码 : 随便填</span>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, watch } from 'vue'
// import { UserModule } from '@/store/modules/user'
import { userStore } from '@/domains/user'
import { useRouter, useRoute } from 'vue-router'
import { config } from '@/config'
import BackgroundParticles from './background-particles.vue'
import live2d from './live2.vue'

require('@/assets/live2d/index.js')

const validateUsername = (rule: any, value: string, callback: Function) => {
  if (!['admin', 'editor'].includes(value)) {
    callback(new Error('请输入正确的用户名'))
  } else {
    callback()
  }
}

const validatePassword = (rule: any, value: string, callback: Function) => {
  if (value.length < 6) {
    callback(new Error('密码不能少于6位'))
  } else {
    callback()
  }
}

const getOtherQuery = (query: any) => {
  return Object.keys(query).reduce((acc: any, cur) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur]
    }
    return acc
  }, {})
}

export default defineComponent({
  name: 'Login',
  components: {
    BackgroundParticles,
    live2d,
  },
  props: { },
  setup() {
    const loginForm = ref({
      username: 'admin',
      password: '111111',
    })

    const loginRules = ref({
      username: [{ required: true, trigger: 'blur', validator: validateUsername }],
      password: [{ required: true, trigger: 'blur', validator: validatePassword }],
    })

    const loginFormRef = ref(null)
    const capsTooltip = ref(false)
    const loading = ref(false)
    const redirect = ref('')
    const otherQuery = ref({})

    const route = useRoute()
    const router = useRouter()

    watch(route, ({ query }) => {
      if (query) {
        redirect.value = query.redirect as string
        otherQuery.value = getOtherQuery(query)
      }
    }, { immediate: true })

    const checkCapslock = ({ shiftKey, key }: any) => {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          capsTooltip.value = true
        } else {
          capsTooltip.value = false
        }
      }

      if (key === 'CapsLock' && capsTooltip.value === true) {
        capsTooltip.value = false
      }
    }

    const handleLogin = () => {
      (loginFormRef.value as any).validate((valid: any) => {
        if (valid) {
          loading.value = true
          userStore().doLogin(loginForm.value.username, loginForm.value.password)
            .then(() => {
              router.push({ path: redirect.value || '/', query: otherQuery.value })
            })
            .finally(() => {
              loading.value = false
            })
        } else {
          return false
        }
      })
    }

    return {
      loginForm,
      loginRules,
      loginFormRef,
      capsTooltip,
      loading,
      redirect,
      otherQuery,
      checkCapslock,
      handleLogin,
      title: ref(config.title),
    }
  },
})
</script>

<style lang="scss">
.login-container {
  width: 100%;
  min-height: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #111222;

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 5px;
  }

  .el-input {
    height: 48px;

    input {
      height: 48px;
      color: #fff;
      background: transparent;
      border: 0;
      border-radius: 0;
      -webkit-appearance: none;
      caret-color: #fff;

      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px #283443 inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }

  .login-form {
    position: relative;
    width: 480px;
    max-width: 100%;
    padding: 0 30px;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    margin-bottom: 10px;
    font-size: 14px;
    color: #fff;

    span {
      margin-right: 16px;
    }
  }
}
</style>
