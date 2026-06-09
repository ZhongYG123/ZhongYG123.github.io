#!/bin/bash
# ============================================================
# 辰星禾官网 — 一键部署到 GitHub Pages
# ============================================================
# 前提：已安装 GitHub CLI (gh)
# 如未安装：https://cli.github.com/
# ============================================================

set -e

REPO_NAME="chenxinghe-website"
BRANCH="main"

echo "=========================================="
echo "  辰星禾官网 — GitHub Pages 部署脚本"
echo "=========================================="
echo ""

# Step 1: 检查 gh 是否安装
if ! command -v gh &> /dev/null; then
    echo "❌ 未检测到 GitHub CLI，请先安装："
    echo "   下载地址：https://cli.github.com/"
    echo "   安装后重新运行此脚本"
    exit 1
fi

# Step 2: 检查登录状态
echo "📋 Step 1/5: 检查 GitHub 登录状态..."
if ! gh auth status &> /dev/null; then
    echo "🔐 需要登录 GitHub..."
    gh auth login
fi
echo "✅ GitHub 已登录"
echo ""

# Step 3: 创建 GitHub 仓库
echo "📦 Step 2/5: 创建 GitHub 仓库..."
if gh repo view "$REPO_NAME" &> /dev/null; then
    echo "   仓库已存在，跳过创建"
else
    gh repo create "$REPO_NAME" --public --description "Chenxinghe Trading Co., Ltd. - FoolProof Oil-Lubricated Roller Assembly"
    echo "✅ 仓库创建成功"
fi
echo ""

# Step 4: 推送代码
echo "🚀 Step 3/5: 推送代码到 GitHub..."
REMOTE_URL=$(gh repo view "$REPO_NAME" --json sshUrl -q .sshUrl 2>/dev/null || gh repo view "$REPO_NAME" --json url -q .url)
if git remote | grep -q "origin"; then
    git remote set-url origin "$REMOTE_URL"
else
    git remote add origin "$REMOTE_URL"
fi
git push -u origin "$BRANCH" --force
echo "✅ 代码推送成功"
echo ""

# Step 5: 启用 GitHub Pages
echo "🌐 Step 4/5: 启用 GitHub Pages..."
gh api "repos/{owner}/$REPO_NAME/pages" -X POST -f source.branch="$BRANCH" -f source.path="/" 2>/dev/null || echo "   Pages 可能已启用"
echo "✅ GitHub Pages 已启用"
echo ""

# Step 6: 配置自定义域名
echo "🔗 Step 5/5: 配置自定义域名 chenxinghe.cn..."
echo "chenxinghe.cn" > CNAME
git add CNAME
git commit -m "Add custom domain: chenxinghe.cn"
git push origin "$BRANCH"
echo "✅ 自定义域名已配置"
echo ""

echo "=========================================="
echo "  🎉 部署完成！"
echo "=========================================="
echo ""
echo "📍 GitHub 默认访问地址："
echo "   https://<你的用户名>.github.io/$REPO_NAME/"
echo ""
echo "🔧 接下来去阿里云 DNS 后台添加以下记录："
echo ""
echo "   ┌──────────┬──────┬──────────────────────────────┬──────────┐"
echo "   │ 记录类型  │ 主机 │ 记录值                        │ TTL      │"
echo "   ├──────────┼──────┼──────────────────────────────┼──────────┤"
echo "   │ A        │ @    │ 185.199.108.153              │ 10分钟   │"
echo "   │ A        │ @    │ 185.199.109.153              │ 10分钟   │"
echo "   │ A        │ @    │ 185.199.110.153              │ 10分钟   │"
echo "   │ A        │ @    │ 185.199.111.153              │ 10分钟   │"
echo "   │ CNAME    │ www  │ <你的用户名>.github.io        │ 10分钟   │"
echo "   └──────────┴──────┴──────────────────────────────┴──────────┘"
echo ""
echo "⏳ DNS 生效需要 10-30 分钟，最多 48 小时"
echo "   生效后 chenxinghe.cn 即可直接访问你的官网"
echo ""
