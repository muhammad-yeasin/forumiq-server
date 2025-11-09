import { env } from '@/config/env'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: env.GENAI_API_KEY })

const generateSummary = async (prompt: string) => {
    const res = await ai.models.generateContent({
        model: env.GENAI_MODEL,
        contents: prompt,
    })
    return res.text
}

const aiService = {
    generateSummary,
}

export default aiService
