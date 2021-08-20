import type { GlobalTheme, GlobalThemeOverrides } from 'naive-ui'

const vars: Partial<GlobalTheme['common']> = {
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
}

const themeOverrides: GlobalThemeOverrides = {
  common: {
    ...vars,
  },
  Button: {
    colorFocusPrimary: '#2681ff',
    borderFocusPrimary: '1px solid #2681ff',
  },
  Message: {
    minWidth: '380px',
    padding: '15px 15px 15px 20px',
    fontSize: '12px',
    iconSize: '16px',
    borderRadius: '0',
    textColorError: '#fff',
    textColorSuccess: '#fff',
    textColorWarning: '#fff',
    colorError: '#5d2b3e',
    colorSuccess: '#1b3964',
    colorWarning: '#593c27',
    closeMargin: '0',
    closeColorError: '#fff',
    closeColorHoverError: vars.infoColor,
    closeColorSuccess: '#fff',
    closeColorHoverSuccess: vars.infoColor,
    closeColorWarning: '#fff',
    closeColorHoverWarning: vars.infoColor,
  },
}

export {
  themeOverrides,
}
