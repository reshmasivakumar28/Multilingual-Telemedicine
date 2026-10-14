const languageNames = { en: 'English', ta: 'Tamil', hi: 'Hindi' };

async function translateText(text, sourceLanguage = 'en', targetLanguage = 'en') {
  if (!text || sourceLanguage === targetLanguage) return text;
  const source = languageNames[sourceLanguage] ? sourceLanguage : 'en';
  const target = languageNames[targetLanguage] ? targetLanguage : 'en';
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Translation provider returned ${response.status}.`);
  const data = await response.json();
  const translated = data.responseData?.translatedText;
  if (!translated || data.responseStatus !== 200) throw new Error('Translation provider returned no translation.');
  return translated;
}

module.exports = { languageNames, translateText };
