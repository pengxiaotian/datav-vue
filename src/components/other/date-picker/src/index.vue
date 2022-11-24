<template>
  <div class="datav-wrapper" :style="globalStyle" @click.stop>
    <div style="position: relative; float: left;">
      <input
        type="text"
        :style="inputStyle"
        :value="viewDate"
        @click="visible = true"
      >
      <div v-show="visible" :style="calendarStyle">
        <div class="clearfix" style=" padding: 0 5px; margin-bottom: 4px;">
          <div :style="headerLeftStyle" @click="preMonth">
            &lt;
          </div>
          <div :style="selectBoxStyle">
            <select v-model="ynow" :style="selectStyle" @change="changePanel">
              <option v-for="year in yearList" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
          <div :style="selectBoxStyle">
            <select v-model="mnow" :style="selectStyle" @change="changePanel">
              <option v-for="month in monthList" :key="month" :value="month">
                {{ month + 1 }}
              </option>
            </select>
          </div>
          <div :style="headerRightStyle" @click="nextMonth">
            &gt;
          </div>
          <div :style="todayStyle" @click="today">
            今
          </div>
        </div>
        <table style="border-collapse: collapse; table-layout: fixed;">
          <thead :style="theadStyle">
            <th v-for="w in weekdays" :key="w" :style="paddingStyle">
              {{ w }}
            </th>
          </thead>
          <tbody>
            <tr v-for="(tr, i) in dateList" :key="i" style="display: table-row;">
              <td
                v-for="(td, j) in tr"
                :key="j"
                :style="tdStyle"
                @click="selectDate"
                @mouseover="tdMOver"
                @mouseout="tdMOut"
              >
                {{ td }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, computed, toRef, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'
import { getFieldMap, useDataCenter } from '@/components/_mixins/use-data-center'
import { useApiStore } from '@/store/api'
import { useEventStore } from '@/store/event'
import { DatePicker, DatePickerEvent } from './date-picker'

import dayjs from 'dayjs'
import isLeapYear from 'dayjs/plugin/isLeapYear'

dayjs.extend(isLeapYear)

export default defineComponent({
  name: 'VDatePicker',
  props: {
    com: {
      type: Object as PropType<DatePicker>,
      required: true,
    },
  },
  setup(props) {
    const apiStore = useApiStore()
    const eventStore = useEventStore()
    useDataCenter(props.com)

    const dv_data = computed(() => {
      return apiStore.dataMap[props.com.id]?.source ?? {}
    })

    const dv_field = computed(() => {
      return getFieldMap(props.com.apis.source.fields)
    })

    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')

    const visible = ref(false)
    const weekdays = '日_一_二_三_四_五_六'.split('_')
    const dateList = ref<(string | number)[][]>([])

    const nowDate = new Date()
    const ynow = ref(nowDate.getFullYear())
    const mnow = ref(nowDate.getMonth())
    const dnow = ref(nowDate.getDate())

    const yearList = computed(() => {
      const year = nowDate.getFullYear()
      const years = []
      for (let index = 1999; index < year + 10; index++) {
        years.push(index)
      }
      return years
    })

    const monthList = computed(() => {
      const months = []
      for (let index = 0; index < 12; index++) {
        months.push(index)
      }
      return months
    })

    const globalStyle = computed(() => {
      return {
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
        fontFamily: config.value.global.fontFamily,
      }
    })

    const inputStyle = computed(() => {
      const { input } = config.value
      return {
        fontFamily: 'inherit',
        width: `${input.size.width}px`,
        height: `${input.size.height}px`,
        lineHeight: `${input.size.height}px`,
        border: `${input.border.width}px solid ${input.border.color}`,
        borderRadius: `${input.border.radius}px`,
        background: input.bgColor,
        color: input.fontColor,
        fontSize: `${input.fontSize}px`,
        textAlign: input.pos,
      } as Partial<CSSProperties>
    })

    const calendarStyle = computed(() => {
      const { input, calendar } = config.value
      return {
        position: 'absolute',
        overflow: 'hidden',
        paddingTop: '10px',
        zIndex: 999,
        top: `${input.size.height}px`,
        background: calendar.bgColor,
        borderRadius: `${calendar.border.radius}px`,
        border: `${calendar.border.width}px solid${calendar.border.color}`,
      } as Partial<CSSProperties>
    })

    const headerLeftStyle = computed(() => {
      const { calendar } = config.value
      return {
        float: 'left',
        marginRight: '5px',
        cursor: 'pointer',
        borderRadius: '50%',
        textAlign: 'center',
        verticalAlign: 'middle',
        border: '0px solid rgb(204, 204, 204)',
        fontSize: `${calendar.fontSize}px`,
        width: `${calendar.fontSize}px`,
        height: `${calendar.fontSize + 5.5}px`,
        lineHeight: `${calendar.fontSize + 5.5}px`,
        color: calendar.fontColor,
      } as Partial<CSSProperties>
    })

    const headerRightStyle = computed(() => {
      return {
        ...headerLeftStyle.value,
        marginRight: '8px',
      } as Partial<CSSProperties>
    })

    const selectBoxStyle = computed(() => {
      return {
        float: 'left',
        marginRight: '5px',
        cursor: 'pointer',
        height: `${config.value.calendar.fontSize + 5.5}px`,
      } as Partial<CSSProperties>
    })

    const selectStyle = computed(() => {
      const { calendar } = config.value
      return {
        verticalAlign: 'top',
        border: '0',
        padding: `${calendar.select.time}px`,
        background: calendar.selectBGColor,
        color: calendar.fontColor,
        fontSize: `${calendar.fontSize}px`,
      } as Partial<CSSProperties>
    })

    const todayStyle = computed(() => {
      const { calendar } = config.value
      return {
        float: 'right',
        border: '0px solid rgb(204, 204, 204)',
        textAlign: 'center',
        verticalAlign: 'middle',
        cursor: 'pointer',
        borderRadius: '5px',
        padding: `${calendar.select.today / 2}px ${calendar.select.today}px`,
        background: calendar.selectBGColor,
        color: calendar.fontColor,
        fontSize: `${calendar.fontSize}px`,
      } as Partial<CSSProperties>
    })

    const theadStyle = computed(() => {
      return {
        background: config.value.calendar.selectBGColor,
      }
    })

    const paddingStyle = computed(() => {
      const { calendar } = config.value
      return {
        padding: `${calendar.paddingBorder.padding}px`,
        border: `${calendar.paddingBorder.width}px solid ${calendar.paddingBorder.color}`,
        color: calendar.fontColor,
        fontSize: `${calendar.fontSize}px`,
        fontWeight: 'normal',
      } as Partial<CSSProperties>
    })

    const tdStyle = computed(() => {
      const { calendar } = config.value
      return {
        'text-align': 'center',
        'font-size': `${calendar.fontSize}px`,
        cursor: 'pointer',
        padding: `${calendar.paddingBorder.padding}px`,
        border: `${calendar.paddingBorder.width}px solid ${calendar.paddingBorder.color}`,
        color: calendar.fontColor,
        background: 'transparent',
      } as CSSProperties
    })

    const tdOverStyle = computed(() => {
      return {
        ...tdStyle.value,
        color: '#000',
        background: config.value.calendar.selectBGColor,
      }
    })

    const viewDate = computed(() => {
      const { separator } = config.value.input
      const date = dv_data.value[dv_field.value.date] ?? config.value.global.date
      return dayjs(date).format(`YYYY${separator}MM${separator}DD`)
    })

    const hideDatePanel = () => {
      visible.value = false
      document.removeEventListener('click', hideDatePanel)
    }

    watch(() => visible.value, (nv: boolean) => {
      if (nv) {
        document.addEventListener('click', hideDatePanel)
      }
    })

    const calendar = (y: number, m: number) => {
      const dates: (string | number)[][] = []
      const firstday = new Date(y, m, 1).getDay()
      const m2Day = dayjs(`${y}-1-1`).isLeapYear() ? 29 : 28
      const mDays = [31, m2Day, 31, 30, 31, 31, 30, 31, 30, 31, 30, 31]
      const days = mDays[m]
      const rows = Math.ceil((days + firstday) / 7)
      let idx = 0
      for (let i = 0; i < rows; i++) {
        const arr: (string | number)[] = []
        for (let j = 0; j < 7; j++) {
          idx = i * 7 + j
          const date = idx - firstday + 1
          arr.push(date < 1 || date > days ? ' ' : date)
        }
        dates.push(arr)
      }
      dateList.value = dates
    }

    const preMonth = () => {
      if (mnow.value <= 0) {
        mnow.value = 11
        ynow.value--
      } else {
        mnow.value--
      }
      calendar(ynow.value, mnow.value)
    }

    const nextMonth = () => {
      if (mnow.value >= 11) {
        mnow.value = 0
        ynow.value++
      } else {
        mnow.value++
      }
      calendar(ynow.value, mnow.value)
    }

    const today = () => {
      const now = new Date()
      ynow.value = now.getFullYear()
      mnow.value = now.getMonth()
      dnow.value = now.getDate()
      config.value.global.date = `${ynow.value}-${mnow.value + 1}-${dnow.value}`
      calendar(ynow.value, mnow.value)
      hideDatePanel()
    }

    const selectDate = (e: any) => {
      const v = parseInt(e.target.innerText)
      if (v > 0) {
        config.value.global.date = `${ynow.value}-${mnow.value + 1}-${v}`
      }
      hideDatePanel()
    }

    const changePanel = () => {
      calendar(ynow.value, mnow.value)
    }

    const tdMOver = (e: any) => {
      let style = ''
      for (const key of Object.keys(tdOverStyle.value)) {
        style += `${key}:${tdOverStyle.value[key]};`
      }
      e.target.style.cssText = style
    }

    const tdMOut = (e: any) => {
      let style = ''
      for (const key of Object.keys(tdStyle.value)) {
        style += `${key}:${tdStyle.value[key]};`
      }
      e.target.style.cssText = style
    }

    calendar(ynow.value, mnow.value)

    // 当日期变化时
    watch(viewDate, nv => {
      eventStore.handleSubVariablesChange(
        props.com.id,
        DatePickerEvent.changed,
        {
          ...dv_data.value,
          date: nv,
        })
    }, {
      immediate: true,
    })

    return {
      visible,
      weekdays,
      dateList,
      ynow,
      mnow,
      dnow,
      yearList,
      monthList,
      globalStyle,
      inputStyle,
      calendarStyle,
      headerLeftStyle,
      headerRightStyle,
      selectBoxStyle,
      selectStyle,
      todayStyle,
      theadStyle,
      paddingStyle,
      tdStyle,
      tdOverStyle,
      viewDate,
      preMonth,
      nextMonth,
      today,
      selectDate,
      changePanel,
      tdMOver,
      tdMOut,
    }
  },
})
</script>

<style scoped>
  .clearfix::before,
  .clearfix::after {
    display: table;
    clear: both;
    content: " ";
  }
</style>
