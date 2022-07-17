<script lang="ts">
import { defineComponent, h, PropType, resolveComponent } from 'vue'
import { ComType, DatavComponent } from '@/components/_models/datav-component'
import DatavTransformItem from './transform-item.vue'
import DatavTransformGroup from './transform-group.vue'

export default defineComponent({
  name: 'DatavTransform',
  props: {
    com: {
      type: Object as PropType<DatavComponent>,
      required: true,
    },
  },
  setup() {
    const create = (com: DatavComponent, parentCom?: DatavComponent) => {
      if (com.type === ComType.com) {
        return h(DatavTransformItem, { com, parentCom }, {
          default: () => {
            return h(resolveComponent(com.name), {
              com,
              style:{
                transform: 'translateZ(0)',
                opacity: com.attr.opacity,
              },
            })
          },
        })
      }

      return h(DatavTransformGroup, { com, parentCom }, {
        default: ({ data }: { data: DatavComponent; }) => {
          return create(data, com)
        },
      })
    }

    return {
      create,
    }
  },
  render() {
    return this.create(this.$props.com)
  },
})
</script>
