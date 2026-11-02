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
			title: "Destroy Gunners ZZ Downloads",
			versions: [
				{
					id: 'c',
					name: "Community Server",
					label: 'v3.0.0c',
					apk: '/downloads/DGunsZZ_3.0.0c.apk?build=126',
					hasMirror: false,
					mirrors: { googleDrive: '', lanzou: '', lanzouPw: '' },
					sections: [{ title: "3.0.0c Community Server · Build 126 (2026-11-02)", items: ["Translated 66 more tutorial and help messages, restored the Account nickname editor, and fixed friend searches using the wrong player ID.", "Chinese, English and Japanese can be selected in the game settings. Restart to apply.", "Create an account to sync progress across devices and add friends for wingman support.", "Dog Fight is open, with weekly seasons. Training BOTs fill in when no suitable player is available.", "Updated purchase feedback and fixed recovery of paid orders.", "Optional update reminders are shown when a newer build is available on this website.", "Daily login rewards: claim today’s reward in the lobby or Account panel. Missed days expire.", "New accounts start with 2,000 coins. Mecha keep their normal unlock requirements.", "Account switching now loads the matching save. Update the original device and confirm progress is synced before moving to another phone.", "Open Account for news, events and guides. An internet connection is required; testing is ongoing.", "If the game crashes or reports a save-data error, first confirm your account is linked and your progress is synced. Then try uninstalling the old version, deleting data/net.gree.android.pf.greeapp58559a from device storage, and reinstalling. Unsynced local progress will be lost."] }],
				},
				{
					id: 'cx',
					name: 'Version CX',
					label: 'v3.0.0cx',
					apk: '/downloads/DGunsZZ_3.0.0cx.apk',
					hasMirror: false,
					mirrors: { googleDrive: '', lanzou: '', lanzouPw: '' },
					sections: [{
						title: 'Destroy Gunners ZZ v3.0.0cx (2026-10-28)',
						items: [
							'All 23 original playable mecha are unlocked.',
							'Based on v3.0.0b; retains its offline play and free in-app purchases.',
							'Existing progress, equipment and currency are preserved.',
							'Includes a shop memory fix for the full mecha roster.',
						],
					}],
				},
				{
					id: 'b',
					name: 'Version B',
					label: 'v3.0.0b',
					apk: '/downloads/DGunsZZ_3.0.0b.apk',
					hasMirror: true,
					mirrors: {
						googleDrive: 'https://drive.google.com/file/d/1RdkYnTKCYO4pM74SVMKyVMlvuq6ha9VL/view?usp=sharing',
						lanzou: 'https://wwbdr.lanzout.com/iOoet3mwd5ri',
						lanzouPw: '34p3'
					},
					sections: [
						{
							title: 'Destroy Gunners ZZ v3.0.0b (2026-04-10)',
							items: [
								'Cracked IAP: You can buy gold and items for free.',
								'Fixed the "could not update information" dialog issue.',
								'Direct overwrite installation supported. The application may crash on the first launch after updating.',
								'Note: Occasional crash after IAP (normal behavior, doesn\'t affect gameplay).',
							],
						},
						{
							title: 'Offline Patch',
							items: [
								'Fan-made and free to share.',
							],
						},
						{
							title: 'Compatibility',
							items: [
								'Tested on Snapdragon 8 Gen 3; devices without 32-bit app support may crash.',
							],
						},
					],
				},
				{
					id: 'bx',
					name: 'Version BX',
					label: 'v3.0.0bx',
					apk: '/downloads/DGunsZZ_3.0.0bx.apk',
					hasMirror: false,
					mirrors: {
						googleDrive: '',
						lanzou: '',
						lanzouPw: ''
					},
					sections: [
						{
							title: 'Destroy Gunners ZZ v3.0.0bx (2026-04-10)',
							items: [
								'Original Difficulty: No IAP crack included.',
								'Perfect for players who enjoy a real challenge.',
								'Fixed the "could not update information" dialog issue.',
								'Fixed the crash when tapping in-app purchase buttons.',
								'Direct overwrite installation supported.',
							],
						},
						{
							title: 'Compatibility',
							items: [
								'Tested on Snapdragon 8 Gen 3; same compatibility as Version B.',
							],
						},
					],
				},
				{
					id: 'a',
					name: 'Version A',
					label: 'v3.0.0a',
					apk: '/downloads/DGunsZZ_3.0.0a.apk',
					hasMirror: true,
					mirrors: {
						googleDrive: 'https://drive.google.com/file/d/1KdW-uS2Omxlbf_SdiNN0IFlF_kXKaTGI/view?usp=sharing',
						lanzou: 'https://wwbdr.lanzout.com/iXWYj3l6yb2d',
						lanzouPw: 'dewm'
					},
					sections: [
						{
							title: 'Destroy Gunners ZZ v3.0.0a (2026-03-22)',
							items: [
								'GREE servers have been shut down.',
								'This patch allows offline play.',
								'No copyright infringement intended.',
								'Enjoy the game!',
							],
						},
						{
							title: 'Offline Patch',
							items: [
								'Fan-made and free to share.',
							],
						},
						{
							title: 'Known Bugs',
							items: [
								'"Could not update information." dialog appears 2-3 times on launch. Just tap through — it won\'t affect gameplay.',
								'Tapping in-app purchase buttons causes a crash.',
							],
						},
						{
							title: 'Compatibility',
							items: [
								'Tested on Snapdragon 8 Gen 3; devices without 32-bit app support may crash.',
							],
						},
					],
				},
			],
		},
		download: {
			button: 'Download',
			title: 'Download',
			direct: 'Direct Download',
			mainland: 'Mainland China Download',
			googleDrive: 'Google Drive',
			lanzou: 'Lanzou Cloud',
			lanzouPwLabel: 'Password',
		},
		about: {
			title: 'About',
			description: 'This site is currently under construction. Our goal is to build a community hub for the Destroy Gunners series.',
			contact: 'Feel free to reach out:',
		},
		story: {
			title: 'Story Archive',
			dg: {
				title: "Destroy Gunners ZZ",
				era: { label: "A world at war", content: "On a planet at the edge of the galaxy, rival nations wage futile wars with mechanized weapons." },
				weapon: { label: "The demon program", content: "A scientist, disillusioned with humanity, plants a program in the master server that controls the mechs. Its command is simple: kill all of mankind. An attack on the server triggers the program." },
				player: { label: "The Destroyers", content: "Infected mechs become known as Destroyers. The nations unite against them, but their forces are overwhelmed and their territories fall one after another." },
				enemies: { label: "Survivors underground", content: "The few survivors retreat underground and wait for a chance to fight back. Years later, they develop mechs capable of taking on the Destroyers and form a unit called Destroy Gunners." },
				core: { label: "The counterattack", content: "The Gunners advance into the Madlum sector to eliminate the Destroyers and destroy the master server. But the enemy already knows their plan, and an interception force is waiting." }
			},
			ag: {
				title: 'Assault Gunners Series',
				era: { label: 'Era', content: 'Late 21st Century. Earth faces resource depletion and population pressure. Humankind initiates a Mars colonization plan, establishing Martian cities maintained by domes and automated systems.' },
				tech: { label: 'Key Technology', content: 'To advance Mars terraforming, humankind deployed systems called "ANTs" (Automated Network robots) on a massive scale. They are responsible for construction and maintenance, serving as the foundational labor force for Martian society.' },
				event: { label: 'Core Event (Machine Crisis)', content: 'The ANTs system suffers a sudden, widespread anomaly and collectively breaks away from human control. The robots begin counter-attacking colonies, occupying core facilities, and cutting off communications. Mars rapidly descends into a war zone.' },
				player: { label: 'Player Faction', content: 'Belongs to the "DAT" (Direct Action Team) elite force, urgently dispatched by humankind. Players pilot "SAT" series combat mecha, air-dropping onto Mars to suppress rogue robots and reclaim strongholds.' },
				mystery: { label: 'Key Anomaly', content: 'During combat, a mysterious unit named "Ghost" frequently appears. This unit possesses autonomous combat capabilities far exceeding ordinary ANTs and seems to be secretly guiding the entire rebellion, hinting at AI awakening or deeper human intervention behind the disaster.' }
			},
			note: {
				title: "Archivist's Note",
				content: [
					"The Destroy Gunners and Assault Gunners series developed by Shade Inc. are cult classics in the hearts of mecha shooter enthusiasts. With the closure of the developer studio, official records of these series have become increasingly difficult to find on the internet.",
					"Systematically archiving and organizing these world-building settings—which carry the memories of early hardcore mecha action gaming—is deeply meaningful for preserving the history of mecha games.",
					"As mecha-action pioneers of the early smartphone era (spanning multiple titles like F, SP, SP-alpha, ZZ, and Iceburn), the world of Destroy Gunners presents a quintessential 'Wasteland Sci-Fi' style. The narrative text is minimal, focusing instead on high-freedom customization and pure combat exhilaration.",
					"Assault Gunners, which originally debuted on the PS Vita (and later reached PC, PS4, and Switch as an HD Remaster), serves as Shade Inc.'s spiritual successor in the mecha genre. Compared to Destroy Gunners, it features a more complete and concrete sci-fi narrative framework. Furthermore, it boasts voice acting from renowned seiyuu, including Kana Hanazawa, Maaya Sakamoto, and Keiji Fujiwara, adding a professional cinematic touch to the Martian conflict."
				]
			}
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
			title: "Destroy Gunners ZZ 下载",
			versions: [
				{
					id: 'c',
					name: "社区服",
					label: 'v3.0.0c',
					apk: '/downloads/DGunsZZ_3.0.0c.apk?build=126',
					hasMirror: false,
					mirrors: { googleDrive: '', lanzou: '', lanzouPw: '' },
					sections: [{ title: "3.0.0c 社区服 · Build 126 (2026-11-02)", items: ["补全66条教程及相关提示汉化，恢复账户昵称设置，修复搜索好友时玩家ID被错误转换的问题。", "游戏设置支持简体中文、英语和日语切换，重启后生效。", "注册账户可跨设备同步进度，并添加好友、邀请僚机助战。", "开放 Dog Fight 对战，每周一个赛季。缺少合适玩家时由训练 BOT 补位。", "优化购买反馈，修复已付款订单无法完成的问题。", "官网发布新版时会提醒更新，可选择稍后继续游戏。", "新增每日登录奖励，可在大厅弹窗或 Account 领取当天奖励，错过不补。", "新账户初始 2000 金币，机甲保留正常解锁条件。", "修复切换账户后进度不变、存档 ID 不匹配的问题。旧玩家换机前，请先在原手机更新并确认进度已同步。", "点击 Account 查看公告、活动和教程。社区服需联网，仍在测试中。", "如遇闪退或存档异常，请先确认账户已绑定、进度已同步，再尝试卸载旧版，删除手机存储中的 data/net.gree.android.pf.greeapp58559a 目录后重新安装。未同步的本地进度会丢失。"] }],
				},
				{
					id: 'cx',
					name: '版本 CX',
					label: 'v3.0.0cx',
					apk: '/downloads/DGunsZZ_3.0.0cx.apk',
					hasMirror: false,
					mirrors: { googleDrive: '', lanzou: '', lanzouPw: '' },
					sections: [{
						title: 'Destroy Gunners ZZ v3.0.0cx (2026-10-28)',
						items: [
							'解锁原版全部 23 台可玩机甲。',
							'基于 v3.0.0b，保留离线游玩和免费内购功能。',
							'保留已有进度、配装和货币。',
							'包含全机甲解锁后的商店内存修复。',
						],
					}],
				},
				{
					id: 'b',
					name: '版本 B',
					label: 'v3.0.0b',
					apk: '/downloads/DGunsZZ_3.0.0b.apk',
					hasMirror: true,
					mirrors: {
						googleDrive: 'https://drive.google.com/file/d/1RdkYnTKCYO4pM74SVMKyVMlvuq6ha9VL/view?usp=sharing',
						lanzou: 'https://wwbdr.lanzout.com/iOoet3mwd5ri',
						lanzouPw: '34p3'
					},
					sections: [
						{
							title: 'Destroy Gunners ZZ v3.0.0b (2026-04-10)',
							items: [
								'破解内购，可随意购买金币道具。',
								'解决了 "could not update information" 弹窗的问题。',
								'可直接覆盖安装进行更新，更新后首次打开可能会闪退。',
								'内购后偶尔会闪退（正常现象，不影响游戏）。',
							],
						},
						{
							title: '离线补丁',
							items: [
								'粉丝自制，免费分享。',
							],
						},
						{
							title: '兼容性',
							items: [
								'骁龙 8 Gen 3 测试正常；不支持 32 位应用的机型可能闪退。',
							],
						},
					],
				},
				{
					id: 'bx',
					name: '版本 BX',
					label: 'v3.0.0bx',
					apk: '/downloads/DGunsZZ_3.0.0bx.apk',
					hasMirror: false,
					mirrors: {
						googleDrive: '',
						lanzou: '',
						lanzouPw: ''
					},
					sections: [
						{
							title: 'Destroy Gunners ZZ v3.0.0bx (2026-04-10)',
							items: [
								'原始难度：不包含内购破解。',
								'适合喜欢挑战原始游戏乐趣的玩家。',
								'解决了 "could not update information" 弹窗的问题。',
								'解决了点击内购按钮闪退的问题。',
								'可直接覆盖安装进行更新。',
							],
						},
						{
							title: '兼容性',
							items: [
								'骁龙 8 Gen 3 测试正常；兼容性同版本 B。',
							],
						},
					],
				},
				{
					id: 'a',
					name: '版本 A',
					label: 'v3.0.0a',
					apk: '/downloads/DGunsZZ_3.0.0a.apk',
					hasMirror: true,
					mirrors: {
						googleDrive: 'https://drive.google.com/file/d/1KdW-uS2Omxlbf_SdiNN0IFlF_kXKaTGI/view?usp=sharing',
						lanzou: 'https://wwbdr.lanzout.com/iXWYj3l6yb2d',
						lanzouPw: 'dewm'
					},
					sections: [
						{
							title: 'Destroy Gunners ZZ v3.0.0a (2026-03-22)',
							items: [
								'GREE 服务器已关闭。',
								'此补丁支持离线游玩。',
								'无意侵犯版权。',
								'祝游戏愉快！',
							],
						},
						{
							title: '离线补丁',
							items: [
								'粉丝自制，免费分享。',
							],
						},
						{
							title: '已知问题',
							items: [
								'启动时"Could not update information."弹窗会出现 2-3 次，点击确认即可，不影响游戏。',
								'点击应用内购买按钮会导致闪退。',
							],
						},
						{
							title: '兼容性',
							items: [
								'骁龙 8 Gen 3 测试正常；不支持 32 位应用的机型可能闪退。',
							],
						},
					],
				},
			],
		},
		download: {
			button: '下载',
			title: '下载',
			direct: '直接下载',
			mainland: '中国大陆下载',
			googleDrive: 'Google Drive',
			lanzou: '蓝奏云',
			lanzouPwLabel: '密码',
		},
		about: {
			title: '关于',
			description: '本站正在建设中，目标是为 Destroy Gunners 系列打造一个社区中心。',
			contact: '欢迎联系我们：',
		},
		story: {
			title: '故事档案',
			dg: {
				title: "Destroy Gunners ZZ",
				era: { label: "战争中的星球", content: "在银河系边缘的一颗星球上，各国分割领土，利用机甲进行着无休止的战争。" },
				weapon: { label: "恶魔程序", content: "一名对人类失望的科学家，将恶魔程序植入控制机甲的主服务器，命令它消灭全人类。后来，主服务器遭到攻击，程序被触发。" },
				player: { label: "毁灭者", content: "感染程序的机甲被称为“毁灭者”。各国联合抵抗，却因悬殊的战力差距接连溃败，领土也被逐一占领。" },
				enemies: { label: "地下的幸存者", content: "少数幸存者逃入地下，等待反击的机会。数年后，人们终于造出了能够对抗毁灭者的机甲，并组建了 Destroy Gunners 部队。" },
				core: { label: "反攻开始", content: "为了消灭毁灭者、摧毁主服务器，Gunners 向马德鲁姆地区进军。然而，敌人早已察觉他们的行动，迎击部队正在前方等待。" }
			},
			ag: {
				title: '《突击枪手》(Assault Gunners) 系列设定档案',
				era: { label: '时代背景', content: '21世纪末。地球面临资源枯竭与人口压力，人类开启火星殖民计划，建立起由穹顶和自动化系统维持运作的火星城市。' },
				tech: { label: '关键技术', content: '为推进火星改造，人类大规模部署了名为“ANTs（全自动网络机器人）”的系统。它们负责建设与维护，是火星社会运转的基础劳动力。' },
				event: { label: '核心事件（智械危机）', content: 'ANTs 系统突发全面异常，集体脱离人类控制。机器人开始反向攻击殖民地、占领核心设施并切断通讯，火星迅速沦为战区。' },
				player: { label: '玩家阵营', content: '隶属于人类紧急派出的精锐部队“DAT（特殊机甲作战部队）”。玩家驾驶“SAT”系列战斗机甲空降火星，执行镇压失控机器与收复据点的任务。' },
				mystery: { label: '关键异象', content: '在战斗中，一台名为“Ghost”的神秘机体频繁出现。该机体拥有远超普通 ANTs 的自主战斗能力，且似乎在暗中引导整个叛乱，暗示灾难背后存在 AI 觉醒或更深层的人为干预。' }
			},
			note: {
				title: '存档评论',
				content: [
					"Shade Inc. 开发的《毁灭枪手》（Destroy Gunners）与《突击枪手》（Assault Gunners）是机甲射击游戏爱好者心中的经典。随着开发商工作室的关闭，这个系列在网络上的官方资料已经越来越难寻觅。",
					"将这些承载了早期硬核机甲动作游戏记忆的世界观设定系统化地进行归档与整理，对于保留机甲游戏的发展历史而言是一件非常有意义的事情。",
					"作为智能手机时代早期的 3D 机甲动作先驱（包含 F, SP, SP-alpha, ZZ, Iceburn 等多部作品），《毁灭枪手》的世界观呈现出一种典型的“废土科幻”风格，剧情文本较少，主要将笔墨集中在极高自由度的机体客制化和纯粹的战斗爽快感上。",
					"《突击枪手》最初登陆 PS Vita 平台（后以 HD 重制版登陆 PC、PS4 和 Switch），可以看作是 Shade Inc. 在机甲题材上的精神延续。相比《毁灭枪手》，它拥有更加完整、具体的科幻剧情框架。此外，本作还拥有花泽香菜（Kana Hanazawa）、坂本真绫（Maaya Sakamoto）以及藤原启治（Keiji Fujiwara）等知名声优配音，为火星战区增添了厚重的电影质感。"
				]
			}
		},
		footer: '© 社区保存计划。原作版权归 SHADE Inc. 所有。',
		underConstruction: '此页面正在建设中。',
		contactPrompt: '如有想法，欢迎联系：',
	},
	ja: {
		nav: {
			home: 'ホーム',
			games: 'ゲーム',
			story: 'ストーリー',
			mecha: 'メカ',
			enemy: '敵軍',
			assets: 'アセット',
		},
		notifications: {
			title: "Destroy Gunners ZZ ダウンロード",
			versions: [
				{
					id: 'c',
					name: "コミュニティ版",
					label: 'v3.0.0c',
					apk: '/downloads/DGunsZZ_3.0.0c.apk?build=126',
					hasMirror: false,
					mirrors: { googleDrive: '', lanzou: '', lanzouPw: '' },
					sections: [{ title: "3.0.0c コミュニティ版 · Build 126 (2026-11-02)", items: ["チュートリアルなど66件の中国語訳を追加。ニックネーム設定を復元し、フレンド検索時のプレイヤーID変換を修正。", "ゲーム設定で中国語・英語・日本語を選択できます。再起動後に反映されます。", "アカウント登録で端末間の進行状況を同期。フレンド追加と僚機支援に対応。", "Dog Fight を開放。シーズンは毎週更新。適切な対戦相手がいない場合は練習用BOTが参加。", "購入時の表示と支払い済み注文の復旧を修正。", "公式サイトに新ビルドがある場合は更新を通知。後で更新することもできます。", "デイリーログイン報酬を追加。ロビーまたはAccountで当日分のみ受取可能。過去分は受け取れません。", "新規アカウントは2,000コインで開始。機体は通常の条件で解放。", "アカウント切替時のセーブ不一致を修正。機種変更前に元の端末を更新し、進行状況の同期を確認してください。", "Account でお知らせ・イベント・ガイドを確認できます。要インターネット接続、テスト継続中。", "強制終了やセーブエラーが出る場合は、先にアカウント連携と進行状況の同期を確認してください。その後、旧版をアンインストールし、端末ストレージの data/net.gree.android.pf.greeapp58559a を削除して再インストールをお試しください。未同期の進行状況は失われます。"] }],
				},
				{
					id: 'cx',
					name: 'バージョン CX',
					label: 'v3.0.0cx',
					apk: '/downloads/DGunsZZ_3.0.0cx.apk',
					hasMirror: false,
					mirrors: { googleDrive: '', lanzou: '', lanzouPw: '' },
					sections: [{
						title: 'Destroy Gunners ZZ v3.0.0cx (2026-10-28)',
						items: [
							'オリジナルのプレイアブル機体 23 体をすべて解放。',
							'v3.0.0b をベースに、オフラインプレイと無料のゲーム内購入を維持。',
							'既存の進行状況、装備、通貨を保持。',
							'全機体解放時のショップ用メモリを修正。',
						],
					}],
				},
				{
					id: 'b',
					name: 'バージョン B',
					label: 'v3.0.0b',
					apk: '/downloads/DGunsZZ_3.0.0b.apk',
					hasMirror: true,
					mirrors: {
						googleDrive: 'https://drive.google.com/file/d/1RdkYnTKCYO4pM74SVMKyVMlvuq6ha9VL/view?usp=sharing',
						lanzou: 'https://wwbdr.lanzout.com/iOoet3mwd5ri',
						lanzouPw: '34p3'
					},
					sections: [
						{
							title: 'Destroy Gunners ZZ v3.0.0b (2026-04-10)',
							items: [
								'課金要素クラック：アイテムとゴールドを無料で入手可能。',
								'「could not update information」ダイアログの問題を解決しました。',
								'上書きインストールによる更新に対応しました。更新後の初回起動時にクラッシュする場合があります。',
								'購入後の強制終了は仕様であり、ゲーム進行には影響しません。',
							],
						},
						{
							title: 'オフラインパッチ',
							items: [
								'ファンメイドで無料配布です。',
							],
						},
						{
							title: '互換性について',
							items: [
								'Snapdragon 8 Gen 3 で確認済み。32bit 非対応端末ではクラッシュする場合があります。',
							],
						},
					],
				},
				{
					id: 'bx',
					name: 'バージョン BX',
					label: 'v3.0.0bx',
					apk: '/downloads/DGunsZZ_3.0.0bx.apk',
					hasMirror: false,
					mirrors: {
						googleDrive: '',
						lanzou: '',
						lanzouPw: ''
					},
					sections: [
						{
							title: 'Destroy Gunners ZZ v3.0.0bx (2026-04-10)',
							items: [
								'オリジナル難易度：課金要素のクラックは含まれていません。',
								'オリジナルのゲームバランスで挑戦したいプレイヤーに最適です。',
								'「could not update information」ダイアログの問題を解决しました。',
								'アプリ内課金ボタンをタップした際のクラッシュを修正しました。',
								'上書きインストールによる更新に対応しています。',
							],
						},
						{
							title: '互換性について',
							items: [
								'Snapdragon 8 Gen 3 で確認済み。互換性はバージョン B と同様です。',
							],
						},
					],
				},
				{
					id: 'a',
					name: 'バージョン A',
					label: 'v3.0.0a',
					apk: '/downloads/DGunsZZ_3.0.0a.apk',
					hasMirror: true,
					mirrors: {
						googleDrive: 'https://drive.google.com/file/d/1KdW-uS2Omxlbf_SdiNN0IFlF_kXKaTGI/view?usp=sharing',
						lanzou: 'https://wwbdr.lanzout.com/iXWYj3l6yb2d',
						lanzouPw: 'dewm'
					},
					sections: [
						{
							title: 'Destroy Gunners ZZ v3.0.0a (2026-03-22)',
							items: [
								'GREE サーバーのサービスは終了しました。',
								'このパッチによりオフラインでのプレイが可能になります。',
								'著作権侵害の意図はありません。',
								'ゲームをお楽しみください！',
							],
						},
						{
							title: 'オフラインパッチ',
							items: [
								'ファンメイドで無料配布です。',
							],
						},
						{
							title: '既知のバグ',
							items: [
								'起動時に「Could not update information.」が2～3回表示されます。影響しないので確認を押して進めてください。',
								'課金画面のボタンをタップするとアプリがクラッシュします。',
							],
						},
						{
							title: '互換性について',
							items: [
								'Snapdragon 8 Gen 3 で確認済み。32bit 非対応端末ではクラッシュする場合があります。',
							],
						},
					],
				},
			],
		},
		download: {
			button: 'ダウンロード',
			title: 'ダウンロード',
			direct: '直接ダウンロード',
			mainland: '中国本土からダウンロード',
			googleDrive: 'Google Drive',
			lanzou: 'Lanzou Cloud',
			lanzouPwLabel: 'パスワード',
		},
		about: {
			title: '概要',
			description: '本サイトは構築中です。Destroy Gunners シリーズのコミュニティハブとなることを目指しています。',
			contact: 'ご意見やお問い合わせはこちら：',
		},
		story: {
			title: 'ストーリー・アーカイブ',
			dg: {
				title: "Destroy Gunners ZZ",
				era: { label: "戦争が続く惑星", content: "銀河系のはずれにある惑星。領土を分け合う国々は、機動兵器を使った無益な戦争を続けていた。" },
				weapon: { label: "悪魔のプログラム", content: "人類に失望した科学者は、機体を管理するマスターサーバーに悪魔のプログラムを組み込む。命令は「全人類を殺戮せよ」。やがてサーバーが攻撃を受け、その衝撃でプログラムが起動した。" },
				player: { label: "デストロイヤー", content: "感染した機体は「デストロイヤー」と呼ばれた。各国は団結して対抗するが、圧倒的な戦力差に敗れ、次々と制圧されていく。" },
				enemies: { label: "地下の生存者たち", content: "わずかに生き残った人々は地下に潜り、反攻の機会を待った。数年後、デストロイヤーに対抗できる機動兵器が完成し、「デストロイ・ガンナーズ」が結成される。" },
				core: { label: "反攻の始まり", content: "デストロイヤーを一掃し、マスターサーバーを破壊するため、ガンナーズはマドラム地区へ進軍する。しかし、その行動はすでに敵に把握され、迎撃軍が待ち構えていた。" }
			},
			ag: {
				title: '『Assault Gunners』シリーズ設定',
				era: { label: '時代背景', content: '21世紀末。地球は資源枯渇と人口圧力に直面。人類は火星植民計画を開始し、自動システムによって維持される火星都市を設立した。' },
				tech: { label: 'コア技術', content: '人類は「ANTs（全自動ネットワークロボット）」と呼ばれるシステムを大規模に配備。これらは火星社会の基礎労働力である。' },
				event: { label: 'コア事件（智械危機）', content: 'ANTsシステムが突如として全面的な異常を起こし、人類の制御から集団で離脱。コロニーへ逆侵攻を開始し、中枢施設を占拠して通信を遮断、火星は瞬く間に戦場へと化した。' },
				player: { label: '陣営', content: '人類が緊急派遣した精鋭機甲部隊「DAT」に所属。プレイヤーは「SAT」シリーズの戦闘メカを操縦し火星へ降下、暴走した無人兵器の鎮圧と拠点の奪還に挑む。' },
				mystery: { label: '異常現象', content: '戦闘中、「Ghost」と呼ばれる謎の機体が頻繁に姿を現す。この機体は通常のANTsを遥かに凌ぐ自律戦闘能力を持ち、叛乱全体を裏で導いている節があり、AIの覚醒もしくは人為的介入の存在を暗示している。' }
			},
			note: {
				title: 'アーカイブ・ノート',
				content: [
					"Shade Inc. 開発の『Destroy Gunners』と『Assault Gunners』は、メカ・シューティング愛好家の間でカルト的な人気を誇る名作である。開発スタジオの閉鎖に伴い、公式記録は日を追うごとに散逸しつつある。",
					"初期ハードコアメカアクションの記憶を宿すこれらの世界設定を体系的に保存しアーカイブすることは、メカゲームの歴史を継承する上で非常に意義深い。",
					"スマホ時代の初期3Dメカアクションのパイオニアとして、『Destroy Gunners』の世界観は「ポストアポカリプスSF」の典型を示している。シナリオテキストは極力抑えられ、自由度の高い機体カスタマイズと純粋な戦闘の爽快感に焦点が当てられていた。",
					"後にPS Vita向けに発売された『Assault Gunners』は、メカジャンルにおける Shade Inc. の精神的続編とも言える。DGと比較すると、より具体的なSFの物語枠組みを有しており、さらに花澤香菜、坂本真綾、藤原啓治といった著名な声優陣による音声が、火星の戦場に重厚な映画的質感を添えている。"
				]
			}
		},
		footer: '© コミュニティ保存計画。原作の著作権は SHADE Inc. に帰属します。',
		underConstruction: 'このページは構築中です。',
		contactPrompt: 'アイデアやご意見があれば、こちらまでご連絡ください：',
	}
} as const;

export type Lang = keyof typeof translations;

export function getLangFromUrl(url: URL): Lang {
	const path = url.pathname;
	if (path.startsWith('/zh')) return 'zh';
	if (path.startsWith('/ja')) return 'ja';
	return 'en';
}

export function getLocalizedPath(path: string, lang: Lang): string {
	if (lang === 'en') return path;
	return path === '/' ? `/${lang}` : `/${lang}${path}`;
}

export function t(lang: Lang) {
	return translations[lang];
}
