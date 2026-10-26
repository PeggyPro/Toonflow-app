```
git clone https://github.com/HBAI-Ltd/Toonflow-app.git
cd Toonflow-app
bun install --frozen-lockfile

# 构建内置节点、工具、Web 与 Server
bun run build:server
mkdir -p data/workspaces/myProject
bun run start:server
```
