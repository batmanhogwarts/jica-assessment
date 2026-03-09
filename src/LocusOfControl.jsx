import React, { useState, useMemo, useCallback } from 'react';

// --- SHUFFLE UTILITY ---
const shuffleArray = (arr) => {
  const s = [...arr];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
};

// --- DOMAIN DEFINITIONS ---
const DOMAINS = {
  academic: { name: 'Academic', accent: 'blue', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', fill: '#3b82f6', light: '#dbeafe' },
  social: { name: 'Social', accent: 'violet', bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', fill: '#8b5cf6', light: '#ede9fe' },
  health: { name: 'Health & Wellbeing', accent: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', fill: '#10b981', light: '#d1fae5' },
  career: { name: 'Career & Future', accent: 'amber', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', fill: '#f59e0b', light: '#fef3c7' },
};

// --- QUESTION DATA ---

const scenarioQuestions = [
  {
    id: 's1', domain: 'academic',
    situation: 'You spent several hours preparing for an important exam, but your grade comes back lower than you expected.',
    prompt: "What's your first reaction?",
    options: [
      { text: "I should have focused on different material or adjusted my study strategy.", score: 0.17 },
      { text: "The exam didn't fairly reflect what was actually covered in class.", score: 0.83 },
      { text: "I'll learn from this and change my approach for next time.", score: 0 },
      { text: "Sometimes exams just don't go your way regardless of how much you prepare.", score: 1 },
    ]
  },
  {
    id: 's2', domain: 'social',
    situation: 'A friend you\'ve been close with starts responding less and gradually spending less time with you.',
    prompt: 'What do you think is happening?',
    options: [
      { text: "I might have done something that bothered them without realizing.", score: 0.17 },
      { text: "People's priorities and interests naturally shift over time.", score: 0.83 },
      { text: "I should reach out directly and have an honest conversation.", score: 0 },
      { text: "Friendships drift apart sometimes — that's just how it goes.", score: 1 },
    ]
  },
  {
    id: 's3', domain: 'health',
    situation: 'Over the past few weeks, you\'ve been feeling more tired and stressed than usual.',
    prompt: 'What do you attribute it to?',
    options: [
      { text: "I haven't been managing my time or daily habits well enough.", score: 0.17 },
      { text: "This time of year is just draining for most people.", score: 0.83 },
      { text: "I need to make concrete changes to my sleep and routine.", score: 0 },
      { text: "Between school, obligations, and everything going on, burnout is hard to avoid.", score: 1 },
    ]
  },
  {
    id: 's4', domain: 'career',
    situation: 'You apply for a position or opportunity you were excited about and don\'t get it.',
    prompt: "What's your takeaway?",
    options: [
      { text: "My application or interview probably could have been stronger.", score: 0.17 },
      { text: "They likely had someone in mind before applications even opened.", score: 0.83 },
      { text: "I'll ask for feedback and use this experience to improve.", score: 0 },
      { text: "These decisions often come down to factors nobody can control.", score: 1 },
    ]
  },
  {
    id: 's5', domain: 'academic',
    situation: 'You receive the highest grade in your class on a major assignment.',
    prompt: 'What do you think made the difference?',
    options: [
      { text: "I invested more time and thought into it than I usually do.", score: 0.17 },
      { text: "The topic happened to play to my natural strengths.", score: 0.83 },
      { text: "My strategy for planning and executing the assignment paid off.", score: 0 },
      { text: "The grading might have been lenient, or I got lucky with the prompt.", score: 1 },
    ]
  },
  {
    id: 's6', domain: 'social',
    situation: 'You go to an event where you don\'t know many people. By the end, several people seem genuinely interested in staying in touch.',
    prompt: 'Why do you think that happened?',
    options: [
      { text: "I made an effort to be approachable and genuinely listen.", score: 0.17 },
      { text: "The relaxed atmosphere of the event just made it easy to connect.", score: 0.83 },
      { text: "I've been working on my social skills and it's starting to show.", score: 0 },
      { text: "Some people just click — it's a chemistry thing you can't really engineer.", score: 1 },
    ]
  },
  {
    id: 's7', domain: 'health',
    situation: 'You successfully maintain a consistent exercise routine for an entire month.',
    prompt: 'What kept you going?',
    options: [
      { text: "I set a realistic schedule and held myself accountable.", score: 0.17 },
      { text: "My schedule happened to be lighter than usual this month.", score: 0.83 },
      { text: "I built the habit by starting small and staying disciplined.", score: 0 },
      { text: "Having someone to exercise with made all the difference.", score: 1 },
    ]
  },
  {
    id: 's8', domain: 'career',
    situation: 'An unexpected opportunity comes your way — a recommendation, an introduction, or an offer you didn\'t seek out.',
    prompt: 'What do you think led to it?',
    options: [
      { text: "The work I've been doing quietly put me on people's radar.", score: 0.17 },
      { text: "It was honestly just good timing.", score: 0.83 },
      { text: "Showing up consistently and building relationships led to this.", score: 0 },
      { text: "Sometimes the right opportunity just finds you.", score: 1 },
    ]
  },
];

const spectrumQuestions = [
  {
    id: 'sp1', domain: 'academic',
    prompt: 'When I do well in school, it\'s usually because...',
    left: "I found the right approach and put in consistent effort.",
    right: "The material aligned with how I naturally think and learn.",
  },
  {
    id: 'sp2', domain: 'social',
    prompt: 'When there\'s tension between me and someone, it\'s usually because...',
    left: "I wasn't clear enough in how I communicated.",
    right: "People see the world from very different angles sometimes.",
  },
  {
    id: 'sp3', domain: 'health',
    prompt: 'My overall energy and wellbeing are mostly shaped by...',
    left: "The habits and daily routines I choose to maintain.",
    right: "Factors like genetics, seasonal changes, and life stress.",
  },
  {
    id: 'sp4', domain: 'career',
    prompt: 'People who end up where they want to be in life usually got there because...',
    left: "They stayed focused and made strategic sacrifices.",
    right: "The right doors opened for them at the right time.",
  },
  {
    id: 'sp5', domain: 'academic',
    prompt: 'When I struggle with a new subject or skill...',
    left: "It usually means I need to try a different approach or put in more time.",
    right: "Some things just don't come naturally to certain people.",
  },
  {
    id: 'sp6', domain: 'social',
    prompt: 'The quality of my closest friendships depends mostly on...',
    left: "How much honesty and effort I bring to those relationships.",
    right: "Whether our personalities naturally complement each other.",
  },
  {
    id: 'sp7', domain: 'health',
    prompt: 'When it comes to staying healthy...',
    left: "Good habits like sleep, nutrition, and hygiene make the biggest difference.",
    right: "Some people are just more susceptible to illness regardless of lifestyle.",
  },
  {
    id: 'sp8', domain: 'career',
    prompt: 'Ten years from now, where I am in life will mostly reflect...',
    left: "The decisions and priorities I'm setting right now.",
    right: "How the world around me happens to unfold.",
  },
];

const likertQuestions = [
  { id: 'l1', domain: 'academic', direction: 'internal', statement: "When I commit to learning something new, I can usually figure it out with enough effort." },
  { id: 'l2', domain: 'social', direction: 'internal', statement: "I have the ability to resolve most conflicts in my relationships if I approach them thoughtfully." },
  { id: 'l3', domain: 'health', direction: 'internal', statement: "My physical and mental wellbeing are largely within my control." },
  { id: 'l4', domain: 'career', direction: 'internal', statement: "The path my life takes will mostly be shaped by my own choices and actions." },
  { id: 'l5', domain: 'academic', direction: 'external', statement: "Some people are naturally better at academics, and effort can only do so much to close that gap." },
  { id: 'l6', domain: 'social', direction: 'external', statement: "Whether people connect with you often comes down to chemistry that nobody can control." },
  { id: 'l7', domain: 'health', direction: 'external', statement: "Most serious health problems are a matter of genetics and circumstances, not personal choices." },
  { id: 'l8', domain: 'career', direction: 'external', statement: "Success in life depends more on the opportunities you're given than on what you do with them." },
];

const LIKERT_LABELS = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];

// --- METHODOLOGY DATA ---
const methodologyItems = [
  {
    number: '01',
    title: 'From Binary to Multi-Format',
    problem: 'The original test used only yes/no answers. Nearly every respondent noted this couldn\'t capture how people actually think about control — forcing extremes on what is almost always a nuanced, situational belief.',
    raisedBy: 'Haram Park (suggested Likert scale), Lev Newhall, Nola Sherrod, Dael Song, Alec Siegal, Clarissa Castanon, June Oh',
    solution: 'This version uses three distinct question formats across three sections: realistic scenarios with four interpretive options, a continuous spectrum slider between two valid perspectives, and a five-point agreement scale. No question on this test has only two answers.',
  },
  {
    number: '02',
    title: 'Neutralizing Social Desirability',
    problem: 'When you can tell which answer is the "right" one, people perform rather than reflect. Multiple students noted they answered to look good or picked what felt socially acceptable rather than what they actually believed.',
    raisedBy: 'Alec Siegal (named the bias explicitly), Haram Park, Brenna Reilly, Davis Kim (noted scoring was transparent), Christopher Shiell (discovered the algorithm by clicking on cells)',
    solution: 'The spectrum slider presents two genuinely reasonable perspectives with no "better" side — you simply position yourself between them. Scenario questions offer four plausible interpretations where the internal/external mapping isn\'t obvious. The scoring logic is not visible to the test-taker.',
  },
  {
    number: '03',
    title: 'Breaking the Priming Effect',
    problem: 'The original survey grouped similar questions together. When several parent-related or luck-related questions appeared in a row, respondents felt pushed toward consistency rather than honest reflection — their earlier answers shaped their later ones.',
    raisedBy: 'Nitya Kannepalli (identified the pattern), Jonathan Shiell (expanded on the systemic implication)',
    solution: 'Questions are randomized within each section so the same domain never appears twice in a row. The three different formats also serve as natural pattern-breakers — switching from scenarios to spectrum sliders to scaled statements resets the respondent\'s mental framing.',
  },
  {
    number: '04',
    title: 'Removing Charged Language',
    problem: 'The original used words like "useless," "impossible," and "just plain smarter than you," which are emotionally loaded. These phrases can hurt, trigger defensive responses, or push people toward certain answers to protect their self-image.',
    raisedBy: 'Elizabeth Vazquez, Katie Hwang, Olivia Reed',
    solution: 'Every question in this version uses neutral, non-judgmental language. Situations are described factually. No option implies weakness, failure, or inferiority. The goal is reflection, not reaction.',
  },
  {
    number: '05',
    title: 'Universal Situations, Not Circumstantial Ones',
    problem: 'Many original questions measured your living situation rather than your beliefs. Questions about parents, home meals, and school discipline depend entirely on family structure, cultural background, and upbringing — not on your psychological orientation toward control.',
    raisedBy: 'Diego Rodas (Q35 about family meals measures living situation), Edmond Choi (filial piety influences responses), Michael Yoon (birth order shaped answers), Lev Newhall (personal vs. general questions mixed), Sarah Russell-Isaacs (Q29\'s "bad things" too vague), Jared Reyes (introversion mistaken for external locus)',
    solution: 'All questions describe situations anyone can relate to regardless of family structure, culture, or personality type. No questions reference parents, home dynamics, or school-specific scenarios. The test measures beliefs about control, not comfort level or circumstances.',
  },
  {
    number: '06',
    title: 'Domain-Specific Scoring',
    problem: 'The original produced a single number. But people don\'t experience control uniformly — you might feel completely in charge of your academic performance while feeling powerless in social situations. One score hides these meaningful differences.',
    raisedBy: 'Jonathan Shiell, Christopher Shiell, Clarissa Castanon, Dael Song',
    solution: 'This version scores four separate life domains independently: Academic, Social, Health & Wellbeing, and Career & Future. Each domain has six dedicated questions across all three sections, producing a distinct profile rather than a single label.',
  },
  {
    number: '07',
    title: 'Spectrum Results, Not Fixed Labels',
    problem: 'Being told you\'re "external" or "internal" can become self-fulfilling. Multiple students raised concerns that an external score could reinforce learned helplessness — the label becomes the belief, confirming the very passivity the test is supposed to identify.',
    raisedBy: 'Nola Sherrod, Sarah Russell-Isaacs, Helen Rajabov, Olivia Reed, Edmond Choi, Elizabeth Vazquez',
    solution: 'Results are presented as a position on a continuous spectrum, not a category. Language emphasizes that locus of control is a current tendency that shifts with experience, context, and personal growth. There are no fixed labels — only a snapshot of where you are right now.',
  },
];

// --- SCORING ---
const scoreLikert = (optionIndex, direction) => {
  const values = [0, 0.25, 0.5, 0.75, 1];
  if (direction === 'internal') {
    return values[4 - optionIndex];
  } else {
    return values[optionIndex];
  }
};

const calculateResults = (answers) => {
  const domainScores = {};
  Object.keys(DOMAINS).forEach(d => { domainScores[d] = { total: 0, count: 0 }; });

  Object.entries(answers).forEach(([qId, data]) => {
    if (domainScores[data.domain]) {
      domainScores[data.domain].total += data.score;
      domainScores[data.domain].count += 1;
    }
  });

  const results = {};
  let overallTotal = 0;
  let overallCount = 0;

  Object.entries(domainScores).forEach(([domain, { total, count }]) => {
    const avg = count > 0 ? total / count : 0.5;
    results[domain] = Math.round(avg * 100);
    overallTotal += total;
    overallCount += count;
  });

  results.overall = overallCount > 0 ? Math.round((overallTotal / overallCount) * 100) : 50;
  return results;
};

const getInterpretation = (score, domain) => {
  const domainName = DOMAINS[domain]?.name || '';
  if (score <= 20) return `You believe ${domainName.toLowerCase()} outcomes are almost entirely within your control. You see your own effort and decisions as the primary drivers.`;
  if (score <= 40) return `You generally see yourself as the main influence on your ${domainName.toLowerCase()} outcomes, while acknowledging that some external factors play a role.`;
  if (score <= 60) return `You see ${domainName.toLowerCase()} outcomes as shaped by a mix of your own actions and circumstances beyond your control.`;
  if (score <= 80) return `You tend to see ${domainName.toLowerCase()} outcomes as significantly influenced by external factors, though you recognize your actions still matter.`;
  return `You believe ${domainName.toLowerCase()} outcomes are largely shaped by forces outside your direct influence.`;
};

const getOverallInterpretation = (score) => {
  if (score <= 20) return "You have a strongly internal orientation — you tend to see yourself as the primary architect of your outcomes across most areas of life.";
  if (score <= 40) return "You lean internal — you generally believe your actions and choices are the biggest factor in your outcomes, with some recognition of external influences.";
  if (score <= 60) return "You hold a balanced perspective — you see life outcomes as a product of both personal effort and external circumstances, depending on the situation.";
  if (score <= 80) return "You lean external — you tend to see forces outside your control as playing a significant role in how things turn out, while still valuing personal effort.";
  return "You have a strongly external orientation — you tend to see most outcomes as shaped by luck, timing, other people, or circumstances beyond your influence.";
};

const getLabel = (score) => {
  if (score <= 20) return 'Strongly Internal';
  if (score <= 40) return 'Mostly Internal';
  if (score <= 60) return 'Balanced';
  if (score <= 80) return 'Mostly External';
  return 'Strongly External';
};


// --- MAIN COMPONENT ---
const LocusOfControlPage = () => {
  const [phase, setPhase] = useState('intro');
  const [sectionIdx, setSectionIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [sliderValue, setSliderValue] = useState(50);
  const [sliderTouched, setSliderTouched] = useState(false);
  const [fade, setFade] = useState(true);

  // Shuffle questions and options on mount
  const sections = useMemo(() => {
    const shuffledScenarios = shuffleArray(scenarioQuestions).map(q => ({
      ...q, type: 'scenario', options: shuffleArray(q.options)
    }));
    const shuffledSpectrum = shuffleArray(spectrumQuestions).map(q => ({
      ...q, type: 'spectrum'
    }));
    const shuffledLikert = shuffleArray(likertQuestions).map(q => ({
      ...q, type: 'likert'
    }));

    return [
      { name: 'Situations', description: 'Read each scenario and choose the response that feels closest to your genuine first reaction. There are no right or wrong answers.', questions: shuffledScenarios },
      { name: 'Perspectives', description: 'For each prompt, two perspectives sit at opposite ends of a slider. Drag to where you actually fall between them — you don\'t have to pick a side.', questions: shuffledSpectrum },
      { name: 'Reflections', description: 'Rate how much you agree or disagree with each statement. Go with your gut.', questions: shuffledLikert },
    ];
  }, []);

  const currentSection = sections[sectionIdx];
  const currentQuestion = currentSection?.questions[questionIdx];
  const totalQuestions = 24;
  const globalQuestionNum = sectionIdx * 8 + questionIdx + 1;
  const progress = ((globalQuestionNum - 1) / totalQuestions) * 100;

  const transition = useCallback((callback) => {
    setFade(false);
    setTimeout(() => {
      callback();
      setSelected(null);
      setSliderValue(50);
      setSliderTouched(false);
      setFade(true);
    }, 250);
  }, []);

  const handleSelect = (optionIndex, score) => {
    setSelected(optionIndex);
    const q = currentQuestion;
    let finalScore = score;
    if (q.type === 'likert') {
      finalScore = scoreLikert(optionIndex, q.direction);
    }
    setAnswers(prev => ({
      ...prev,
      [q.id]: { score: finalScore, domain: q.domain, optionIndex }
    }));
  };

  const handleSliderChange = (value) => {
    setSliderValue(value);
    setSliderTouched(true);
    const q = currentQuestion;
    const score = value / 100;
    setAnswers(prev => ({
      ...prev,
      [q.id]: { score, domain: q.domain, optionIndex: value }
    }));
  };

  const isAnswered = () => {
    if (currentQuestion?.type === 'spectrum') return sliderTouched;
    return selected !== null;
  };

  const handleContinue = () => {
    if (!isAnswered()) return;
    transition(() => {
      if (questionIdx < currentSection.questions.length - 1) {
        setQuestionIdx(questionIdx + 1);
      } else if (sectionIdx < sections.length - 1) {
        setSectionIdx(sectionIdx + 1);
        setQuestionIdx(0);
        setPhase('sectionIntro');
      } else {
        setPhase('results');
      }
    });
  };

  const handleBegin = () => {
    setPhase('sectionIntro');
  };

  const handleSectionStart = () => {
    setPhase('test');
  };

  const results = phase === 'results' ? calculateResults(answers) : null;

  // --- INTRO ---
  if (phase === 'intro') {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#faf9f6' }}>
        <a href="/" className="fixed top-6 left-6 text-stone-400 hover:text-stone-600 transition-colors z-40 text-sm">← Back</a>
        <main className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="max-w-xl text-center animate-locFadeUp">
            <p className="text-stone-400 text-xs tracking-[0.3em] uppercase mb-6">AP Psychology</p>
            <h1 className="text-4xl md:text-5xl font-serif text-stone-800 mb-3 leading-tight">
              Locus of Control
            </h1>
            <p className="text-stone-400 text-lg font-light italic mb-10">Revised Assessment</p>
            <p className="text-stone-600 leading-relaxed mb-4 font-light text-lg">
              Locus of control describes where you place the driver's seat of your life — whether you
              see outcomes as shaped primarily by your own actions or by forces outside your influence.
            </p>
            <p className="text-stone-500 leading-relaxed mb-10 font-light">
              This assessment improves on the traditional 40-question survey by using multiple question
              formats, measuring four separate life domains, and presenting results as a spectrum rather
              than a label. It takes about 5 minutes.
            </p>
            <button
              onClick={handleBegin}
              className="inline-flex items-center gap-3 px-10 py-4 bg-stone-800 text-white font-medium rounded-xl hover:bg-stone-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-stone-900/15 text-lg"
            >
              Begin
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </button>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-stone-400">
              <span>24 questions</span>
              <span className="w-1 h-1 bg-stone-300 rounded-full" />
              <span>4 domains</span>
              <span className="w-1 h-1 bg-stone-300 rounded-full" />
              <span>~5 minutes</span>
            </div>
          </div>
        </main>
        <style>{locStyles}</style>
      </div>
    );
  }

  // --- SECTION INTRO ---
  if (phase === 'sectionIntro') {
    const sec = sections[sectionIdx];
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#faf9f6' }}>
        <header className="py-4 px-6">
          <div className="max-w-2xl mx-auto">
            <div className="h-1 bg-stone-200 rounded-full overflow-hidden">
              <div className="h-full bg-stone-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-md text-center animate-locFadeUp">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-stone-100 mb-6">
              <span className="text-stone-500 text-sm font-medium">{sectionIdx + 1}/3</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif text-stone-800 mb-4">{sec.name}</h2>
            <p className="text-stone-500 leading-relaxed font-light mb-10">{sec.description}</p>
            <button
              onClick={handleSectionStart}
              className="inline-flex items-center gap-2 px-8 py-3 bg-stone-800 text-white font-medium rounded-xl hover:bg-stone-700 transition-all"
            >
              Continue
            </button>
          </div>
        </main>
        <style>{locStyles}</style>
      </div>
    );
  }

  // --- TEST ---
  if (phase === 'test' && currentQuestion) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#faf9f6' }}>
        {/* Progress */}
        <header className="py-4 px-6 flex-shrink-0">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-stone-400 tracking-wide">
                {currentSection.name} <span className="text-stone-300 mx-1">·</span> {questionIdx + 1} of {currentSection.questions.length}
              </span>
              <span className="text-xs text-stone-400">{globalQuestionNum}/{totalQuestions}</span>
            </div>
            <div className="h-1 bg-stone-200 rounded-full overflow-hidden">
              <div className="h-full bg-stone-500 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </header>

        {/* Question */}
        <main className="flex-1 flex items-center justify-center px-6 py-8">
          <div className={`max-w-2xl w-full transition-all duration-250 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>

            {/* SCENARIO */}
            {currentQuestion.type === 'scenario' && (
              <div>
                <div className="bg-stone-100/60 rounded-2xl p-6 mb-8 border border-stone-200/50">
                  <p className="text-stone-700 text-lg leading-relaxed font-light">{currentQuestion.situation}</p>
                </div>
                <p className="text-stone-500 text-sm tracking-wide uppercase mb-5">{currentQuestion.prompt}</p>
                <div className="space-y-3">
                  {currentQuestion.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(i, opt.score)}
                      className={`w-full text-left p-5 rounded-xl border transition-all duration-200 ${
                        selected === i
                          ? 'bg-stone-800 border-stone-800 text-white shadow-lg'
                          : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300 hover:shadow-sm'
                      }`}
                    >
                      <span className="font-light leading-relaxed">{opt.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SPECTRUM SLIDER */}
            {currentQuestion.type === 'spectrum' && (
              <div>
                <p className="text-stone-800 text-xl md:text-2xl font-serif leading-relaxed mb-10 text-center">{currentQuestion.prompt}</p>
                <div className="bg-white rounded-2xl border border-stone-200/60 p-6 md:p-8">
                  <div className="flex justify-between items-start gap-6 mb-8">
                    <p className={`text-sm leading-relaxed flex-1 transition-all duration-300 ${
                      sliderTouched && sliderValue < 40 ? 'text-stone-800 font-medium' : 'text-stone-500 font-light'
                    }`}>
                      {currentQuestion.left}
                    </p>
                    <p className={`text-sm leading-relaxed flex-1 text-right transition-all duration-300 ${
                      sliderTouched && sliderValue > 60 ? 'text-stone-800 font-medium' : 'text-stone-500 font-light'
                    }`}>
                      {currentQuestion.right}
                    </p>
                  </div>
                  <div className="relative px-1">
                    <div className="absolute top-1/2 left-0 right-0 h-2 bg-stone-100 rounded-full -translate-y-1/2" />
                    <div
                      className="absolute top-1/2 left-0 h-2 rounded-full -translate-y-1/2 transition-all duration-100"
                      style={{
                        width: `${sliderValue}%`,
                        background: `linear-gradient(90deg, #78716c40, #78716c90)`,
                      }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderValue}
                      onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                      className="loc-slider relative w-full h-2 appearance-none bg-transparent cursor-pointer z-10"
                    />
                  </div>
                  <div className="flex justify-between mt-3">
                    <span className="text-[11px] text-stone-300 uppercase tracking-wider">Internal</span>
                    <span className={`text-[11px] transition-all duration-200 ${sliderTouched ? 'text-stone-500' : 'text-stone-300'}`}>
                      {sliderTouched ? (
                        sliderValue < 30 ? 'Leaning internal' :
                        sliderValue < 45 ? 'Slightly internal' :
                        sliderValue <= 55 ? 'Balanced' :
                        sliderValue <= 70 ? 'Slightly external' :
                        'Leaning external'
                      ) : 'Drag to respond'}
                    </span>
                    <span className="text-[11px] text-stone-300 uppercase tracking-wider">External</span>
                  </div>
                </div>
              </div>
            )}

            {/* LIKERT */}
            {currentQuestion.type === 'likert' && (
              <div>
                <p className="text-stone-800 text-xl md:text-2xl font-serif leading-relaxed mb-10 text-center">{currentQuestion.statement}</p>
                <div className="flex items-center justify-center gap-1 sm:gap-3 mb-4">
                  {LIKERT_LABELS.map((label, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(i, i)}
                      className={`flex flex-col items-center gap-2 p-2 sm:p-3 rounded-xl transition-all duration-200 min-w-[56px] sm:min-w-[72px] ${
                        selected === i
                          ? 'bg-stone-800 shadow-lg'
                          : 'hover:bg-stone-100'
                      }`}
                    >
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-all flex items-center justify-center ${
                        selected === i
                          ? 'scale-110'
                          : 'border-2 border-stone-300 bg-white'
                      }`}>
                        {selected === i && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                        )}
                      </div>
                      <span className={`text-[10px] sm:text-xs leading-tight text-center transition-colors ${
                        selected === i ? 'text-white font-medium' : 'text-stone-400'
                      }`}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Continue button */}
            <div className={`mt-10 flex justify-center transition-all duration-300 ${isAnswered() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
              <button
                onClick={handleContinue}
                className="inline-flex items-center gap-2 px-8 py-3 bg-stone-800 text-white font-medium rounded-xl hover:bg-stone-700 transition-all"
              >
                Continue
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </main>
        <style>{locStyles}</style>
      </div>
    );
  }

  // --- RESULTS ---
  if (phase === 'results' && results) {
    return (
      <div className="min-h-screen" style={{ background: '#faf9f6' }}>
        <a href="/" className="fixed top-6 left-6 text-stone-400 hover:text-stone-600 transition-colors z-40 text-sm">← Back</a>

        {/* Results Header */}
        <header className="pt-20 pb-12 px-6">
          <div className="max-w-2xl mx-auto text-center animate-locFadeUp">
            <p className="text-stone-400 text-xs tracking-[0.3em] uppercase mb-4">Your Results</p>
            <h1 className="text-3xl md:text-4xl font-serif text-stone-800 mb-3">Locus of Control Profile</h1>
            <p className="text-stone-500 font-light">A snapshot of how you perceive control across four areas of life</p>
          </div>
        </header>

        {/* Overall Score */}
        <section className="px-6 pb-12">
          <div className="max-w-2xl mx-auto animate-locFadeUp" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white rounded-2xl border border-stone-200/60 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm text-stone-400 tracking-wide uppercase">Overall Orientation</h3>
                <span className="text-sm font-medium text-stone-600">{getLabel(results.overall)}</span>
              </div>
              <SpectrumBar score={results.overall} color="#78716c" />
              <p className="mt-6 text-stone-600 font-light leading-relaxed">{getOverallInterpretation(results.overall)}</p>
            </div>
          </div>
        </section>

        {/* Domain Scores */}
        <section className="px-6 pb-16">
          <div className="max-w-2xl mx-auto space-y-4">
            {Object.entries(DOMAINS).map(([key, domain], i) => (
              <div
                key={key}
                className="bg-white rounded-2xl border border-stone-200/60 p-6 shadow-sm animate-locFadeUp"
                style={{ animationDelay: `${0.15 + i * 0.05}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: domain.fill }} />
                    <h3 className="text-stone-700 font-medium">{domain.name}</h3>
                  </div>
                  <span className="text-sm text-stone-400">{getLabel(results[key])}</span>
                </div>
                <SpectrumBar score={results[key]} color={domain.fill} />
                <p className="mt-4 text-stone-500 font-light text-sm leading-relaxed">{getInterpretation(results[key], key)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Framing note */}
        <section className="px-6 pb-16">
          <div className="max-w-2xl mx-auto">
            <div className="bg-stone-100/50 rounded-2xl p-6 border border-stone-200/50 animate-locFadeUp" style={{ animationDelay: '0.4s' }}>
              <p className="text-stone-500 font-light text-sm leading-relaxed text-center">
                This profile reflects your <em>current tendencies</em>, not a fixed trait. Locus of control shifts with experience, context, and personal growth.
                A balanced orientation isn't inherently better or worse than leaning internal or external — each carries its own strengths and blind spots.
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-2xl mx-auto px-6">
          <div className="flex items-center justify-center gap-4 py-4">
            <div className="w-16 h-px bg-stone-200" />
            <span className="text-xs text-stone-300">•</span>
            <div className="w-16 h-px bg-stone-200" />
          </div>
        </div>

        {/* Methodology Section */}
        <section className="px-6 pt-12 pb-24">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12 animate-locFadeUp" style={{ animationDelay: '0.5s' }}>
              <p className="text-stone-400 text-xs tracking-[0.3em] uppercase mb-4">Methodology</p>
              <h2 className="text-2xl md:text-3xl font-serif text-stone-800 mb-3">Why This Version Is Better</h2>
              <p className="text-stone-500 font-light leading-relaxed">
                The original 40-question Locus of Control survey had significant validity problems identified
                during our class discussion. Below is each flaw, who raised it, and how this assessment addresses it.
              </p>
            </div>

            <div className="space-y-6">
              {methodologyItems.map((item, i) => (
                <div
                  key={item.number}
                  className="bg-white rounded-2xl border border-stone-200/60 p-6 md:p-8 shadow-sm animate-locFadeUp"
                  style={{ animationDelay: `${0.55 + i * 0.05}s` }}
                >
                  <div className="flex items-start gap-5">
                    <span className="text-stone-300 text-sm font-light mt-1 flex-shrink-0">{item.number}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-stone-800 font-medium text-lg mb-3">{item.title}</h3>

                      <div className="mb-4">
                        <p className="text-stone-400 text-xs tracking-wide uppercase mb-1.5">The Problem</p>
                        <p className="text-stone-600 font-light leading-relaxed text-sm">{item.problem}</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-stone-400 text-xs tracking-wide uppercase mb-1.5">Identified By</p>
                        <p className="text-stone-500 font-light text-sm italic">{item.raisedBy}</p>
                      </div>

                      <div>
                        <p className="text-stone-400 text-xs tracking-wide uppercase mb-1.5">How This Version Solves It</p>
                        <p className="text-stone-600 font-light leading-relaxed text-sm">{item.solution}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-stone-200/50 py-8">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <p className="text-xs text-stone-400">
              Locus of Control Revised Assessment <span className="text-stone-300 mx-1">·</span> AP Psychology <span className="text-stone-300 mx-1">·</span> Designed by Jonathan Shiell
            </p>
          </div>
        </footer>

        <style>{locStyles}</style>
      </div>
    );
  }

  return null;
};

// --- SPECTRUM BAR COMPONENT ---
const SpectrumBar = ({ score, color }) => {
  const clampedScore = Math.max(0, Math.min(100, score));
  return (
    <div>
      <div className="relative h-2 bg-stone-100 rounded-full overflow-visible">
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${clampedScore}%`,
            background: `linear-gradient(90deg, ${color}20, ${color}60)`,
          }}
        />
        <div
          className="absolute top-1/2 w-4 h-4 rounded-full shadow-md border-2 border-white transition-all duration-700 ease-out"
          style={{
            left: `${clampedScore}%`,
            transform: `translateX(-50%) translateY(-50%)`,
            background: color,
          }}
        />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-[11px] text-stone-400">Internal</span>
        <span className="text-[11px] text-stone-400">External</span>
      </div>
    </div>
  );
};

// --- STYLES ---
const locStyles = `
  @keyframes locFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-locFadeUp {
    opacity: 0;
    animation: locFadeUp 0.6s ease-out forwards;
  }
  
  .loc-slider {
    -webkit-appearance: none;
    appearance: none;
    height: 8px;
    background: transparent;
    outline: none;
  }
  .loc-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #44403c;
    cursor: pointer;
    border: 3px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .loc-slider::-webkit-slider-thumb:hover {
    transform: scale(1.15);
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
  }
  .loc-slider::-webkit-slider-thumb:active {
    transform: scale(1.05);
  }
  .loc-slider::-moz-range-thumb {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #44403c;
    cursor: pointer;
    border: 3px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  }
`;

export default LocusOfControlPage;
