export const theme = {
  token: {
    colorPrimary: '#D4AF37', // Gold
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    colorInfo: '#D4AF37',
    colorTextBase: '#1f1f1f',
    colorBgBase: '#ffffff',
    fontFamily: "'Inter', sans-serif",
    borderRadius: 8,
    wireframe: false,
  },
  components: {
    Button: {
      borderRadius: 6,
      controlHeight: 40,
      fontWeight: 600,
      primaryShadow: '0 4px 14px 0 rgba(212, 175, 55, 0.39)',
    },
    Card: {
      borderRadiusLG: 12,
      boxShadowTertiary: '0 4px 20px 0 rgba(0,0,0,0.05)',
    },
    Input: {
      controlHeight: 45,
      borderRadius: 6,
    },
    Select: {
      controlHeight: 45,
      borderRadius: 6,
    },
    Layout: {
      headerBg: '#ffffff',
      bodyBg: '#f5f5f5',
    },
    Menu: {
      activeBarBorderWidth: 0,
      itemSelectedColor: '#D4AF37',
      itemHoverColor: '#D4AF37',
    },
    Typography: {
      fontFamilyCode: "'Playfair Display', serif",
    }
  },
};
