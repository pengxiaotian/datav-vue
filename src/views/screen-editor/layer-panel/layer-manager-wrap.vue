<script lang="ts">
import { defineComponent } from 'vue'
import { DatavComponent } from '@/components/_models/datav-component'
import { useComStore } from '@/store/com'

export default defineComponent({
  name: 'LayerManagerWrap',
  props: {
    rank: {
      type: Number,
      default: 3,
    },
  },
  setup(props, ctx) {
    const comStore = useComStore()

    const createNode = (com: DatavComponent, idx: number, level: number) => {
      const data = { com, idx, level }
      if (level < props.rank && com.children && !com.fold) {
        return [ctx.slots.default(data), ...create(com.children, level + 1)]
      }
      return ctx.slots.default(data)
    }

    const create = (coms: DatavComponent[], level: number) => {
      const len = coms.length - 1
      return coms.map((_, idx) => {
        return createNode(coms[len - idx], idx, level)
      })
    }

    return () => create(comStore.coms, 0)
  },
})
</script>
