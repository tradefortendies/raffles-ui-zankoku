import { CSSProperties } from 'react';
import { createTheme } from '@material-ui/core';

declare module '@material-ui/styles' {
	interface TypographyVariants {
		body3: CSSProperties;
	}
	interface TypographyVariantsOptions {
		body3?: CSSProperties;
	}
}

export const Colors = {
	PRIMARY: '#0f0f0f',
	SECONDARY: '#ffffff',
	Background: '#0f0f0f',
	black: '#000000',
	grey: '#E5E5E5',
};

export const Fonts = {
	ShareTech: 'Share Tech',
	ShareTechMono: 'Share Tech Mono',
	Bebas: 'Bebas Neue',
	Cedarville: 'Cedarville Cursive',
};

export const Transition = {
	Default: 'all 0.5s ease 0s',
};

const DefaultTheme = createTheme({
	palette: {
		primary: {
			main: Colors.PRIMARY,
		},
		secondary: {
			main: Colors.SECONDARY,
		},
		background: {
			default: Colors.PRIMARY,
		},
	},
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 1050,
			lg: 1340,
			xl: 1536,
		},
	},
	typography: {
		fontSize: 16,
		h1: {
			fontWeight: 400,
			fontSize: '5rem',
		},
		h2: {
			fontWeight: 400,
			fontSize: '2.5rem',
		},
		h3: {
			fontWeight: 400,
			fontSize: '2rem',
		},
		h4: {
			fontWeight: 400,
			fontSize: '1.75rem',
		},
		h5: {
			fontWeight: 400,
			fontSize: '1.5rem',
		},
		h6: {
			fontWeight: 400,
			fontSize: '1.25rem',
		},
		body1: {
			fontSize: '1.125rem',
		},
		body2: {
			fontSize: '1rem',
		},
		fontFamily: 'inherit',
	},
});

export default DefaultTheme;
