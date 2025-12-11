import React from 'react';

const FortyStudiesPage = () => {
  const readings = [
    {
      id: 1,
      title: "One Brain or Two?",
      authors: "Gazzaniga & Sperry",
      questions: [
        "If split-brain patients have two hemispheres that can operate somewhat independently, how unified is consciousness for people with intact brains?",
        "Do split-brain findings tell us anything about how multitasking works, or is that a completely different mechanism?",
        "Could long-term neural plasticity allow split-brain patients to \"reconnect\" functions over time, or are the hemispheres truly separate forever?"
      ],
      chosenIndex: 0,
      answer: [
        "The Gazzaniga and Sperry work suggests that consciousness might not be as unified as it feels. In split-brain patients, each hemisphere processes information on its own and can even hold different preferences or perceptions. The Myers textbook describes consciousness as having \"dual processing,\" meaning the brain constantly works on both conscious and unconscious tracks at the same time (Myers, 8e).",
        "For people with intact brains, the corpus callosum keeps this dual system coordinated. Information passes between hemispheres so quickly that we experience a single, seamless awareness. But functionally, the brain still divides tasks. For example, language is mostly left-lateralized and spatial reasoning is more right-lateralized. Even in typical brains, each hemisphere specializes and processes independently before integrating its work with the other side.",
        "Neuroscience research also suggests that consciousness is built from distributed networks rather than one single area. The Global Workspace Theory proposes that different brain modules compete for attention, and the \"winner\" becomes conscious thought. This lines up with the idea that consciousness is already fragmented, but normally we just don't notice because communication between regions is fast and automatic.",
        "So the answer is that consciousness is unified in experience but not in structure. Split-brain patients make the separation obvious because the communication bridge is cut. In the rest of us, the bridge hides the fragmentation by stitching everything together."
      ],
      sources: [
        "Myers, D. G. \"Psychology,\" 8e. Modules on consciousness and brain structure.",
        "Gazzaniga, M. (2005). Forty Studies That Changed Psychology.",
        "Baars, B. (2005). Global Workspace Theory overview, Trends in Cognitive Sciences."
      ]
    },
    {
      id: 3,
      title: "Are You a 'Natural'?",
      authors: "Bouchard, Minnesota Twin Study",
      questions: [
        "If identical twins raised apart are extremely similar, what does that suggest about free will?",
        "How much can environment actually change intelligence or personality compared to genetic predispositions?",
        "Are there traits that seem genetic at first but actually depend heavily on culture in order to show up?"
      ],
      chosenIndex: 1,
      answer: [
        "The Minnesota Twin Study found that identical twins raised apart still show striking similarities in personality, intelligence, and even preferences. This suggests that genes play a major role in shaping who we are. However, the study does not mean environment is powerless.",
        "According to the Myers textbook, heritability refers to the proportion of variation in a group that can be attributed to genes. It does not mean that genes determine a set percentage of your traits as an individual. Heritability of intelligence is about 50 percent, meaning half the differences between people can be linked to genetics (Myers, Module 64).",
        "Environment can still have huge effects. Severe deprivation or trauma can reduce cognitive development. Rich environments with strong education can increase measurable intelligence. The Flynn Effect, which is the global rise in IQ scores over generations, proves that environmental change can shift intelligence across entire populations.",
        "Personality is more genetically stable than intelligence. Even then, environment matters in how traits get expressed. The field of epigenetics shows that environmental experiences can switch genes on or off. For example, chronic stress can activate genes linked to anxiety. Parenting, culture, and socioeconomic status shape how natural tendencies are reinforced or suppressed.",
        "So genetics sets the range, but environment influences where within that range someone actually ends up. The Minnesota study shows that genes are powerful, but they aren't destiny."
      ],
      sources: [
        "Myers, D. G. \"Psychology,\" 8e. Modules 62–64 on intelligence and genetics.",
        "Bouchard, T. J. (1990). \"Sources of Human Psychological Differences,\" Science.",
        "Flynn, J. R. (1987). \"Massive IQ Gains,\" Psychological Bulletin.",
        "National Institute of Mental Health. Overview of epigenetics and environmental influence."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-stone-900">Forty Studies</h1>
            <p className="text-xs text-stone-500">Readings 1 & 3</p>
          </div>
          <a href="/" className="text-sm text-stone-400 hover:text-stone-600">← Back</a>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        
        {readings.map((reading, rIndex) => (
          <section key={reading.id} className="mb-20">
            
            {/* Reading title */}
            <div className="mb-10">
              <span className="text-xs text-stone-400 uppercase tracking-widest">Reading {reading.id}</span>
              <h2 className="text-2xl font-serif text-stone-800 mt-1">"{reading.title}"</h2>
              <p className="text-stone-500 text-sm mt-1">{reading.authors}</p>
            </div>

            {/* Three questions */}
            <div className="mb-10">
              <h3 className="text-sm font-medium text-stone-700 mb-4">Three Questions</h3>
              <ol className="space-y-3">
                {reading.questions.map((q, qIndex) => (
                  <li 
                    key={qIndex} 
                    className={`flex gap-3 p-3 rounded-lg ${
                      qIndex === reading.chosenIndex 
                        ? 'bg-stone-200/70' 
                        : 'bg-stone-100/50'
                    }`}
                  >
                    <span className="text-stone-400 font-mono text-sm">{qIndex + 1}.</span>
                    <span className={qIndex === reading.chosenIndex ? 'text-stone-800' : 'text-stone-600'}>
                      {q}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Answer section */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-stone-700 mb-4">Response to Question {reading.chosenIndex + 1}</h3>
              <div className="space-y-4">
                {reading.answer.map((para, pIndex) => (
                  <p key={pIndex} className="text-stone-700 leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Sources */}
            <div className="pt-6 border-t border-stone-200">
              <h4 className="text-xs text-stone-400 uppercase tracking-wider mb-3">Sources</h4>
              <ul className="space-y-1">
                {reading.sources.map((source, sIndex) => (
                  <li key={sIndex} className="text-sm text-stone-500">{source}</li>
                ))}
              </ul>
            </div>

            {/* Divider between readings */}
            {rIndex < readings.length - 1 && (
              <div className="mt-16 flex justify-center">
                <div className="w-16 h-px bg-stone-200" />
              </div>
            )}
          </section>
        ))}

      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-8">
        <div className="max-w-3xl mx-auto px-6 text-center text-sm text-stone-400">
          AP Psychology • Forty Studies That Changed Psychology
        </div>
      </footer>
    </div>
  );
};

export default FortyStudiesPage;
