
import type { GlobalThemeOverrides } from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
  common: {
    fontFamily: "'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif !important",
    primaryColor: '#2681ff',
    primaryColorHover: '#409fff',
    primaryColorPressed: '#2681ff',
    errorColor: '#f15532',
    warningColor: '#f27a24',
    infoColor: '#90a0ae',
    successColor: '#50e3c2',
    borderRadius: '0',
    borderRadiusSmall: '0',
    boxShadow1: 'none',
    boxShadow2: 'none',
    boxShadow3: 'none',
  },
  Button: {
    colorFocusPrimary: '#2681ff',
    borderFocusPrimary: '1px solid #2681ff',
  },
}

export {
  themeOverrides,
}
