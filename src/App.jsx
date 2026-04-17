import { useState } from 'react'
import axios from 'axios'
import { saveAs } from 'file-saver'

function App() {
  const [formData, setFormData] = useState({
    keyword: '护肤',
    topic: '',
    days: 30,
    useLlm: false,
    apiType: 'openai', // openai 或 baidu
    apiKey: '',
    apiUrl: 'http://localhost:8000/api/generate'
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // 调用后端API
      const response = await axios.post(formData.apiUrl, {
        keyword: formData.keyword,
        topic: formData.topic,
        days: formData.days,
        use_llm: formData.useLlm,
        api_type: formData.apiType,
        api_key: formData.apiKey
      })
      
      setResult({
        title: response.data.title,
        content: response.data.content,
        tags: response.data.tags,
        imagePrompt: response.data.image_prompt
      })
      setLoading(false)
    } catch (err) {
      console.error('API调用失败:', err)
      setError(err.response?.data?.detail || '生成失败，请重试')
      setLoading(false)
    }
  }

  const exportJSON = () => {
    if (!result) return
    const dataStr = JSON.stringify(result, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    saveAs(dataBlob, 'xiaohongshu-content.json')
  }

  const exportMarkdown = () => {
    if (!result) return
    const mdContent = `# ${result.title}\n\n${result.content}\n\n## 标签\n${result.tags.map(tag => `#${tag}`).join(' ')}\n\n## 配图提示\n${result.imagePrompt}`
    const dataBlob = new Blob([mdContent], { type: 'text/markdown' })
    saveAs(dataBlob, 'xiaohongshu-content.md')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 头部 */}
      <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-16 px-4 shadow-lg">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">小红书爆款内容工厂</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">AI驱动的内容生成工具，助你打造爆款笔记，提升内容创作效率</p>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="container mx-auto max-w-4xl px-4 py-12">
        {/* 表单部分 */}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-12 transform transition-all duration-300 hover:shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">内容生成配置</h2>
            <p className="text-gray-600">填写以下信息，生成专属于你的小红书爆款内容</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                关键词 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="keyword"
                value={formData.keyword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200"
                placeholder="例如：护肤、美妆、科技"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                自定义主题（可选）
              </label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200"
                placeholder="例如：MacBook Air 使用技巧、露营装备推荐"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                生成天数 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="days"
                value={formData.days}
                onChange={handleInputChange}
                min="1"
                max="90"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                API接口地址 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="apiUrl"
                value={formData.apiUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200"
                placeholder="http://localhost:8000/api/generate"
                required
              />
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                name="useLlm"
                checked={formData.useLlm}
                onChange={handleInputChange}
                className="h-5 w-5 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              />
              <label className="text-sm font-medium text-gray-700">
                使用LLM AI生成（需要API密钥）
              </label>
            </div>

            {formData.useLlm && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    API类型
                  </label>
                  <select
                    name="apiType"
                    value={formData.apiType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200"
                  >
                    <option value="openai">OpenAI</option>
                    <option value="baidu">百度智能云</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    API密钥 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="apiKey"
                    value={formData.apiKey}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200"
                    placeholder="sk-..."
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  生成中...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  生成内容
                </>
              )}
            </button>
          </form>
        </section>

        {/* 结果部分 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 shadow-md">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-lg font-medium text-red-800 mb-1">生成失败</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {result && (
          <section className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">生成结果</h2>
              <p className="text-gray-600">以下是为您生成的小红书内容</p>
            </div>
            <div className="space-y-6">
              <div className="p-4 bg-pink-50 rounded-xl">
                <h3 className="text-lg font-semibold mb-2 text-pink-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  标题
                </h3>
                <p className="text-gray-800 text-lg font-medium">{result.title}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <h3 className="text-lg font-semibold mb-2 text-purple-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  内容
                </h3>
                <p className="text-gray-800 whitespace-pre-line">{result.content}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl">
                <h3 className="text-lg font-semibold mb-2 text-blue-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  标签
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {result.tags.map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors duration-200">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <h3 className="text-lg font-semibold mb-2 text-green-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  配图提示
                </h3>
                <p className="text-gray-800">{result.imagePrompt}</p>
              </div>
              <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
                <button 
                  onClick={exportJSON}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  导出JSON
                </button>
                <button 
                  onClick={exportMarkdown}
                  className="flex-1 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  导出Markdown
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-12 px-4 mt-16">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-4">小红书爆款内容工厂</h3>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">AI驱动的内容生成工具，助你轻松创建高质量的小红书内容，提升品牌影响力</p>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-500">© 2026 小红书爆款内容工厂. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App