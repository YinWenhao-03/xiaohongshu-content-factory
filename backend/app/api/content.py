from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import sys
import os

# 添加项目根目录到Python路径
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../..')))

from src.generator.dynamic_content import DynamicContentGenerator

router = APIRouter()

class ContentRequest(BaseModel):
    keyword: str
    topic: str = ""
    days: int = 30
    use_llm: bool = False
    api_type: str = "openai"  # openai 或 baidu
    api_key: str = ""

class ContentResponse(BaseModel):
    title: str
    content: str
    tags: list
    image_prompt: str

@router.post("/generate", response_model=ContentResponse)
def generate_content(request: ContentRequest):
    """生成小红书内容"""
    try:
        # 设置API密钥和类型（如果提供）
        if request.api_key:
            os.environ["OPENAI_API_KEY"] = request.api_key
        if request.api_type:
            os.environ["OPENAI_API_TYPE"] = request.api_type
        
        # 创建内容生成器
        topic = request.topic or request.keyword
        generator = DynamicContentGenerator(topic, use_llm=request.use_llm)
        
        # 生成内容
        note = generator.generate_full_note()
        
        # 返回结果
        return ContentResponse(
            title=note['title'],
            content=note['content'],
            tags=note['tags'],
            image_prompt=note['image_prompt']
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
