# Mira 云舒 | Personal Index

React 组件与 Tailwind CSS 生成的静态多页网站。首页是目录，栏目、项目和文章可通过各自的网址直接访问。浏览网站无需登录。

## 首次发布到 GitHub Pages

1. 解压项目。在 GitHub 创建一个公开仓库，例如 `mira-personal-index`。
2. 上传解压后项目目录**里面**的文件和文件夹，保留 `docs/` 的结构。也可用 GitHub Desktop 将项目目录作为仓库发布。网站所需的 HTML、CSS 和 JS 已构建到 `docs/`，首次发布可以直接用。
3. 打开仓库 **Settings → Pages**。在 **Source** 选择 **Deploy from a branch**，分支选 **main**，目录选 **/docs**，然后保存。
4. 等待部署完成，点击 Pages 设置中显示的 **Visit site**。以后把更新后的 `docs/` 提交到同一分支即可更新同一个网址。

[GitHub Pages 官方设置说明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## 修改内容

| 想修改的内容 | 文件或位置 |
| --- | --- |
| 简介、照片、此刻、时间线、社交链接 | `content/site.json` |
| 项目名称、分类、状态、封面、工具、时间、详情、外链 | `content/projects.json` |
| 现代诗、随笔、阅读笔记 | `content/writing.json` |
| 照片和封面图片 | `public/media/` |
| 页面组件和样式 | `src/build.jsx`、`src/styles.css` |
| 可发布成品 | `docs/` |

用任意文本编辑器修改配置，保留 JSON 的双引号和逗号。新增文章或项目时，可复制同类条目并将 `slug` 换成唯一的英文短名（如 `first-poem`）。文章的 `body` 每项是一段，诗句段内用反斜杠加 n 表示换行。样例采用 `"sample": true`，替换成自己的正式作品后可改为 `false`。日期使用 YYYY-MM-DD。

照片和封面放进 `public/media/` 后，将对应 `photo` 或 `cover` 字段写成 `media/文件名.jpg`，并补上图片描述。社交地址填写完整 HTTPS 链接，邮件填写 `mailto:你的公开邮箱`。缺省的联系方式显示为“待补充”。

## 重新生成与本地预览

安装 Node.js 22 或更新版本。在项目目录打开终端并依次运行：

```bash
npm ci
npm run build
```

生成后的内容在 `docs/`。如已安装 Python 3，可运行 `npm run preview`，再打开 http://localhost:8080 。在 GitHub 上更新时，把修改后的配置和重新生成的整个 `docs/` 一起提交。
