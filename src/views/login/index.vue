<template>
  <div class="login-container">
    <background-particles />
    <n-config-provider
      :theme-overrides="{
        Input: {
          color: '#0000',
          colorFocus: '#0000',
          colorFocusError: '#0000',
          colorFocusWarning: '#0000',
          textColor: '#fff',
          caretColor: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        },
      }"
      abstract
    >
      <n-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-placement="left"
        size="small"
        class="login-form"
      >
        <live2d />

        <div class="lang-select">
          <g-lang-select />
        </div>

        <n-form-item path="username">
          <n-input
            v-model:value="loginForm.username"
            placeholder="用户名"
            type="text"
            size="large"
          >
            <template #prefix>
              <n-icon>
                <IconUser />
              </n-icon>
            </template>
          </n-input>
        </n-form-item>
        <n-form-item path="password">
          <n-tooltip :show="capsTooltip" placement="top-start">
            <template #trigger>
              <n-input
                v-model:value="loginForm.password"
                placeholder="请输入密码"
                type="password"
                size="large"
                show-password-on="click"
                @keydown="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter="handleLogin"
              >
                <template #prefix>
                  <n-icon>
                    <IconKey />
                  </n-icon>
                </template>
              </n-input>
            </template>
            <span> 大写锁定已打开 </span>
          </n-tooltip>
        </n-form-item>
        <n-button
          :loading="loading"
          type="primary"
          size="large"
          style="width: 100%; margin-bottom: 20px;"
          @click="handleLogin"
        >
          {{ $t('login.login') }}
        </n-button>
        <div style="position: relative;">
          <div class="tips">
            <span>{{ $t('login.username') }}: admin</span>
            <span>{{ $t('login.password') }}: 123123</span>
          </div>
        </div>
      </n-form>
    </n-config-provider>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, watch, defineAsyncComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import { IconUser, IconKey } from '@/icons'

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
    BackgroundParticles: defineAsyncComponent(() => import('./background-particles.vue')),
    live2d: defineAsyncComponent(() => import('./live2d.vue')),
    IconUser,
    IconKey,
  },
  setup() {
    const userStore = useUserStore()

    const loginForm = ref({
      username: 'admin',
      password: '123123',
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
      (loginFormRef.value as any).validate((errors: any) => {
        if (!errors) {
          loading.value = true
          userStore.login(loginForm.value.username, loginForm.value.password)
            .then(() => {
              router.push({ path: redirect.value || '/', query: otherQuery.value })
            })
            .finally(() => {
              loading.value = false
            })
        }
      })
    }

    return {
      loginForm,
      loginRules,
      loginFormRef,
      capsTooltip,
      loading,
      checkCapslock,
      handleLogin,
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

  .lang-select {
    float: right;
    margin-top: -24px;
    cursor: pointer;
    color: #bcc9d4;
  }
}
</style>
