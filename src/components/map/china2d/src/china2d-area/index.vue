<template>
  <div></div>
</template>

<script lang='ts' setup>
import { useDataCenter } from '@/components/_mixins/use-data-center'
import { China2dArea } from './index'

const props = defineProps<{
  com: China2dArea
}>()

useDataCenter(props.com)
</script>
