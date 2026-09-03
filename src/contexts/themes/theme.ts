import { createTheme } from '@mui/material/styles';

/**
 * 단일 라이트 테마 — 기존 화면의 slate 계열 톤을 그대로 옮겼다.
 * spacing 을 4 로 두어 Tailwind 의 4px 단위와 눈금을 맞춘다.
 */
const theme = createTheme({
	spacing: 4,
	shape: { borderRadius: 12 },
	palette: {
		primary: { main: '#0f172a' }, // slate-900
		background: { default: '#f8fafc', paper: '#ffffff' }, // slate-50 / white
		text: { primary: '#0f172a', secondary: '#64748b' }, // slate-900 / slate-500
		divider: '#e2e8f0', // slate-200
	},
	typography: {
		fontFamily: 'inherit',
		button: { textTransform: 'none' },
	},
	components: {
		MuiCard: {
			styleOverrides: {
				root: {
					boxShadow: 'none',
					border: '1px solid #e2e8f0',
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: { whiteSpace: 'nowrap' },
			},
		},
	},
});

export default theme;
