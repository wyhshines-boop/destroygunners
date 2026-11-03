# Cloudflare 测试部署

Workers Builds 项目：`destroygunners`，根目录 `/`，构建命令 `npm run build`，部署命令 `npx wrangler deploy`，分支 `main`。

`wrangler.jsonc` 直接发布 Astro 的静态 `dist`，无需 Cloudflare 服务端适配器。主站域名和 DNS 不随此配置切换。

## APK 存储

全部 APK 存入 R2 专用桶 `destroygunners-downloads`，清单在 `src/data/r2-downloads.json`。对象键包含 SHA256，不覆盖旧版本；下载响应提供 APK 类型和原始 `.apk` 文件名。

`public/_redirects` 为 Cloudflare 保留原下载路径，`vercel.json` 中的同名规则为 Vercel 保留路径。构建结束会移除 `dist/downloads/*.apk`，不再把安装包上传到网站部署。仓库原有 APK 暂留作历史备份。

当前先使用公开 r2.dev 地址进行迁移测试。正式使用建议为桶绑定独立下载域名，再同步修改清单和两处重定向；r2.dev 有限速，不应作为长期生产入口。

更新 APK：先按清单键格式上传到 R2，检查下载元数据，再更新清单、两处重定向和相应版本信息。未登记到 R2 清单的新 APK 会阻止构建。123 中国大陆下载仍单独维护，Build127 暂无123镜像。

社区服正式版仍是 Build126；Build127 是独立安装的兼容测试版，不更改正式版自动更新清单。
