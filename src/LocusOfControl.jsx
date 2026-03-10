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
  academic: { name: 'Academic', fill: '#78716c', light: '#f5f5f4' },
  social: { name: 'Social', fill: '#a18072', light: '#faf5f3' },
  health: { name: 'Health & Wellbeing', fill: '#8a9a7b', light: '#f4f7f2' },
  career: { name: 'Career & Future', fill: '#b0a08a', light: '#faf8f5' },
};

// --- QUESTION DATA ---

const scenarioQuestions = [
  {
    id: 's1', domain: 'academic', format: 'scenario',
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
    id: 's2', domain: 'social', format: 'scenario',
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
    id: 's3', domain: 'health', format: 'scenario',
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
    id: 's4', domain: 'career', format: 'scenario',
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
    id: 's5', domain: 'academic', format: 'scenario',
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
    id: 's6', domain: 'social', format: 'scenario',
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
    id: 's7', domain: 'health', format: 'scenario',
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
    id: 's8', domain: 'career', format: 'scenario',
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
    id: 'sp1', domain: 'academic', format: 'spectrum',
    prompt: 'When I do well in school, it\'s usually because...',
    left: "I found the right approach and put in consistent effort.",
    right: "The material aligned with how I naturally think and learn.",
  },
  {
    id: 'sp2', domain: 'social', format: 'spectrum',
    prompt: 'When there\'s tension between me and someone, it\'s usually because...',
    left: "I wasn't clear enough in how I communicated.",
    right: "People see the world from very different angles sometimes.",
  },
  {
    id: 'sp3', domain: 'health', format: 'spectrum',
    prompt: 'My overall energy and wellbeing are mostly shaped by...',
    left: "The habits and daily routines I choose to maintain.",
    right: "Factors like genetics, seasonal changes, and life stress.",
  },
  {
    id: 'sp4', domain: 'career', format: 'spectrum',
    prompt: 'People who end up where they want to be in life usually got there because...',
    left: "They stayed focused and made strategic sacrifices.",
    right: "The right doors opened for them at the right time.",
  },
  {
    id: 'sp5', domain: 'academic', format: 'spectrum',
    prompt: 'When I struggle with a new subject or skill...',
    left: "It usually means I need to try a different approach or put in more time.",
    right: "Some things just don't come naturally to certain people.",
  },
  {
    id: 'sp6', domain: 'social', format: 'spectrum',
    prompt: 'The quality of my closest friendships depends mostly on...',
    left: "How much honesty and effort I bring to those relationships.",
    right: "Whether our personalities naturally complement each other.",
  },
  {
    id: 'sp7', domain: 'health', format: 'spectrum',
    prompt: 'When it comes to staying healthy...',
    left: "Good habits like sleep, nutrition, and hygiene make the biggest difference.",
    right: "Some people are just more susceptible to illness regardless of lifestyle.",
  },
  {
    id: 'sp8', domain: 'career', format: 'spectrum',
    prompt: 'Ten years from now, where I am in life will mostly reflect...',
    left: "The decisions and priorities I'm setting right now.",
    right: "How the world around me happens to unfold.",
  },
];

const likertQuestions = [
  { id: 'l1', domain: 'academic', format: 'likert', direction: 'internal', statement: "When I commit to learning something new, I can usually figure it out with enough effort." },
  { id: 'l2', domain: 'social', format: 'likert', direction: 'internal', statement: "I have the ability to resolve most conflicts in my relationships if I approach them thoughtfully." },
  { id: 'l3', domain: 'health', format: 'likert', direction: 'internal', statement: "My physical and mental wellbeing are largely within my control." },
  { id: 'l4', domain: 'career', format: 'likert', direction: 'internal', statement: "The path my life takes will mostly be shaped by my own choices and actions." },
  { id: 'l5', domain: 'academic', format: 'likert', direction: 'external', statement: "Some people are naturally better at academics, and effort can only do so much to close that gap." },
  { id: 'l6', domain: 'social', format: 'likert', direction: 'external', statement: "Whether people connect with you often comes down to chemistry that nobody can control." },
  { id: 'l7', domain: 'health', format: 'likert', direction: 'external', statement: "Most serious health problems are a matter of genetics and circumstances, not personal choices." },
  { id: 'l8', domain: 'career', format: 'likert', direction: 'external', statement: "Success in life depends more on the opportunities you're given than on what you do with them." },
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
    solution: 'Results are presented as a position on a continuous spectrum with percentage breakdowns, not a category. Language emphasizes that locus of control is a current tendency that shifts with experience, context, and personal growth.',
  },
  {
    number: '08',
    title: 'Instinct vs. Belief Comparison',
    problem: 'The original test had one question format and one score, making it impossible to detect whether someone\'s instinctive reactions aligned with their stated beliefs. People often behave differently than they think they believe — and that disconnect is itself a valuable insight.',
    raisedBy: 'Helen Rajabov (noted the gap between behavior and stated beliefs), Jonathan Shiell (noted the gap between "what I think I believe and what I actually believe")',
    solution: 'Three question formats each measure a different cognitive layer: scenarios capture instinctive reactions, spectrum sliders capture comparative weighing, and Likert statements capture explicit beliefs. The results compare scores across formats, revealing whether your instincts, reflections, and stated beliefs align — or where they diverge.',
  },
];

// --- ADVANCED SCORING ENGINE ---
const scoreLikert = (optionIndex, direction) => {
  const values = [0, 0.25, 0.5, 0.75, 1];
  if (direction === 'internal') {
    return values[4 - optionIndex];
  } else {
    return values[optionIndex];
  }
};

const calculateAdvancedResults = (answers) => {
  // Domain scores
  const domainData = {};
  Object.keys(DOMAINS).forEach(d => {
    domainData[d] = { scores: [], scenario: [], spectrum: [], likert: [] };
  });

  // Format scores
  const formatData = { scenario: [], spectrum: [], likert: [] };

  Object.entries(answers).forEach(([qId, data]) => {
    if (domainData[data.domain]) {
      domainData[data.domain].scores.push(data.score);
      if (data.format && domainData[data.domain][data.format]) {
        domainData[data.domain][data.format].push(data.score);
      }
    }
    if (data.format && formatData[data.format]) {
      formatData[data.format].push(data.score);
    }
  });

  // Calculate domain results
  const domains = {};
  let overallTotal = 0;
  let overallCount = 0;

  Object.entries(domainData).forEach(([domain, data]) => {
    const scores = data.scores;
    const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0.5;
    const internalPct = Math.round((1 - avg) * 100);

    // Consistency: standard deviation of scores in this domain
    const mean = avg;
    const variance = scores.length > 1
      ? scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length
      : 0;
    const stdDev = Math.sqrt(variance);

    // Consistency classification
    let consistency;
    if (stdDev < 0.2) consistency = 'consistent';
    else if (stdDev < 0.35) consistency = 'moderate';
    else consistency = 'conflicted';

    domains[domain] = {
      internalPct,
      externalPct: 100 - internalPct,
      rawAvg: avg,
      consistency,
      stdDev: Math.round(stdDev * 100),
      scenarioAvg: data.scenario.length > 0 ? data.scenario.reduce((a, b) => a + b, 0) / data.scenario.length : null,
      spectrumAvg: data.spectrum.length > 0 ? data.spectrum.reduce((a, b) => a + b, 0) / data.spectrum.length : null,
      likertAvg: data.likert.length > 0 ? data.likert.reduce((a, b) => a + b, 0) / data.likert.length : null,
    };

    overallTotal += scores.reduce((a, b) => a + b, 0);
    overallCount += scores.length;
  });

  // Overall
  const overallAvg = overallCount > 0 ? overallTotal / overallCount : 0.5;
  const overallInternalPct = Math.round((1 - overallAvg) * 100);

  // Format comparison (instinct vs belief)
  const formatAvg = (arr) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0.5;
  const scenarioInternal = Math.round((1 - formatAvg(formatData.scenario)) * 100);
  const spectrumInternal = Math.round((1 - formatAvg(formatData.spectrum)) * 100);
  const likertInternal = Math.round((1 - formatAvg(formatData.likert)) * 100);

  // Detect instinct vs belief gap
  const maxFormat = Math.max(scenarioInternal, spectrumInternal, likertInternal);
  const minFormat = Math.min(scenarioInternal, spectrumInternal, likertInternal);
  const formatGap = maxFormat - minFormat;

  let formatInsight = '';
  if (formatGap < 10) {
    formatInsight = 'Your instincts, reflections, and stated beliefs are well-aligned. You seem to have a clear and consistent sense of how much control you feel.';
  } else if (formatGap < 25) {
    formatInsight = 'There\'s a moderate gap between how you instinctively react and what you explicitly believe. This is common — most people have some disconnect between gut reactions and stated values.';
  } else {
    // Identify which layers diverge
    if (scenarioInternal > likertInternal + 15) {
      formatInsight = 'Your instinctive reactions are more internal than your stated beliefs. You may act with more personal agency than you give yourself credit for — your reflexes suggest more confidence in your own control than your conscious beliefs do.';
    } else if (likertInternal > scenarioInternal + 15) {
      formatInsight = 'Your stated beliefs are more internal than your instinctive reactions. You may intellectually believe in personal control, but your gut reactions in real situations lean more toward seeing external factors at play.';
    } else {
      formatInsight = 'There\'s a notable gap between different layers of your thinking. When you reflect comparatively, you weigh things differently than when you react instinctively or state beliefs directly.';
    }
  }

  // Strongest and weakest domains
  const domainEntries = Object.entries(domains);
  const sorted = [...domainEntries].sort((a, b) => a[1].internalPct - b[1].internalPct);
  const mostExternal = sorted[0];
  const mostInternal = sorted[sorted.length - 1];
  const domainSpread = mostInternal[1].internalPct - mostExternal[1].internalPct;

  let domainInsight = '';
  if (domainSpread < 10) {
    domainInsight = `Your sense of control is relatively uniform across all domains. You don't differentiate much between areas of life when it comes to how much influence you feel you have.`;
  } else {
    domainInsight = `You feel most in control of ${DOMAINS[mostInternal[0]].name.toLowerCase()} outcomes (${mostInternal[1].internalPct}% internal) and least in control of ${DOMAINS[mostExternal[0]].name.toLowerCase()} outcomes (${mostExternal[1].internalPct}% internal) — a spread of ${domainSpread} points.`;
  }

  // Consistency across domains
  const conflictedDomains = domainEntries.filter(([_, d]) => d.consistency === 'conflicted').map(([k]) => DOMAINS[k].name);

  // Generate overall summary
  let summary = '';
  const label = getLabel(100 - overallInternalPct);

  if (overallInternalPct >= 70) {
    summary = `You have a predominantly internal locus of control (${overallInternalPct}% internal). You generally see yourself as the primary driver of your outcomes. `;
  } else if (overallInternalPct >= 55) {
    summary = `You lean internal (${overallInternalPct}% internal). You tend to attribute outcomes to your own actions more than to external forces, though you recognize both play a role. `;
  } else if (overallInternalPct >= 45) {
    summary = `You hold a balanced perspective (${overallInternalPct}% internal, ${100 - overallInternalPct}% external). You see outcomes as shaped by a genuine mix of personal effort and circumstance. `;
  } else if (overallInternalPct >= 30) {
    summary = `You lean external (${100 - overallInternalPct}% external). You tend to see outside forces as playing a significant role in how things turn out, while still acknowledging personal agency. `;
  } else {
    summary = `You have a predominantly external locus of control (${100 - overallInternalPct}% external). You tend to see most outcomes as shaped by factors beyond your direct control. `;
  }

  summary += domainInsight;

  if (formatGap >= 20) {
    summary += ` Notably, there's a meaningful gap between your instinctive reactions and stated beliefs, suggesting your relationship with control is more complex than a single number can capture.`;
  }

  if (conflictedDomains.length > 0) {
    summary += ` You show internal tension in ${conflictedDomains.join(' and ').toLowerCase()}, where your answers pulled in opposing directions — this may reflect genuine ambivalence or context-dependent beliefs in ${conflictedDomains.length === 1 ? 'that area' : 'those areas'}.`;
  }

  return {
    overall: { internalPct: overallInternalPct, externalPct: 100 - overallInternalPct, label },
    domains,
    format: { scenario: scenarioInternal, spectrum: spectrumInternal, likert: likertInternal, gap: formatGap, insight: formatInsight },
    insights: { domainInsight, domainSpread, mostInternal: mostInternal[0], mostExternal: mostExternal[0], conflictedDomains },
    summary,
  };
};

const getLabel = (externalScore) => {
  if (externalScore <= 20) return 'Strongly Internal';
  if (externalScore <= 40) return 'Mostly Internal';
  if (externalScore <= 60) return 'Balanced';
  if (externalScore <= 80) return 'Mostly External';
  return 'Strongly External';
};

const getConsistencyLabel = (c) => {
  if (c === 'consistent') return 'Consistent';
  if (c === 'moderate') return 'Moderate';
  return 'Mixed signals';
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
      [q.id]: { score: finalScore, domain: q.domain, format: q.format || q.type, optionIndex }
    }));
  };

  const handleSliderChange = (value) => {
    setSliderValue(value);
    setSliderTouched(true);
    const q = currentQuestion;
    const score = value / 100;
    setAnswers(prev => ({
      ...prev,
      [q.id]: { score, domain: q.domain, format: q.format || 'spectrum', optionIndex: value }
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

  const results = phase === 'results' ? calculateAdvancedResults(answers) : null;

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
              onClick={() => setPhase('sectionIntro')}
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
              onClick={() => setPhase('test')}
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
                      className="absolute top-1/2 left-0 h-2 rounded-full -translate-y-1/2"
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
    const r = results;
    return (
      <div className="min-h-screen" style={{ background: '#faf9f6' }}>
        <a href="/" className="fixed top-6 left-6 text-stone-400 hover:text-stone-600 transition-colors z-40 text-sm">← Back</a>

        {/* Header */}
        <header className="pt-20 pb-8 px-6">
          <div className="max-w-2xl mx-auto text-center animate-locFadeUp">
            <p className="text-stone-400 text-xs tracking-[0.3em] uppercase mb-4">Your Results</p>
            <h1 className="text-3xl md:text-4xl font-serif text-stone-800 mb-3">Locus of Control Profile</h1>
          </div>
        </header>

        {/* Overall Score — Big Number */}
        <section className="px-6 pb-10">
          <div className="max-w-2xl mx-auto animate-locFadeUp" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white rounded-2xl border border-stone-200/60 p-8 shadow-sm text-center">
              <div className="flex items-center justify-center gap-4 mb-2">
                <span className="text-5xl md:text-6xl font-light text-stone-800">{r.overall.internalPct}%</span>
                <div className="text-left">
                  <span className="text-sm text-stone-400 block">Internal</span>
                  <span className="text-sm text-stone-400 block">{r.overall.externalPct}% External</span>
                </div>
              </div>
              <SpectrumBar score={100 - r.overall.internalPct} color="#78716c" />
              <p className="mt-6 text-stone-600 font-light leading-relaxed text-sm">{r.summary}</p>
            </div>
          </div>
        </section>

        {/* Domain Breakdown */}
        <section className="px-6 pb-10">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xs text-stone-400 tracking-[0.2em] uppercase mb-4 animate-locFadeUp" style={{ animationDelay: '0.15s' }}>By Domain</h2>
            <div className="space-y-3">
              {Object.entries(DOMAINS).map(([key, domain], i) => {
                const d = r.domains[key];
                return (
                  <div
                    key={key}
                    className="bg-white rounded-2xl border border-stone-200/60 p-6 shadow-sm animate-locFadeUp"
                    style={{ animationDelay: `${0.2 + i * 0.05}s` }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: domain.fill }} />
                        <h3 className="text-stone-700 font-medium">{domain.name}</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        {d.consistency === 'conflicted' && (
                          <span className="text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">Mixed signals</span>
                        )}
                        <span className="text-lg font-light text-stone-700">{d.internalPct}%<span className="text-xs text-stone-400 ml-1">int</span></span>
                      </div>
                    </div>
                    <SpectrumBar score={100 - d.internalPct} color={domain.fill} />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Instinct vs Belief */}
        <section className="px-6 pb-10">
          <div className="max-w-2xl mx-auto animate-locFadeUp" style={{ animationDelay: '0.45s' }}>
            <h2 className="text-xs text-stone-400 tracking-[0.2em] uppercase mb-4">Instinct vs. Belief</h2>
            <div className="bg-white rounded-2xl border border-stone-200/60 p-6 shadow-sm">
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                    </div>
                    <div>
                      <p className="text-stone-700 text-sm font-medium">Instinctive reactions</p>
                      <p className="text-stone-400 text-xs">From scenario questions</p>
                    </div>
                  </div>
                  <span className="text-stone-700 font-medium">{r.format.scenario}%<span className="text-xs text-stone-400 ml-1">int</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" /></svg>
                    </div>
                    <div>
                      <p className="text-stone-700 text-sm font-medium">Comparative weighing</p>
                      <p className="text-stone-400 text-xs">From perspective sliders</p>
                    </div>
                  </div>
                  <span className="text-stone-700 font-medium">{r.format.spectrum}%<span className="text-xs text-stone-400 ml-1">int</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
                    </div>
                    <div>
                      <p className="text-stone-700 text-sm font-medium">Stated beliefs</p>
                      <p className="text-stone-400 text-xs">From agreement ratings</p>
                    </div>
                  </div>
                  <span className="text-stone-700 font-medium">{r.format.likert}%<span className="text-xs text-stone-400 ml-1">int</span></span>
                </div>
              </div>
              {r.format.gap >= 10 && (
                <div className="pt-4 border-t border-stone-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-stone-500">{r.format.gap}pt gap detected</span>
                  </div>
                  <p className="text-stone-500 font-light text-sm leading-relaxed">{r.format.insight}</p>
                </div>
              )}
              {r.format.gap < 10 && (
                <div className="pt-4 border-t border-stone-100">
                  <p className="text-stone-500 font-light text-sm leading-relaxed">{r.format.insight}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Key Insight Callout */}
        {r.insights.domainSpread >= 15 && (
          <section className="px-6 pb-10">
            <div className="max-w-2xl mx-auto animate-locFadeUp" style={{ animationDelay: '0.5s' }}>
              <div className="bg-stone-100/50 rounded-2xl p-6 border border-stone-200/50">
                <p className="text-stone-600 font-light text-sm leading-relaxed">
                  <span className="font-medium">Key insight:</span> {r.insights.domainInsight}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Framing note */}
        <section className="px-6 pb-16">
          <div className="max-w-2xl mx-auto animate-locFadeUp" style={{ animationDelay: '0.55s' }}>
            <p className="text-stone-400 font-light text-xs leading-relaxed text-center">
              This profile reflects your <em>current tendencies</em>, not a fixed trait. Locus of control shifts with experience, context, and personal growth.
            </p>
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

        {/* Methodology */}
        <section className="px-6 pt-12 pb-24">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12 animate-locFadeUp" style={{ animationDelay: '0.6s' }}>
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
                  style={{ animationDelay: `${0.65 + i * 0.05}s` }}
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

// --- SPECTRUM BAR ---
const SpectrumBar = ({ score, color }) => {
  const c = Math.max(0, Math.min(100, score));
  return (
    <div>
      <div className="relative h-2 bg-stone-100 rounded-full overflow-visible">
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${c}%`, background: `linear-gradient(90deg, ${color}20, ${color}60)` }}
        />
        <div
          className="absolute top-1/2 w-4 h-4 rounded-full shadow-md border-2 border-white transition-all duration-700 ease-out"
          style={{ left: `${c}%`, transform: 'translateX(-50%) translateY(-50%)', background: color }}
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
