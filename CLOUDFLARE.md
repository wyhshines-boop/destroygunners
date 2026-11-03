# Cloudflare 测试部署

Workers Builds 项目：`destroygunners`，根目录 `/`，构建命令 `npm run build`，部署命令 `npx wrangler deploy`，分支 `main`。

`wrangler.jsonc` 直接发布 Astro 的静态 `dist`，无需 Cloudflare 服务端适配器。主站域名和 DNS 不随此配置切换。

## APK 存储

全部 APK 存入 R2 专用桶 `destroygunners-downloads`，清单在 `src/data/r2-downloads.json`。对象键包含 SHA256，不覆盖旧版本；下载响应提供 APK 类型和原始 `.apk` 文件名。

`public/_redirects` 为 Cloudflare 保留原下载路径，`vercel.json` 中的同名规则为 Vercel 保留路径。构建结束会移除 `dist/downloads/*.apk`，不再把安装包上传到网站部署。仓库原有 APK 暂留作历史备份。

正式下载域名为 `https://downloads.destroygunners.com`，已绑定 R2 并启用 HTTPS。清单和两处重定向均使用此域名；网站不再依赖 r2.dev 测试入口。

更新 APK：先按清单键格式上传到 R2，检查下载元数据，再更新清单、两处重定向和相应版本信息。未登记到 R2 清单的新 APK 会阻止构建。123 中国大陆下载仍单独维护，Build127 暂无123镜像。

社区服正式版仍是 Build126；Build127 是独立安装的兼容测试版，不更改正式版自动更新清单。

## 最新测试版（固定入口）

管理页 `https://www.destroygunners.com/zh/admin#test` 只显示最新一份测试版，下载地址固定为 `/downloads/DGZZ_test_latest.apk`。每次制作测试包，都先上传R2并核对大小，再替换 `src/data/test-release.json` 的构建号、说明和 apk_path，并更新 CF/Vercel 中固定下载地址的临时重定向。不要增加测试历史列表，不要将测试包误设为正式版自动更新。R2 对象仍按哈希保存，更新固定入口即可，避免缓存旧包。

后续测试包统一用 `python3 scripts/publish-test-apk.py --apk <签名APK> --build <构建号> --title <标题> --notes <说明>` 上传并替换唯一测试入口。当前合并基线为 Build130（保留127兼容改动、128聊天）；原127独立兼容包仍可下载。正式版清单的apk_url使用R2正式域名直接地址。
