
// Utilidades para integración con Gemini IA
// Funciones centralizadas para llamadas a la API de Google Gemini

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const GeminiConfigs = {
  creative: {
    temperature: 0.9,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 4096,
  },
  balanced: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 4096,
  },
  precise: {
    temperature: 0.3,
    topK: 20,
    topP: 0.8,
    maxOutputTokens: 2048,
  },
  analysis: {
    temperature: 0.2,
    topK: 10,
    topP: 0.8,
    maxOutputTokens: 1024,
  }
};

async function callGeminiAPI(prompt, config = GeminiConfigs.balanced, model = 'gemini-2.5-pro') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ No se encontró la API key de Gemini en las variables de entorno');
    return null;
  }
  console.log('🤖 Llamando a Gemini IA...');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: config
      })
    });
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`❌ Error en la API de Gemini: ${response.status} ${response.statusText}`);
      console.error('Detalles del error:', errorData);
      return null;
    }
    const data = await response.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      const contenido = data.candidates[0].content.parts[0].text;
      console.log('✅ Contenido generado exitosamente con Gemini IA');
      if (process.env.NODE_ENV === 'development') {
        console.log('📝 Fragmento de respuesta:', contenido.substring(0, 100) + '...');
      }
      return contenido;
    } else {
      console.error('❌ Respuesta inesperada de Gemini:', data);
      return null;
    }
  } catch (error) {
    console.error('❌ Error llamando a la API de Gemini:', error);
    return null;
  }
}

async function callGeminiForJSON(prompt, config = GeminiConfigs.analysis) {
  try {
    const resultado = await callGeminiAPI(prompt, config);
    if (!resultado) return null;
    try {
      const jsonMatch = resultado.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedJson = JSON.parse(jsonMatch[0]);
        return parsedJson;
      } else {
        console.error('❌ No se encontró JSON válido en la respuesta de Gemini');
        console.log('📄 Respuesta completa:', resultado);
        return null;
      }
    } catch (parseError) {
      console.error('❌ Error parseando JSON de Gemini:', parseError);
      console.log('📄 Respuesta que causó el error:', resultado);
      return null;
    }
  } catch (error) {
    console.error('❌ Error en callGeminiForJSON:', error);
    return null;
  }
}

function validateGeminiConfig() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY no está configurada en las variables de entorno');
    return false;
  }
  if (!apiKey.startsWith('AIza')) {
    console.error('❌ GEMINI_API_KEY no parece ser válida (debe empezar con "AIza")');
    return false;
  }
  console.log('✅ Configuración de Gemini IA validada correctamente');
  return true;
}

function cleanAIGeneratedText(text) {
  return text
    .trim()
    .replace(/^```[\w]*\n?/gm, '')
    .replace(/\n?```$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function createSystemPrompt(role, task, context, instructions, outputFormat) {
  let prompt = `Eres ${role}. Tu tarea es ${task}.\n\n**CONTEXTO:**\n${context}\n\n**INSTRUCCIONES:**`;
  instructions.forEach((instruction, index) => {
    prompt += `\n${index + 1}. ${instruction}`;
  });
  if (outputFormat) {
    prompt += `\n\n**FORMATO DE SALIDA:**\n${outputFormat}`;
  }
  return prompt;
}

module.exports = {
  callGeminiAPI,
  callGeminiForJSON,
  validateGeminiConfig,
  cleanAIGeneratedText,
  createSystemPrompt,
  GeminiConfigs
};
