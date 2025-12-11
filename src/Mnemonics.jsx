import React, { useState, useEffect } from 'react';

// Animated components for specific concepts

// Echoic Memory - Rippling echo effect
const EchoicAnimation = () => {
  const [ripples, setRipples] = useState([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRipples(prev => [...prev.slice(-3), Date.now()]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative h-20 flex items-center justify-center overflow-hidden">
      <div className="text-2xl font-bold text-blue-600 z-10">👂 Echo...</div>
      {ripples.map((id, i) => (
        <div
          key={id}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            animation: 'ripple 2s ease-out forwards',
          }}
        >
          <div className="w-16 h-16 border-2 border-blue-400 rounded-full" 
               style={{ animation: 'ripple-ring 2s ease-out forwards' }} />
        </div>
      ))}
    </div>
  );
};

// Iconic Memory - Flash and fade (like visual afterimage)
const IconicAnimation = () => {
  const [flash, setFlash] = useState(false);
  const [afterimage, setAfterimage] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFlash(true);
      setTimeout(() => {
        setFlash(false);
        setAfterimage(true);
      }, 200);
      setTimeout(() => setAfterimage(false), 1500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative h-20 flex items-center justify-center">
      <div className={`text-2xl font-bold transition-all duration-200 ${
        flash ? 'text-yellow-400 scale-110' : afterimage ? 'text-yellow-200 opacity-50' : 'text-gray-300'
      }`}>
        👁️ Flash!
      </div>
      {flash && <div className="absolute inset-0 bg-yellow-100 animate-ping rounded-lg" />}
    </div>
  );
};

// Memory Flow - SSL/Three systems animation
const MemoryFlowAnimation = () => {
  const [activeStage, setActiveStage] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage(prev => (prev + 1) % 4);
    }, 1200);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <div className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-500 ${
        activeStage === 1 ? 'bg-rose-500 text-white scale-110 shadow-lg' : 'bg-rose-100 text-rose-600'
      }`}>
        Sensory
      </div>
      <div className={`text-gray-400 transition-all duration-300 ${activeStage === 1 ? 'text-rose-500 scale-125' : ''}`}>→</div>
      <div className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-500 ${
        activeStage === 2 ? 'bg-amber-500 text-white scale-110 shadow-lg' : 'bg-amber-100 text-amber-600'
      }`}>
        Short-term
      </div>
      <div className={`text-gray-400 transition-all duration-300 ${activeStage === 2 ? 'text-amber-500 scale-125' : ''}`}>→</div>
      <div className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-500 ${
        activeStage === 3 ? 'bg-emerald-500 text-white scale-110 shadow-lg' : 'bg-emerald-100 text-emerald-600'
      }`}>
        Long-term
      </div>
    </div>
  );
};

// Interference Animation - Two memories colliding
const InterferenceAnimation = ({ type }) => {
  const [collision, setCollision] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCollision(true);
      setTimeout(() => setCollision(false), 1000);
    }, 2500);
    return () => clearInterval(interval);
  }, []);
  
  const isProactive = type === 'proactive';
  
  return (
    <div className="relative h-16 flex items-center justify-center overflow-hidden">
      <div className={`absolute transition-all duration-700 ${
        collision 
          ? 'left-1/2 -translate-x-1/2' 
          : isProactive ? 'left-4' : 'left-4'
      }`}>
        <span className={`px-2 py-1 rounded text-xs font-bold ${
          isProactive ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
        }`}>
          OLD
        </span>
      </div>
      <div className={`absolute transition-all duration-700 ${
        collision 
          ? 'right-1/2 translate-x-1/2' 
          : 'right-4'
      }`}>
        <span className={`px-2 py-1 rounded text-xs font-bold ${
          isProactive ? 'bg-gray-300 text-gray-600' : 'bg-purple-500 text-white'
        }`}>
          NEW
        </span>
      </div>
      {collision && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl animate-bounce">💥</span>
        </div>
      )}
    </div>
  );
};

// Serial Position - Sandwich animation
const SandwichAnimation = () => {
  const items = ['🍞', '🥬', '🍖', '🧀', '🥒', '🍞'];
  const [highlighted, setHighlighted] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setHighlighted(prev => (prev + 1) % items.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex items-center justify-center gap-1 py-4">
      {items.map((item, i) => {
        const isEdge = i === 0 || i === items.length - 1;
        const isActive = highlighted === i;
        return (
          <div
            key={i}
            className={`text-2xl transition-all duration-300 ${
              isActive ? 'scale-125' : isEdge ? 'opacity-100' : 'opacity-40'
            }`}
          >
            {item}
          </div>
        );
      })}
      <div className="ml-4 text-xs text-gray-500">
        <span className="text-emerald-600 font-medium">Edges</span> = remembered
      </div>
    </div>
  );
};

// Library/Retrieval animation
const LibraryAnimation = () => {
  const [stage, setStage] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStage(prev => (prev + 1) % 4);
    }, 1500);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <div className={`transition-all duration-500 ${stage >= 1 ? 'opacity-100 scale-100' : 'opacity-30 scale-90'}`}>
        <div className="text-3xl">📚</div>
        <div className="text-xs text-gray-500 mt-1">Library</div>
      </div>
      <div className={`text-xl transition-all duration-300 ${stage >= 1 ? 'opacity-100' : 'opacity-30'}`}>→</div>
      <div className={`transition-all duration-500 ${stage >= 2 ? 'opacity-100 scale-100' : 'opacity-30 scale-90'}`}>
        <div className="text-3xl">🔍</div>
        <div className="text-xs text-gray-500 mt-1">Recall</div>
      </div>
      <div className={`text-xl transition-all duration-300 ${stage >= 2 ? 'opacity-100' : 'opacity-30'}`}>→</div>
      <div className={`transition-all duration-500 ${stage >= 3 ? 'opacity-100 scale-100' : 'opacity-30 scale-90'}`}>
        <div className="text-3xl">✓</div>
        <div className="text-xs text-gray-500 mt-1">Recognize</div>
      </div>
    </div>
  );
};

// Amnesia types animation - timeline with blocks
const AmnesiaAnimation = ({ type }) => {
  const [pulse, setPulse] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 500);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
  const isRetrograde = type === 'retrograde';
  
  return (
    <div className="flex items-center justify-center gap-1 py-4">
      <div className="flex items-center gap-1">
        {[1,2,3].map(i => (
          <div 
            key={i}
            className={`w-8 h-6 rounded text-xs flex items-center justify-center font-medium transition-all duration-300 ${
              isRetrograde 
                ? `bg-red-200 text-red-600 ${pulse ? 'opacity-30' : 'opacity-100'}` 
                : 'bg-emerald-100 text-emerald-600'
            }`}
          >
            {isRetrograde && pulse ? '?' : 'Past'}
          </div>
        ))}
      </div>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all ${pulse ? 'scale-110' : ''}`}>
        ⚡
      </div>
      <div className="flex items-center gap-1">
        {[1,2,3].map(i => (
          <div 
            key={i}
            className={`w-8 h-6 rounded text-xs flex items-center justify-center font-medium transition-all duration-300 ${
              !isRetrograde 
                ? `bg-red-200 text-red-600 ${pulse ? 'opacity-30' : 'opacity-100'}` 
                : 'bg-emerald-100 text-emerald-600'
            }`}
          >
            {!isRetrograde && pulse ? '?' : 'New'}
          </div>
        ))}
      </div>
      <div className="ml-3 text-xs text-gray-500">
        {isRetrograde ? 'Can\'t recall past' : 'Can\'t form new'}
      </div>
    </div>
  );
};

// Fading text for types of memory
const FadingMemoryTypes = () => {
  const types = ['Implicit', 'Explicit', 'Semantic', 'Procedural', 'Episodic', 'Prospective'];
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % types.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 py-3">
      {types.map((type, i) => (
        <span
          key={type}
          className={`px-2 py-1 rounded text-sm font-medium transition-all duration-500 ${
            i === activeIndex 
              ? 'bg-violet-500 text-white scale-110 shadow-md' 
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {type}
        </span>
      ))}
    </div>
  );
};

const MnemonicsPage = () => {
  const [expandedItem, setExpandedItem] = useState(null);

  const rubricItems = [
    {
      id: 1,
      title: "Three Memory Systems",
      terms: "Sensory → Short-term → Long-term",
      animation: <MemoryFlowAnimation />,
      mnemonics: [
        {
          type: "Expression",
          phrase: '"Some Students Learn"',
          breakdown: "S = Sensory → S = Short-term → L = Long-term",
          explanation: "Information flows through three stages: briefly captured by Sensory memory, held temporarily in Short-term, then encoded into Long-term storage."
        },
        {
          type: "Connection",
          phrase: '"SSL Connection"',
          breakdown: "Like secure internet layers protecting data",
          explanation: "Just like SSL encrypts data through layers, memories pass through sensory → short-term → long-term layers before being securely stored."
        }
      ]
    },
    {
      id: 2,
      title: "Iconic and Echoic Memory",
      terms: "Visual (iconic) vs Auditory (echoic) sensory memory",
      animation: (
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <IconicAnimation />
            <div className="text-xs text-gray-500 mt-1">Iconic (visual flash)</div>
          </div>
          <div className="text-center">
            <EchoicAnimation />
            <div className="text-xs text-gray-500 mt-1">Echoic (sound ripples)</div>
          </div>
        </div>
      ),
      mnemonics: [
        {
          type: "Connection",
          phrase: '"I see Icons, I hear Echoes"',
          breakdown: "Iconic = I (eyes) = visual | Echoic = E (ears) = auditory",
          explanation: "Icons are visual symbols you SEE. Echoes are sounds you HEAR bouncing back. Iconic lasts ~0.5 sec, Echoic lasts ~3-4 sec."
        }
      ]
    },
    {
      id: 3,
      title: "Six Types of Memory",
      terms: "Implicit, Explicit, Semantic, Procedural, Episodic, Prospective",
      animation: <FadingMemoryTypes />,
      mnemonics: [
        {
          type: "Expression",
          phrase: '"I Eat Spinach, Peas, Even Peppers"',
          breakdown: "I=Implicit, E=Explicit, S=Semantic, P=Procedural, E=Episodic, P=Prospective",
          explanation: "In original order! Implicit (unconscious), Explicit (conscious), Semantic (facts), Procedural (skills), Episodic (events), Prospective (future)."
        },
        {
          type: "Expression (reordered)",
          phrase: '"Please Send Erin Icecream Each Payday"',
          breakdown: "P=Procedural, S=Semantic, E=Episodic, I=Implicit, E=Explicit, P=Prospective",
          explanation: "Reordered for a more memorable sentence."
        }
      ]
    },
    {
      id: 4,
      title: "Retrieval, Recall, Recognition",
      terms: "How we access stored memories",
      animation: <LibraryAnimation />,
      mnemonics: [
        {
          type: "Image",
          phrase: '"The Library Analogy"',
          breakdown: "📚 Retrieval = Going to library | 🔍 Recall = Finding book yourself | ✓ Recognition = Seeing it on list",
          explanation: "RETRIEVAL is the umbrella term. RECALL = generate from scratch (essay). RECOGNITION = identify from options (multiple choice)."
        }
      ]
    },
    {
      id: 5,
      title: "Retrieval Strategies",
      terms: "Chunking, Mnemonics, Method of loci, Hierarchies, Distributive practice, Spacing effect",
      animation: null,
      mnemonics: [
        {
          type: "Expression",
          phrase: '"Clever Minds Make Huge Daily Steps"',
          breakdown: "C=Chunking, M=Mnemonics, M=Method of loci, H=Hierarchies, D=Distributive, S=Spacing",
          explanation: "In order! Chunking (grouping), Mnemonics (memory aids), Method of loci (memory palace), Hierarchies (organizing), Distributive (spread study), Spacing (gaps between)."
        }
      ]
    },
    {
      id: 6,
      title: "Serial Position Effect",
      terms: "Primacy, Recency, and why we forget the middle",
      animation: <SandwichAnimation />,
      mnemonics: [
        {
          type: "Image",
          phrase: '"The Sandwich Effect" 🥪',
          breakdown: "First bite (Primacy) + Last bite (Recency) = Remembered | Middle = Forgotten",
          explanation: "We remember beginnings and endings best. Serial position = position matters. Primacy = first items. Recency = last items."
        },
        {
          type: "Expression",
          phrase: '"Students Practice Reading Softly, Creating Tests"',
          breakdown: "S=Serial position, P=Primacy, R=Recency, S=State-dependent, C=Context-dependent, T=Testing",
          explanation: "All retrieval types in order, including state-dependent (mood) and context-dependent (environment)."
        }
      ]
    },
    {
      id: 7,
      title: "Proactive & Retroactive Interference",
      terms: "When memories block each other",
      animation: (
        <div className="space-y-2">
          <div className="text-center text-xs text-gray-500 mb-2">Proactive: OLD blocks NEW</div>
          <InterferenceAnimation type="proactive" />
          <div className="text-center text-xs text-gray-500 mb-2 mt-4">Retroactive: NEW blocks OLD</div>
          <InterferenceAnimation type="retroactive" />
        </div>
      ),
      mnemonics: [
        {
          type: "Connection",
          phrase: '"Pro = Forward, Retro = Backward"',
          breakdown: "PROactive: OLD → blocks → NEW | RETROactive: NEW → blocks → OLD",
          explanation: "PRO = forward (old reaches forward). RETRO = backward (new reaches back). Example: old phone # blocks new (proactive)."
        },
        {
          type: "Rhyme",
          phrase: '"Pro goes forward, old blocks new; Retro goes back, new blocks through"',
          breakdown: "A rhyme for the direction of interference",
          explanation: "Proactive = old password blocks new. Retroactive = new password makes you forget old."
        }
      ]
    },
    {
      id: 8,
      title: "Memory-Affecting Illnesses",
      terms: "Amnesia and Alzheimer's",
      animation: null,
      mnemonics: [
        {
          type: "Connection",
          phrase: '"Double A = Absent memories"',
          breakdown: "Amnesia + Alzheimer's = Both start with A = Absence",
          explanation: "Amnesia = memory loss (often injury). Alzheimer's = progressive disease. Both involve 'absent' memories."
        }
      ]
    },
    {
      id: 9,
      title: "Types of Amnesia",
      terms: "Infantile, Retrograde, Anterograde, Source",
      animation: (
        <div className="space-y-4">
          <div>
            <div className="text-xs text-center text-gray-500 mb-1">Retrograde (can't recall past)</div>
            <AmnesiaAnimation type="retrograde" />
          </div>
          <div>
            <div className="text-xs text-center text-gray-500 mb-1">Anterograde (can't form new)</div>
            <AmnesiaAnimation type="anterograde" />
          </div>
        </div>
      ),
      mnemonics: [
        {
          type: "Expression",
          phrase: '"I Really Am Sorry"',
          breakdown: "I=Infantile, R=Retrograde, A=Anterograde, S=Source",
          explanation: "In order! Infantile = no early childhood memories. Retrograde = lost PAST. Anterograde = can't form NEW. Source = forgot WHERE learned."
        },
        {
          type: "Connection",
          phrase: '"Retro = Past, Ante = Future"',
          breakdown: "RETRO (vintage/old) | ANTE (ante up = before the game starts)",
          explanation: "Retrograde = before injury memories gone. Anterograde = after injury can't make memories."
        }
      ]
    },
    {
      id: 10,
      title: "Unit 1 Concepts",
      terms: "Scientific Attitude, 7 Perspectives, Biopsychosocial",
      subtitle: "(3 required from Unit 1)",
      animation: null,
      mnemonics: [
        {
          type: "Expression",
          phrase: '"Curious Scientists Humbly ask"',
          breakdown: "C=Curiosity, S=Skepticism, H=Humility",
          explanation: "SCIENTIFIC ATTITUDE: Be curious (explore), skeptical (demand evidence), humble (accept being wrong)."
        },
        {
          type: "Expression",
          phrase: '"Every Boy Prefers Bacon, Hamburgers, Chicken, Sausage"',
          breakdown: "E=Evolutionary, B=Biological, P=Psychodynamic, B=Behavioral, H=Humanistic, C=Cognitive, S=Social-cultural",
          explanation: "The 7 PSYCHOLOGICAL PERSPECTIVES for analyzing behavior."
        },
        {
          type: "Name",
          phrase: '"BPS" = Bio-Psycho-Social',
          breakdown: "B=Biological + P=Psychological + S=Social-cultural",
          explanation: "BIOPSYCHOSOCIAL APPROACH: integrates all three levels of analysis."
        }
      ]
    },
    {
      id: 11,
      title: "Unit 0 Concepts",
      terms: "5 Research Methods (required) + 2 more",
      subtitle: "(3 required, must include research methods)",
      animation: null,
      mnemonics: [
        {
          type: "Expression",
          phrase: '"Every Curious Student Naturally Cares"',
          breakdown: "E=Experimental, C=Correlational, S=Survey, N=Naturalistic observation, C=Case study",
          explanation: "The 5 RESEARCH METHODS for College Board. Experimental (manipulate), Correlational (relationships), Survey (questionnaires), Naturalistic (observe), Case study (in-depth)."
        },
        {
          type: "Connection",
          phrase: '"HOP over biases"',
          breakdown: "H=Hindsight, O=Overconfidence, P=Perceiving patterns",
          explanation: "3 COGNITIVE BIASES: Hindsight ('I knew it'), Overconfidence (think we know more), Perceiving patterns (see order in chaos)."
        },
        {
          type: "Expression",
          phrase: '"I Don\'t Care"',
          breakdown: "I=Independent variable, D=Dependent variable, C=Confounding variable",
          explanation: "VARIABLES: Independent (change), Dependent (measure), Confounding (control for)."
        }
      ]
    }
  ];

  const typeColors = {
    "Expression": "bg-violet-100 text-violet-700",
    "Expression (reordered)": "bg-purple-100 text-purple-700",
    "Connection": "bg-blue-100 text-blue-700",
    "Image": "bg-emerald-100 text-emerald-700",
    "Rhyme": "bg-amber-100 text-amber-700",
    "Name": "bg-rose-100 text-rose-700",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <style>{`
        @keyframes ripple-ring {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
      `}</style>
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Memory Mnemonics</h1>
            <p className="text-xs text-slate-500">AP Psychology</p>
          </div>
          <a href="/" className="text-sm text-slate-400 hover:text-slate-600">← Back</a>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        
        {/* Intro */}
        <div className="text-center mb-8">
          <p className="text-slate-600">Click any item to expand</p>
          <p className="text-xs text-slate-400 mt-1">11 items • Matches rubric requirements</p>
        </div>

        {/* Items */}
        <div className="space-y-3">
          {rubricItems.map((item) => (
            <div 
              key={item.id}
              className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                expandedItem === item.id 
                  ? 'border-slate-300 shadow-lg' 
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {/* Header */}
              <button
                type="button"
                onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                className="w-full px-5 py-4 flex items-center gap-4 text-left focus:outline-none"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${
                  expandedItem === item.id 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.id}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-slate-900">{item.title}</h2>
                  <p className="text-sm text-slate-500 truncate">{item.terms}</p>
                </div>
                <svg 
                  className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                    expandedItem === item.id ? 'rotate-180' : ''
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expanded */}
              {expandedItem === item.id && (
                <div className="px-5 pb-5 space-y-4 animate-fadeIn">
                  
                  {/* Animation */}
                  {item.animation && (
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      {item.animation}
                    </div>
                  )}
                  
                  {/* Mnemonics */}
                  {item.mnemonics.map((m, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-3 ${typeColors[m.type]}`}>
                        {m.type}
                      </span>
                      <div className="text-xl font-bold text-slate-900 mb-2">{m.phrase}</div>
                      <div className="text-sm text-slate-600 font-mono bg-white/80 px-3 py-2 rounded-lg mb-3">
                        {m.breakdown}
                      </div>
                      <p className="text-sm text-slate-600">{m.explanation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer reference */}
        <div className="mt-10 text-center text-xs text-slate-400">
          <p>9 mnemonic types: Music, Name, Expression, Model, Rhyme, Note Organization, Image, Connection, Spelling</p>
          <p className="mt-2">"Mnemonics increased test scores up to 77%" — Miller, 1967</p>
        </div>
      </main>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default MnemonicsPage;
