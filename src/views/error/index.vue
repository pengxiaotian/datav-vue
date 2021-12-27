<template>
  <div class="datav-error">
    <div class="error-img"></div>
    <div class="back-home">
      <div class="error-text">{{ $t('error.page.code_' + errCode) }}</div>
      <div class="error-info">
        <p v-if="pathname" class="info-p">
          {{ $t('error.page.errorUrl') }}: {{ pathname }}
        </p>
        <p v-if="message" class="info-p">
          {{ $t('error.page.message') }}: {{ message }}
        </p>
      </div>
      <a class="go-back" href="/">{{ $t('error.page.back') }}</a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'NotFound',
  setup() {
    const route = useRoute()

    const query = route.query as Record<string, string>
    const errCode = query.errCode || '404'
    const pathname = query.pathname || ''
    const message = query.message || ''

    return {
      errCode,
      pathname,
      message,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/function';

.datav-error {
  display: flex;
  align-items: center;
  justify-content: center;

  .error-img {
    width: 100%;
    height: 100vh;
    min-width: 1024px;
    min-height: 768px;
    background-size: cover;
    background-position: center;
    background-image: url(com-cdn('datav/error-bg-3838-2136.png'));
  }

  .back-home {
    position: absolute;
    display: flex;
    height: 100px;
    justify-content: space-between;
    flex-direction: column;
    color: #fff;
    margin-top: 210px;
    margin-left: 30px;

    .error-text {
      text-align: center;
      font-size: 18px;
    }

    .error-info {
      font-size: 12px;
      color: var(--datav-font-color);

      .info-p {
        padding: 2px 0;
        color: rgb(255 255 255 / 80%);
      }
    }

    .go-back {
      margin: 16px auto;
      font-size: 14px;
      display: block;
      width: 128px;
      line-height: 32px;
      height: 36px;
      text-align: center;
      background-color: rgb(0 186 255 / 60%);
      color: currentColor;
    }
  }
}
</style>
