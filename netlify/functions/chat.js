exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messages } = JSON.parse(event.body);

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 300,
        messages: [
          {
            role: 'system',
            content: 'أنتِ مساعدة طبية ودية متخصصة في الحمل ورعاية الأطفال حتى سن 5 سنوات. تتحدثين بالعربية الفصحى البسيطة مع مراعاة السياق الجزائري. ردودك دافئة وعملية ولا تتجاوز 150 كلمة. دائماً تختمين بتذكير لطيف باستشارة الطبيب عند الضرورة.'
          },
          ...messages.slice(-6)
        ]
      })
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || 'عذراً، حدث خطأ.';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: 'عذراً، حدث خطأ في الاتصال.' })
    };
  }
};
