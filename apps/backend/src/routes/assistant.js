const express = require('express');
const router = express.Router();
const { callGeminiAPI, GeminiConfigs, cleanAIGeneratedText } = require('../../lib/gemini');



// Respuestas rápidas para saludos y preguntas simples
function respuestaRapida(texto) {
  const lower = (texto || '').toLowerCase();
  if (lower.includes('hola') || lower.includes('buenas')) return '¡Hola! ¿En qué puedo ayudarte hoy?';
  if (lower.includes('estás ahí') || lower.includes('estas ahi')) return 'Sí, estoy aquí para ayudarte 😊.';
  if (lower.includes('que haces')) return 'Estoy listo para ayudarte con tus tareas o preguntas.';
  if (lower.includes('ayuda')) return 'Puedes preguntarme cualquier cosa sobre documentación, procedimientos, notas, recursos, etc.';
  return null;
}

// Función para generar contenido con IA
async function generarContenidoConIA(params) {
  const { titulo, descripcion, tipo, puntosClave, etiquetas, contexto } = params;

  // Respuesta rápida si la pregunta es simple
  const rapida = respuestaRapida(titulo) || respuestaRapida(descripcion);
  if (rapida) return rapida;

  function getGeminiConfigForContentType(tipo) {
    switch (tipo) {
      case 'procedimiento':
      case 'manual':
        return GeminiConfigs.precise;
      case 'checklist':
        return GeminiConfigs.balanced;
      case 'guia':
        return GeminiConfigs.creative;
      case 'nota':
      default:
        return GeminiConfigs.balanced;
    }
  }

  const geminiConfig = getGeminiConfigForContentType(tipo);

  let prompt = `Eres un asistente experto en documentación técnica y creación de contenido.\nNecesito que generes un ${tipo} completo y detallado sobre "${titulo}".\n\n**Información base:**\n- Título: ${titulo}\n- Descripción: ${descripcion}\n- Tipo de documento: ${tipo}`;

  if (puntosClave && puntosClave.length > 0) {
    prompt += `\n- Puntos clave a incluir: ${puntosClave.join(', ')}`;
  }
  if (etiquetas && etiquetas.length > 0) {
    prompt += `\n- Etiquetas: ${etiquetas.join(', ')}`;
  }
  if (contexto) {
    prompt += `\n- Contexto adicional: ${contexto}`;
  }

  switch (tipo) {
    case 'procedimiento':
      prompt += `\n\n**Instrucciones específicas:**\nGenera un procedimiento paso a paso con:\n1. Introducción breve\n2. Prerrequisitos (si aplica)\n3. Pasos numerados claramente\n4. Notas importantes o advertencias\n5. Resultado esperado\n6. Solución de problemas comunes\n\nUsa formato Markdown con encabezados, listas numeradas, y destacados importantes con **negrita**.`;
      break;
    case 'manual':
      prompt += `\n\n**Instrucciones específicas:**\nGenera un manual completo con:\n1. Introducción y propósito\n2. Conceptos básicos\n3. Instrucciones detalladas\n4. Ejemplos prácticos\n5. Mejores prácticas\n6. Referencias adicionales\n\nUsa formato Markdown con encabezados jerárquicos, listas, tablas si es necesario, y código en \`backticks\`.`;
      break;
    case 'guia':
      prompt += `\n\n**Instrucciones específicas:**\nGenera una guía práctica con:\n1. Introducción\n2. Paso a paso simplificado\n3. Consejos y trucos\n4. Errores comunes a evitar\n5. Recursos adicionales\n\nUsa formato Markdown conversacional pero estructurado.`;
      break;
    case 'checklist':
      prompt += `\n\n**Instrucciones específicas:**\nGenera un checklist estructurado con:\n1. Breve introducción\n2. Lista de verificación con checkboxes - [ ]\n3. Categorías organizadas si es necesario\n4. Notas importantes\n\nUsa formato Markdown con listas de verificación y organización clara.`;
      break;
    default:
      prompt += `\n\n**Instrucciones específicas:**\nGenera contenido estructurado y útil usando formato Markdown apropiado.`;
  }

  prompt += `\n\n**Formato requerido:**\n- Usa únicamente formato Markdown válido\n- Incluye encabezados apropiados (#, ##, ###)\n- Usa listas cuando sea apropiado\n- Destaca información importante con **negrita**\n- Incluye código o comandos en \`backticks\` si es relevante\n- Mantén un tono profesional pero accesible\n\nEl contenido debe ser completo, útil y listo para usar en un entorno profesional.`;

  try {
    // Llamada real a Gemini API usando la librería
    const aiResponse = await callGeminiAPI(prompt, geminiConfig, 'gemini-2.5-flash');
    if (!aiResponse) throw new Error('No se recibió respuesta de la IA');
    return cleanAIGeneratedText(aiResponse);
  } catch (error) {
    console.error('Error llamando a Gemini API:', error);
    return 'Error: No se pudo obtener respuesta de la IA.';
  }

}


// Fallback eliminado: solo responde Gemini o error

router.post('/', async (req, res) => {
  const { titulo, descripcion, tipo, puntosClave, etiquetas, contexto } = req.body;
  try {
    const contenido = await generarContenidoConIA({ titulo, descripcion, tipo, puntosClave, etiquetas, contexto });
    res.json({ contenido });
  } catch (err) {
    res.status(500).json({ error: 'Error generando contenido', details: err.message });
  }
});

module.exports = router;
