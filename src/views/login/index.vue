<template>
  <div class="login-container">
    <BackgroundParticles />
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      label-position="left"
      class="login-form"
    >
      <div class="live2d-wrap">
        <div id="cover" class="live2d-cover">
          <div class="live2d-cover-text">
            <span style="color: cyan;">MIMI</span>
            <span style="color: white;">POWERED</span>
          </div>
          <div class="live2d-cover-line"></div>
          <div id="handle" class="live2d-cover-handle"></div>
        </div>
        <canvas id="live2d" width="500" height="500"></canvas>
      </div>
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
import BackgroundParticles from './BackgroundParticles.vue'

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
  name: 'VLogin',
  components: {
    BackgroundParticles,
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

.live2d-wrap {
  position: relative;
  background-color: #999;
  clip-path: circle(120px at center);

  .live2d-cover {
    position: absolute;
    background-color: #cb3837;
    width: 100%;
    height: 100%;
    bottom: 10%;
    transition: all 1s;
    box-shadow: 0 0 0 5px rgba(0, 0, 0, 0.1);
  }

  .live2d-cover-text {
    position: absolute;
    bottom: 30%;
    font-size: 2em;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0.4;
    font-weight: bold;
  }

  .live2d-cover-line {
    position: absolute;
    background: rgba(255, 255, 255, 0.1);
    width: 100%;
    height: 10px;
    bottom: 0;
  }

  .live2d-cover-handle {
    position: absolute;
    background: #ccc;
    bottom: -2px;
    box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.1);
    height: 8px;
    left: 50%;
    margin-left: -15px;
    width: 30px;
    cursor: pointer;
  }
}

#live2d {
  height: 300px;
  width: 300px;
  margin-left: 60px;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}
</style>
