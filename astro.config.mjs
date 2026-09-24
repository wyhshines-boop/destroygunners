// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Under-construction pages carry noindex, so keep them out of the sitemap too.
const placeholderPages = ['games', 'mechas', 'enemies', 'assets'];

// https://astro.build/config
export default defineConfig({
	site: 'https://www.destroygunners.com',
	trailingSlash: 'never',
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'zh', 'ja'],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	integrations: [
		sitemap({
			i18n: {
				defaultLocale: 'en',
				locales: { en: 'en', zh: 'zh-CN', ja: 'ja-JP' },
			},
			filter: (page) => !placeholderPages.some((name) => new RegExp(`/${name}/?$`).test(page)),
		}),
	],
});
