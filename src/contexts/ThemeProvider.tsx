import theme from '@/src/contexts/themes/theme';
import { CssBaseline } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import type { ReactNode } from 'react';

/** MUI 테마 주입 — 다크모드·테마 다중화는 필요해지면 추가한다 */
const ThemeProvider = ({ children }: { children: ReactNode }) => (
	<MuiThemeProvider theme={theme}>
		<CssBaseline />
		{children}
	</MuiThemeProvider>
);

export default ThemeProvider;
