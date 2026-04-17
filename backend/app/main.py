from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import content

app = FastAPI(
    title="小红书爆款内容工厂 API",
    description="生成小红书爆款内容的API服务",
    version="1.0.0"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该设置具体的前端域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(content.router, prefix="/api", tags=["content"])

@app.get("/")
def read_root():
    return {"message": "小红书爆款内容工厂 API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
