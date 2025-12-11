import React, { useState } from 'react';

const MnemonicsPage = () => {
  const [expandedItem, setExpandedItem] = useState(null);

  // The 11 required items from the rubric
  const rubricItems = [
    {
      id: 1,
      title: "Three Memory Systems",
      terms: "Sensory memory, Short-term memory, Long-term memory",
      mnemonics: [
        {
          type: "Expression",
          phrase: '"Some Students Learn"',
          breakdown: "S = Sensory → S = Short-term → L = Long-term",
          explanation: "Follows the order: information enters through Sensory, moves to Short-term, then to Long-term storage."
        },
        {
          type: "Connection",
          phrase: '"SSL Connection"',
          breakdown: "Like a secure internet connection, data passes through layers",
          explanation: "SSL encrypts data in layers — similarly, memories pass through sensory → short-term → long-term layers before being securely stored."
        }
      ]
    },
    {
      id: 2,
      title: "Iconic and Echoic Memory",
      terms: "Iconic memory, Echoic memory",
      mnemonics: [
        {
          type: "Connection",
          phrase: '"I see Icons, I hear Echoes"',
          breakdown: "Iconic = I (eyes) = visual | Echoic = E (ears) = auditory",
          explanation: "Icons are visual symbols you SEE on screens. Echoes are sounds you HEAR bouncing back. Both are brief sensory memories lasting less than a few seconds."
        }
      ]
    },
    {
      id: 3,
      title: "Six Types of Memory",
      terms: "Implicit, Explicit, Semantic, Procedural, Episodic, Prospective",
      mnemonics: [
        {
          type: "Expression",
          phrase: '"I Eat Spinach, Peas, Even Peppers"',
          breakdown: "I=Implicit, E=Explicit, S=Semantic, P=Procedural, E=Episodic, P=Prospective",
          explanation: "In original order! Implicit (unconscious skills), Explicit (conscious recall), Semantic (facts), Procedural (how-to), Episodic (personal events), Prospective (future plans)."
        },
        {
          type: "Expression (reordered)",
          phrase: '"SEEP Into Proper Memory"',
          breakdown: "S=Semantic, E=Episodic, E=Explicit, P=Procedural + I=Implicit, P=Prospective",
          explanation: "Reordered to form a memorable phrase about memories 'seeping' into your brain properly."
        }
      ]
    },
    {
      id: 4,
      title: "Retrieval, Recall, and Recognition",
      terms: "Retrieval, Recall, Recognition — differences and relationships",
      mnemonics: [
        {
          type: "Image",
          phrase: '"The Library Analogy"',
          breakdown: "📚 Retrieval = Going to the library | 🔍 Recall = Finding book yourself | ✓ Recognition = Seeing it on a list",
          explanation: "RETRIEVAL is the umbrella term (accessing memory). RECALL means generating info from scratch (like essay questions — you retrieve with no cues). RECOGNITION means identifying previously learned info (like multiple choice — you see options and recognize the right one)."
        }
      ]
    },
    {
      id: 5,
      title: "Retrieval Strategies",
      terms: "Chunking, Mnemonic devices, Method of loci, Hierarchies, Distributive practice, Spacing effect",
      mnemonics: [
        {
          type: "Expression",
          phrase: '"Clever Minds Make Huge Daily Steps"',
          breakdown: "C=Chunking, M=Mnemonics, M=Method of loci, H=Hierarchies, D=Distributive practice, S=Spacing effect",
          explanation: "In order! These are strategies to improve retrieval: Chunking (grouping), Mnemonics (memory aids), Method of loci (memory palace), Hierarchies (organizing), Distributive practice (spread out study), Spacing effect (gaps between learning)."
        },
        {
          type: "Expression (reordered)",
          phrase: '"Smart Students Memorize Daily, Creating Habits"',
          breakdown: "S=Spacing, S=Spread (distributive), M=Method of loci, D=Devices (mnemonic), C=Chunking, H=Hierarchies",
          explanation: "Reordered mnemonic emphasizing that smart studying involves these strategies."
        }
      ]
    },
    {
      id: 6,
      title: "Retrieval Types and Tendencies",
      terms: "Serial position effect, Primacy effect, Recency effect, State-dependent memory, Context-dependent memory, Testing effect",
      mnemonics: [
        {
          type: "Expression",
          phrase: '"Students Practice Reading Softly, Creating Tests"',
          breakdown: "S=Serial position, P=Primacy, R=Recency, S=State-dependent, C=Context-dependent, T=Testing effect",
          explanation: "In order! Serial position = position in list matters. Primacy = remember first items. Recency = remember last items. State-dependent = mood affects recall. Context-dependent = environment affects recall. Testing = practice tests help."
        },
        {
          type: "Image",
          phrase: '"The Sandwich Effect" 🥪',
          breakdown: "First bite = Primacy | Middle = Forgotten | Last bite = Recency",
          explanation: "We remember the first (primacy) and last (recency) parts of a list best — like remembering the first and last bites of a sandwich but not the middle!"
        }
      ]
    },
    {
      id: 7,
      title: "Proactive and Retroactive Interference",
      terms: "Proactive interference, Retroactive interference",
      mnemonics: [
        {
          type: "Connection",
          phrase: '"Pro = Forward, Retro = Backward"',
          breakdown: "PROactive: OLD info blocks NEW | RETROactive: NEW info blocks OLD",
          explanation: "PRO means moving forward — so old memories move forward to block new learning. RETRO means backward — so new memories reach backward to block old memories."
        },
        {
          type: "Rhyme",
          phrase: '"Pro goes forward, old blocks new; Retro goes back, new blocks through"',
          breakdown: "A rhyme to remember the direction of interference",
          explanation: "Example: Proactive = old phone number makes it hard to learn new one. Retroactive = new password makes you forget old one."
        }
      ]
    },
    {
      id: 8,
      title: "Memory-Affecting Illnesses",
      terms: "Amnesia, Alzheimer's",
      mnemonics: [
        {
          type: "Connection",
          phrase: '"Double A = Absent memories"',
          breakdown: "Amnesia and Alzheimer's both start with A = Absence of memory",
          explanation: "Amnesia is memory loss (often from brain injury). Alzheimer's is a progressive neurodegenerative disease causing memory decline. Both involve 'absent' memories — the double-A connection helps remember they're both memory disorders."
        }
      ]
    },
    {
      id: 9,
      title: "Types of Amnesia",
      terms: "Infantile amnesia, Retrograde amnesia, Anterograde amnesia, Source amnesia",
      mnemonics: [
        {
          type: "Expression",
          phrase: '"I Really Am Sorry"',
          breakdown: "I=Infantile, R=Retrograde, A=Anterograde, S=Source",
          explanation: "In order! Infantile = can't remember early childhood. Retrograde = can't remember PAST (before injury). Anterograde = can't form NEW memories (after injury). Source = forget WHERE you learned something."
        },
        {
          type: "Connection",
          phrase: '"Retro = Past, Ante = Future"',
          breakdown: "RETRO (vintage) = past memories lost | ANTE (ante up before game) = future memories can't form",
          explanation: "Think: Retrograde affects memories from BEFORE trauma. Anterograde affects ability to form memories AFTER trauma."
        }
      ]
    },
    {
      id: 10,
      title: "Unit 1 Concepts (3 required)",
      terms: "Select 3 from Unit 1: Scientific Attitude, Psychological Perspectives, Biopsychosocial Approach",
      mnemonics: [
        {
          type: "Expression",
          phrase: '"Curious Scientists Humbly" ask questions',
          breakdown: "C=Curiosity, S=Skepticism, H=Humility",
          explanation: "The three components of the SCIENTIFIC ATTITUDE. Scientists are curious (explore), skeptical (demand evidence), and humble (accept being wrong)."
        },
        {
          type: "Expression",
          phrase: '"Every Boy Prefers Bacon, Hamburgers, Chicken, and Sausage"',
          breakdown: "E=Evolutionary, B=Biological, P=Psychodynamic, B=Behavioral, H=Humanistic, C=Cognitive, S=Social-cultural",
          explanation: "The 7 PSYCHOLOGICAL PERSPECTIVES for analyzing behavior and mental processes."
        },
        {
          type: "Name",
          phrase: '"BPS" = Bio-Psycho-Social',
          breakdown: "B=Biological, P=Psychological, S=Social-cultural",
          explanation: "The BIOPSYCHOSOCIAL APPROACH integrates three levels: Biological (genes, brain), Psychological (thoughts, emotions), Social-cultural (environment, culture)."
        }
      ]
    },
    {
      id: 11,
      title: "Unit 0 Concepts (3 required, including 5 Research Methods)",
      terms: "Five Research Methods (required): Experimental, Correlational, Survey, Naturalistic observation, Case study + 2 more",
      mnemonics: [
        {
          type: "Expression",
          phrase: '"Every Curious Student Naturally Cares"',
          breakdown: "E=Experimental, C=Correlational, S=Survey, N=Naturalistic observation, C=Case study",
          explanation: "The 5 RESEARCH METHODS recognized by College Board. Experimental = manipulate variables. Correlational = measure relationships. Survey = questionnaires. Naturalistic = observe in natural setting. Case study = in-depth individual analysis."
        },
        {
          type: "Connection",
          phrase: '"HOP on biases"',
          breakdown: "H=Hindsight bias, O=Overconfidence, P=Perceiving patterns in random events",
          explanation: "Three COGNITIVE BIASES that show why we need science instead of intuition. Hindsight = 'I knew it all along.' Overconfidence = thinking we know more than we do. Perceiving patterns = seeing order in randomness."
        },
        {
          type: "Expression",
          phrase: '"IDC about variables"',
          breakdown: "I=Independent variable, D=Dependent variable, C=Confounding variable",
          explanation: "The three types of VARIABLES in experiments. Independent = what you change. Dependent = what you measure. Confounding = what you control for."
        }
      ]
    }
  ];

  const typeColors = {
    "Expression": "bg-violet-100 text-violet-700 border-violet-200",
    "Expression (reordered)": "bg-purple-100 text-purple-700 border-purple-200",
    "Connection": "bg-blue-100 text-blue-700 border-blue-200",
    "Image": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Rhyme": "bg-amber-100 text-amber-700 border-amber-200",
    "Name": "bg-rose-100 text-rose-700 border-rose-200",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Memory Mnemonics</h1>
              <p className="text-sm text-gray-500">AP Psychology • Unit: Memory</p>
            </div>
            <a 
              href="/"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              ← Back
            </a>
          </div>
        </div>
      </header>

      {/* Progress indicator */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">11 Required Items</span>
            <span className="text-gray-400">Click any item to expand</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        
        {/* Quick Nav */}
        <div className="mb-8 p-4 bg-white rounded-xl border border-gray-200">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Jump to section</div>
          <div className="flex flex-wrap gap-2">
            {rubricItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setExpandedItem(expandedItem === item.id ? null : item.id);
                  document.getElementById(`item-${item.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                {item.id}. {item.title.split(' ').slice(0, 2).join(' ')}...
              </button>
            ))}
          </div>
        </div>

        {/* Rubric Items */}
        <div className="space-y-4">
          {rubricItems.map((item) => (
            <div 
              key={item.id} 
              id={`item-${item.id}`}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden scroll-mt-32"
            >
              {/* Item Header - Always visible */}
              <button
                onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                    {item.id}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{item.title}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{item.terms}</p>
                  </div>
                </div>
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform ${expandedItem === item.id ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expanded Content */}
              {expandedItem === item.id && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="pt-4 space-y-4">
                    {item.mnemonics.map((mnemonic, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-md border ${typeColors[mnemonic.type] || 'bg-gray-100 text-gray-700'}`}>
                            {mnemonic.type}
                          </span>
                        </div>
                        
                        <div className="text-xl font-bold text-gray-900 mb-2">
                          {mnemonic.phrase}
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-3 font-mono bg-white px-3 py-2 rounded-lg border border-gray-200">
                          {mnemonic.breakdown}
                        </div>
                        
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {mnemonic.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mnemonic Types Reference */}
        <div className="mt-12 p-6 bg-white rounded-xl border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">9 Types of Mnemonics (Reference)</h3>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-800">🎵 Music</div>
              <div className="text-gray-500 text-xs">Set info to a tune</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-800">📛 Name</div>
              <div className="text-gray-500 text-xs">First letters form a name</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-800">💬 Expression</div>
              <div className="text-gray-500 text-xs">First letters form phrase</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-800">📊 Model</div>
              <div className="text-gray-500 text-xs">Visual diagram/chart</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-800">🎵 Ode/Rhyme</div>
              <div className="text-gray-500 text-xs">Poem or rhyming phrase</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-800">📝 Note Organization</div>
              <div className="text-gray-500 text-xs">Outlines, notecards</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-800">🖼️ Image</div>
              <div className="text-gray-500 text-xs">Visual picture/analogy</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-800">🔗 Connection</div>
              <div className="text-gray-500 text-xs">Link to known info</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-800">🔤 Spelling</div>
              <div className="text-gray-500 text-xs">Helps spell words</div>
            </div>
          </div>
        </div>

        {/* Citation */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>"Mnemonics increased test scores up to 77%" — Gerald R. Miller, 1967</p>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-gray-200 mt-12 py-6">
        <div className="max-w-4xl mx-auto px-6 text-center text-sm text-gray-500">
          AP Psychology Memory Unit • Mnemonic Study Guide
        </div>
      </footer>
    </div>
  );
};

export default MnemonicsPage;
