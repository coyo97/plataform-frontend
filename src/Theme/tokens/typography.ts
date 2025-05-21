const typography = {
	heading: {
		h1: {
			sans: {
				regular: {
					fontFamily: `'Poppins', sans-serif`,
					fontWeight: 400,
					fontSize: '2.5rem', // 40px
					lineHeight: '3rem', // 48px
				},
				medium: {
					fontFamily: `'Poppins', sans-serif`,
					fontWeight: 500,
					fontSize: '2.5rem',
					lineHeight: '3rem',
				},
				semiBold: {
					fontFamily: `'Poppins', sans-serif`,
					fontWeight: 600,
					fontSize: '2.5rem',
					lineHeight: '3rem',
				},
			},
			serif: {
				regular: {
					fontFamily: `'Allerta Stencil', serif`,
					fontWeight: 400,
					fontSize: '2.5rem',
					lineHeight: '3rem',
				},
			},
		},
		h2: {
			sans: {
				regular: {
					fontFamily: `'Poppins', sans-serif`,
					fontWeight: 400,
					fontSize: '2rem', // 32px
					lineHeight: '2.5rem',
				},
				semiBold: {
					fontFamily: `'Poppins', sans-serif`,
					fontWeight: 600,
					fontSize: '2rem',
					lineHeight: '2.5rem',
				},
			},
		},
		h3: {
			sans: {
				regular: {
					fontFamily: `'Poppins', sans-serif`,
					fontWeight: 400,
					fontSize: '1.5rem', // 24px
					lineHeight: '2rem',
				},
				italic: {
					fontFamily: `'Poppins', sans-serif`,
					fontWeight: 400,
					fontStyle: 'italic',
					fontSize: '1.5rem',
					lineHeight: '2rem',
				},
			},
			monospace: {
				regular: {
					fontFamily: `'DM Sans', monospace`,
					fontWeight: 400,
					fontSize: '1.5rem',
					lineHeight: '2rem',
				},
			},
		},
	},
	display: {
		xl: {
			sans: {
				regular: {
					fontFamily: `'Poppins', sans-serif`,
					fontWeight: 400,
					fontSize: '4rem', // 64px
					lineHeight: '4.5rem', // 72px
				},
				medium: {
					fontFamily: `'Poppins', sans-serif`,
					fontWeight: 500,
					fontSize: '4rem',
					lineHeight: '4.5rem',
				},
			},
			serif: {
				regular: {
					fontFamily: `'Allerta Stencil', serif`,
					fontWeight: 400,
					fontSize: '4rem',
					lineHeight: '4.5rem',
				},
			},
		},
		lg: {
			sans: {
				regular: {
					fontFamily: `'Poppins', sans-serif`,
					fontWeight: 400,
					fontSize: '3rem', // 48px
					lineHeight: '3.5rem', // 56px
				},
				medium: {
					fontFamily: `'Poppins', sans-serif`,
					fontWeight: 500,
					fontSize: '3rem',
					lineHeight: '3.5rem',
				},
			},
			italic: {
				regular: {
					fontFamily: `'Poppins', sans-serif`,
					fontWeight: 400,
					fontStyle: 'italic',
					fontSize: '3rem',
					lineHeight: '3.5rem',
				},
			},
			monospace: {
				regular: {
					fontFamily: `'DM Sans', monospace`,
					fontWeight: 400,
					fontSize: '3rem',
					lineHeight: '3.5rem',
				},
			},
		},
	},
};

export default typography;

export const sizes = {
	xs: '0.75rem',   // 12 px
	sm: '0.875rem',  // 14 px
	md: '1rem',      // 16 px
	lg: '1.125rem',  // 18 px
	xl: '1.25rem',   // 20 px
} as const;

export const weights = {
	light  : 300,
	regular: 400,
	medium : 500,
	bold   : 700,
} as const;

// 👉  export default { heading, display, sizes, weights }

