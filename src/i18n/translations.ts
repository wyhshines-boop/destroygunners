export const translations = {
	en: {
		nav: {
			home: 'HOME',
			games: 'GAMES',
			story: 'STORY',
			mecha: 'MECHA',
			enemy: 'ENEMY',
			assets: 'ASSETS',
		},
		notifications: {
			title: 'Notifications',
			version: 'Destroy Gunners ZZ v3.0.0a',
			versionItems: [
				'GREE servers have been shut down.',
				'This patch allows offline play.',
				'No copyright infringement intended.',
				'Enjoy the game!',
			],
			patchTitle: 'Offline Patch',
			patchItems: [
				'Fan-made offline patch. Free share.',
				'For game preservation only.',
				'Original game by SHADE Inc.',
				'Patch by: destroygunners.com',
			],
			bugsTitle: 'Known Bugs',
			bugsItems: [
				'"Could not update information." dialog appears 2-3 times on launch. Just tap through — it won\'t affect gameplay.',
				'Tapping in-app purchase buttons causes a crash.',
			],
			compatTitle: 'Compatibility',
			compatItems: [
				'Tested on Snapdragon 8 Gen 3 — runs fine.',
				'Snapdragon 8 Gen 3+ dropped 32-bit app support.',
				"If your OEM didn't add a compatibility layer, the game may crash.",
			],
		},
		download: {
			button: 'Download',
			title: 'Download',
			direct: 'Direct Download',
			googleDrive: 'Google Drive',
			lanzou: 'Lanzou Cloud (pw: dewm)',
		},
		about: {
			title: 'About',
			description: 'This site is currently under construction. Our goal is to build a community hub for the Destroy Gunners series.',
			contact: 'Feel free to reach out:',
		},
		footer: '© Community Preservation Project. Original IP by SHADE Inc.',
		underConstruction: 'This page is under construction.',
		contactPrompt: 'If you have ideas, feel free to reach out:',
	},
	zh: {
		nav: {
			home: '首页',
			games: '游戏',
			story: '故事',
			mecha: '机甲',
			enemy: '敌军',
			assets: '素材',
		},
		notifications: {
			title: '公告',
			version: 'Destroy Gunners ZZ v3.0.0a',
			versionItems: [
				'GREE 服务器已关闭。',
				'此补丁支持离线游玩。',
				'无意侵犯版权。',
				'祝游戏愉快！',
			],
			patchTitle: '离线补丁',
			patchItems: [
				'粉丝自制离线补丁，免费分享。',
				'仅用于游戏存档保存。',
				'原作由 SHADE Inc. 开发。',
				'补丁制作：destroygunners.com',
			],
			bugsTitle: '已知问题',
			bugsItems: [
				'启动时"Could not update information."弹窗会出现 2-3 次，点击确认即可，不影响游戏。',
				'点击应用内购买按钮会导致闪退。',
			],
			compatTitle: '兼容性',
			compatItems: [
				'已在骁龙 8 Gen 3 上测试，运行正常。',
				'骁龙 8 Gen 3 及之后的芯片不再支持 32 位应用。',
				'如果手机厂商未做 32 位兼容，游戏可能会闪退。',
			],
		},
		download: {
			button: '下载',
			title: '下载',
			direct: '直接下载',
			googleDrive: 'Google Drive',
			lanzou: '蓝奏云（密码：dewm）',
		},
		about: {
			title: '关于',
			description: '本站正在建设中，目标是为 Destroy Gunners 系列打造一个社区中心。',
			contact: '欢迎联系我们：',
		},
		footer: '© 社区保存计划。原作版权归 SHADE Inc. 所有。',
		underConstruction: '此页面正在建设中。',
		contactPrompt: '如有想法，欢迎联系：',
	},
} as const;

export type Lang = keyof typeof translations;

export function getLangFromUrl(url: URL): Lang {
	const path = url.pathname;
	if (path.startsWith('/zh')) return 'zh';
	return 'en';
}

export function getLocalizedPath(path: string, lang: Lang): string {
	if (lang === 'en') return path;
	return `/zh${path}`;
}

export function t(lang: Lang) {
	return translations[lang];
}
