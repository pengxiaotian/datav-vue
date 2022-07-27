<script lang="ts">
import { defineComponent, h, PropType, resolveComponent } from 'vue'
import { ComType, DatavComponent } from '@/components/_models/datav-component'
import { DatavGroup } from '@/components/_internal/group'
import DatavTransformLayer from './transform-layer.vue'

export default defineComponent({
  name: 'DatavTransform',
  props: {
    com: {
      type: Object as PropType<DatavComponent>,
      required: true,
    },
  },
  setup() {
    const create = (com: DatavComponent, parentCom?: DatavComponent, editable?: boolean) => {
      if (com.type === ComType.com) {
        return h(DatavTransformLayer, {
          com,
          parentCom,
          editable,
        }, {
          default: () => h(resolveComponent(com.name), {
            com,
            style:{
              transform: 'translateZ(0)',
              opacity: com.attr.opacity,
            },
          }),
        })
      }

      return h(DatavTransformLayer, {
        com: com as DatavGroup,
        parentCom: parentCom as DatavGroup,
        editable,
      }, {
        default: ({ data, editable }) => {
          return create(data, com, editable)
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
