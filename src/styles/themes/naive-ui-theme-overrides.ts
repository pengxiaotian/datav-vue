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

const vars2 = {
  darkColor: '#262c33',
  guiPrimaryColor: '#2483ff',
  guiComponentBgColor: '#303640',
}

const themeOverrides: GlobalThemeOverrides = {
  common: {
    ...vars,
  },
  Button: { // small 和 medium 一样大
    fontWeight: '700',
    fontWeightText: '700',
    fontWeighGhost: '700',

    iconSizeTiny: '12px',

    heightTiny: '26px',
    heightSmall: '32px',
    heightMedium: '32px',

    paddingTiny: '0 15px',
    paddingSmall: '0 24px',
    paddingMedium: '0 24px',

    color: '#0000',
    colorHover: vars.primaryColorHover,
    colorPressed: vars.primaryColorPressed,
    colorFocus: vars.primaryColor,

    colorFocusPrimary: vars.primaryColor,

    border: `1px solid ${vars.primaryColor}`,
    borderHover: `1px solid ${vars.primaryColorHover}`,
    borderPressed: `1px solid ${vars.primaryColorPressed}`,
    borderFocus: `1px solid ${vars.primaryColor}`,

    borderFocusPrimary: `1px solid ${vars.primaryColor}`,

    textColor: vars.primaryColor,
    textColorHover: '#fff',
    textColorPressed: '#fff',
    textColorFocus: '#fff',

    textColorGhost: vars.primaryColor,
    textColorGhostHover: '#fff',
    textColorGhostPressed: '#fff',
    textColorGhostFocus: vars.primaryColor,
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
  Dialog: {
    color: '#303640',
    padding: '16px 20px',
    textColor: '#fff',
    closeColor: vars.primaryColor,
    closeColorHover: vars.primaryColor,
    closeColorPressed: vars.primaryColor,
    closeMargin: '16px 20px 0 0',
    iconSize: '65px',
    iconColor: '#ff4f43',
    iconMargin: '0 0 10px 0',
    contentMargin: '0 0 10px 0',
  },
  Dropdown: {
    fontSizeMedium: '12px',
    padding: '0',
    borderRadius: '1px',
    color: vars2.darkColor,
    prefixColor: '#fff',
    optionColorHover: '#1a1b1d',
    optionTextColor: '#fff',
    optionTextColorHover: '#fff',
    optionHeightMedium: '30px',
    optionIconSizeMedium: '12px',
    optionIconPrefixWidthMedium: '12px',
    dividerColor: '#1a1b1d',
  },
  Switch: {
    buttonWidthMedium: '10px',
    buttonHeightMedium: '10px',
    buttonWidthPressedMedium: '14px',
    railWidthMedium: '26px',
    railHeightMedium: '12px',

    buttonWidthSmall: '6px',
    buttonHeightSmall: '6px',
    buttonWidthPressedSmall: '8px',
    railWidthSmall: '16px',
    railHeightSmall: '8px',

    railColor: '#0b0c0d',
    railColorActive: vars2.guiPrimaryColor,
    boxShadowFocus: 'none',
  },
  Tooltip: {
    padding: '5px',
    color: vars.primaryColor,
    peers: {
      Popover: {
        fontSize: '12px',
      },
    },
  },
}

export {
  themeOverrides,
}
