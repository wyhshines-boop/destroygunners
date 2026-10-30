import type { Lang } from './translations';

export const SITE_URL = 'https://www.destroygunners.com';

export interface PageSeo {
	title: string;
	description: string;
	image?: string;
	noindex?: boolean;
}

type PageKey = 'home' | 'story' | 'allMechaSave' | 'scaresoul' | 'games' | 'mechas' | 'enemies' | 'assets';

const DG_IMAGE = '/news/private-server-boss-mecha.jpg';
const SCARESOUL_IMAGE = '/scaresoul/shot1.jpg';

export const seo: Record<PageKey, Record<Lang, PageSeo>> = {
	home: {
		en: { title: "Destroy Gunners ZZ Community Server APK | 3.0.0c", description: "Download the Destroy Gunners ZZ community server for Android. Account sync, friend support and Dog Fight. New accounts start with 2,000 coins.", image: "/community/screens/hangar.webp" },
		zh: { title: "毁灭枪手 Destroy Gunners ZZ 社区服下载 | 3.0.0c", description: "下载 Destroy Gunners ZZ 3.0.0c 安卓社区服，支持账户同步、好友助战和 Dog Fight 对战。新账户初始 2000 金币。", image: "/community/screens/hangar.webp" },
		ja: { title: "Destroy Gunners ZZ コミュニティ版 APK | 3.0.0c", description: "Android 向け Destroy Gunners ZZ コミュニティ版。アカウント同期、僚機支援、Dog Fight に対応。新規アカウントは2,000コインで開始。", image: "/community/screens/hangar.webp" },
	},
	story: {
		en: {
			title: 'Destroy Gunners Story & World Setting | Destroy Gunners ZZ',
			description: 'The story, factions, and world setting of the Destroy Gunners mecha series by SHADE Inc.',
			image: DG_IMAGE,
		},
		zh: {
			title: '毁灭枪手剧情故事与世界观 | Destroy Gunners ZZ',
			description: '毁灭枪手（Destroy Gunners）系列的剧情故事、阵营与世界观设定整理。',
			image: DG_IMAGE,
		},
		ja: {
			title: 'Destroy Gunners ストーリーと世界観 | Destroy Gunners ZZ',
			description: 'SHADE Inc. のメカシリーズ Destroy Gunners のストーリー、勢力、世界観設定。',
			image: DG_IMAGE,
		},
	},
	allMechaSave: {
		en: {
			title: 'Destroy Gunners ZZ All Mecha Save File Download',
			description:
				'Download a Destroy Gunners ZZ save file with every mecha unlocked, plus install steps for the offline Android version.',
			image: '/save/all-mecha-save.png',
		},
		zh: {
			title: '毁灭枪手 Destroy Gunners ZZ 全机体解锁存档下载',
			description: '毁灭枪手（Destroy Gunners ZZ）全机体解锁存档下载，附安卓离线版的存档导入步骤。',
			image: '/save/all-mecha-save.png',
		},
		ja: {
			title: 'Destroy Gunners ZZ 全メカ解放セーブデータ ダウンロード',
			description: 'Destroy Gunners ZZ の全メカ解放セーブデータと、Android オフライン版への導入手順。',
			image: '/save/all-mecha-save.png',
		},
	},
	scaresoul: {
		en: {
			title: 'ScareSoul APK Offline Download – SHADE Inc. Gothic Action RPG for Android',
			description:
				'Download ScareSoul, the gothic dark-fantasy action RPG mobile game by SHADE Inc., as an offline Android APK (v1.5.1c). Fan-made cracked edition with unlimited souls and working gacha. Supports English, Japanese, and Chinese.',
			image: SCARESOUL_IMAGE,
		},
		zh: {
			title: '恐惧之魂 ScareSoul 离线版下载 | SHADE 哥特动作 RPG 安卓单机手游',
			description:
				'恐惧之魂（ScareSoul）是 SHADE Inc. 出品的哥特暗黑动作 RPG 手游。本页提供安卓离线破解版 APK 下载（v1.5.1c）：无限灵魂、抽奖可用、单机游玩，支持中文、日文、英文。',
			image: SCARESOUL_IMAGE,
		},
		ja: {
			title: 'ScareSoul オフライン版 APK ダウンロード | SHADE ゴシックアクション RPG',
			description:
				'SHADE Inc. のゴシックダークファンタジー・アクション RPG「ScareSoul」の Android オフライン版 APK（v1.5.1c）。ソウル無制限、ガチャ修正済み。日本語・英語・中国語対応。',
			image: SCARESOUL_IMAGE,
		},
	},
	games: placeholder('Games', '游戏', 'ゲーム'),
	mechas: placeholder('Mecha', '机甲', 'メカ'),
	enemies: placeholder('Enemy', '敌军', '敵'),
	assets: placeholder('Assets', '素材', '素材'),
};

// Under-construction pages: keep them out of the index until they have content.
function placeholder(en: string, zh: string, ja: string): Record<Lang, PageSeo> {
	return {
		en: { title: `${en} | Destroy Gunners`, description: 'This page is under construction.', noindex: true },
		zh: { title: `${zh} | 毁灭枪手 Destroy Gunners`, description: '本页正在建设中。', noindex: true },
		ja: { title: `${ja} | Destroy Gunners`, description: 'このページは準備中です。', noindex: true },
	};
}

export const SCARESOUL_JSON_LD = {
	'@context': 'https://schema.org',
	'@type': 'VideoGame',
	name: 'ScareSoul',
	alternateName: ['Scare Soul', '恐惧之魂'],
	description: 'Gothic dark-fantasy action RPG mobile game by SHADE Inc., preserved as a fan-made offline Android build.',
	genre: ['Action RPG', 'Dark fantasy'],
	gamePlatform: 'Android',
	operatingSystem: 'Android',
	applicationCategory: 'Game',
	inLanguage: ['en', 'ja', 'zh'],
	author: { '@type': 'Organization', name: 'SHADE Inc.' },
	image: `${SITE_URL}${SCARESOUL_IMAGE}`,
	url: `${SITE_URL}/scaresoul`,
};

export const DESTROY_GUNNERS_JSON_LD = {
	'@context': 'https://schema.org',
	'@type': 'VideoGame',
	name: 'Destroy Gunners ZZ',
	alternateName: ['Destroy Gunners', '毁灭枪手'],
	description: 'Mecha action mobile game by SHADE Inc., preserved as a fan-made offline Android build.',
	genre: ['Action', 'Mecha'],
	gamePlatform: 'Android',
	operatingSystem: 'Android',
	applicationCategory: 'Game',
	author: { '@type': 'Organization', name: 'SHADE Inc.' },
	image: `${SITE_URL}${DG_IMAGE}`,
	url: SITE_URL,
};
