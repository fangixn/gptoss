# GitHub Pages 部署问题解决方案

## 问题描述
遇到错误：`Get Pages site failed. Please verify that the repository has Pages enabled and configured to build using GitHub Actions`

## 解决步骤

### 1. 已修复的配置问题
✅ **GitHub Actions 配置已更新**
- 在 `.github/workflows/deploy.yml` 中添加了 `DEPLOY_TARGET: static` 环境变量
- 这确保 Next.js 使用静态导出模式生成 `./out` 目录

### 2. 需要在 GitHub 仓库中手动配置的设置

#### 步骤 A: 启用 GitHub Pages
1. 进入你的 GitHub 仓库页面
2. 点击 **Settings** 标签
3. 在左侧菜单中找到 **Pages**
4. 在 "Source" 部分选择 **GitHub Actions**

#### 步骤 B: 确保分支设置正确
- 确保你的默认分支是 `main`（或修改 deploy.yml 中的分支名）
- 推送代码到正确的分支

### 3. 部署流程

1. **提交并推送更改**：
   ```bash
   git add .
   git commit -m "Fix GitHub Pages deployment configuration"
   git push origin main
   ```

2. **检查 Actions 运行状态**：
   - 进入仓库的 **Actions** 标签
   - 查看 "Deploy Next.js site to Pages" 工作流是否成功运行

3. **访问部署的网站**：
   - 部署成功后，网站将在 `https://[username].github.io/[repository-name]` 可用

### 4. 常见问题排查

#### 如果仍然遇到问题：

**问题 1**: Actions 权限不足
- 解决方案：在仓库 Settings > Actions > General 中，确保 "Workflow permissions" 设置为 "Read and write permissions"

**问题 2**: Pages 未启用
- 解决方案：确保在 Settings > Pages 中选择了 "GitHub Actions" 作为源

**问题 3**: 构建失败
- 检查 Actions 日志中的具体错误信息
- 确保所有依赖都在 package.json 中正确声明

### 5. 验证配置

检查以下文件确保配置正确：

- ✅ `.github/workflows/deploy.yml` - 包含正确的环境变量
- ✅ `next.config.js` - 支持静态导出
- ✅ `public/.nojekyll` - 存在（防止 Jekyll 处理）

### 6. 下一步

1. 按照上述步骤在 GitHub 仓库中启用 Pages
2. 推送代码触发部署
3. 等待 Actions 完成并检查部署状态

如果问题仍然存在，请检查 GitHub Actions 的详细日志以获取更多信息。