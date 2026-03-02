// Vercel Serverless Function for AI Enhancement
module.exports = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, type } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  // AI Enhancement logic
  const enhancedText = enhanceText(text, type);

  res.json({
    original: text,
    enhanced: enhancedText,
    type: type
  });
};

function enhanceText(text, type) {
  const actionVerbs = [
    'Developed', 'Implemented', 'Designed', 'Created', 'Built',
    'Managed', 'Led', 'Spearheaded', 'Optimized', 'Streamlined',
    'Engineered', 'Architected', 'Delivered', 'Achieved', 'Improved'
  ];

  const professionalPhrases = {
    'made': 'developed',
    'did': 'executed',
    'helped': 'assisted',
    'worked on': 'contributed to',
    'was responsible for': 'managed',
    'in charge of': 'oversaw',
    'fixed': 'resolved',
    'started': 'initiated',
    'changed': 'transformed',
    'got': 'obtained'
  };

  let enhanced = text;

  // Convert to professional language
  Object.keys(professionalPhrases).forEach(key => {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    enhanced = enhanced.replace(regex, professionalPhrases[key]);
  });

  // Add action verbs for experience/projects
  if (type === 'experience' || type === 'projects') {
    const sentences = enhanced.split(/[.!?]+/).filter(s => s.trim());
    const enhancedSentences = sentences.map((sentence, index) => {
      const trimmed = sentence.trim();
      if (trimmed && index < actionVerbs.length) {
        const startsWithVerb = actionVerbs.some(verb =>
          trimmed.toLowerCase().startsWith(verb.toLowerCase())
        );
        if (!startsWithVerb) {
          return `${actionVerbs[index % actionVerbs.length]} ${trimmed.charAt(0).toLowerCase() + trimmed.slice(1)}`;
        }
      }
      return trimmed;
    });
    enhanced = enhancedSentences.join('. ') + (enhanced.endsWith('.') ? '' : '.');
  }

  // Enhance summary
  if (type === 'summary') {
    enhanced = enhanced.replace(/i am/gi, 'A dedicated professional');
    enhanced = enhanced.replace(/i have/gi, 'possessing');
    enhanced = enhanced.replace(/i like/gi, 'passionate about');
    enhanced = enhanced.replace(/good at/gi, 'proficient in');
    enhanced = enhanced.replace(/worked with/gi, 'experienced with');
  }

  // Clean up
  enhanced = enhanced.replace(/\s+/g, ' ').trim();

  // Ensure proper punctuation
  if (!enhanced.endsWith('.') && !enhanced.endsWith('!') && !enhanced.endsWith('?')) {
    enhanced += '.';
  }

  return enhanced;
}
