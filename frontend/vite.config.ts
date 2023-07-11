import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: [
			{
				find: 'src',
				replacement: resolve(__dirname, 'src')
			},
			{
				find: 'wailsjs',
				replacement: resolve(__dirname, 'wailsjs')
			}
		]
	},
	plugins: [react()]
});
