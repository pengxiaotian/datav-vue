<template>
  <div></div>
</template>

<script lang='ts' setup>
import { useDataCenter } from '@/components/_mixins/use-data-center'
import { China2dFlyingline } from './index'

const props = defineProps<{
  com: China2dFlyingline
}>()

useDataCenter(props.com)
</script>
