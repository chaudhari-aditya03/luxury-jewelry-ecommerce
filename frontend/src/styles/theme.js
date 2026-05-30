export const theme = {
  token: {
    colorPrimary: '#C6A769', // Luxury Gold
    colorSuccess: '#106f4f',
    colorWarning: '#ca8a04',
    colorError: '#dc2626',
    colorInfo: '#C6A769',
    colorTextBase: '#1f1f1f',
    colorBgBase: '#ffffff',
    colorBgLayout: '#f8f5f0',
    colorBorder: '#eadfca',
    fontFamily: "'Inter', system-ui, sans-serif",
    borderRadius: 14,
    wireframe: false,
  },
  components: {
    Button: {
      borderRadius: 9999,
      controlHeight: 44,
      fontWeight: 600,
      primaryShadow: '0 4px 14px 0 rgba(198, 167, 105, 0.25)',
    },
    Card: {
      borderRadiusLG: 24,
      boxShadowTertiary: '0 12px 36px 0 rgba(0,0,0,0.03)',
    },
    Input: {
      controlHeight: 44,
      borderRadius: 9999,
    },
    Select: {
      controlHeight: 44,
      borderRadius: 9999,
    },
    Layout: {
      headerBg: '#ffffff',
      bodyBg: '#f8f5f0',
    },
    Menu: {
      activeBarBorderWidth: 0,
      itemSelectedColor: '#C6A769',
      itemHoverColor: '#C6A769',
    },
    Typography: {
      fontFamily: "'Inter', system-ui, sans-serif",
    }
  },
};

