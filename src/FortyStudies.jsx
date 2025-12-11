import React, { useState, useEffect } from 'react';

const FortyStudiesPage = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const readings = [
    {
      id: 1,
      title: "One Brain or Two?",
      authors: "Gazzaniga & Sperry",
      questions: [
        "If the two hemispheres can function independently in split-brain patients, how much independence exists in people who have a fully connected corpus callosum?",
        "Could a split-brain patient develop a completely separate sense of self in each hemisphere if the separation existed from childhood?",
        "What does this study tell us about the idea of \"free will\" if one hemisphere can take actions that the other hemisphere cannot explain?"
      ],
      chosenIndex: 0,
      answer: [
        "The split-brain research shows that the two hemispheres are capable of acting on their own when the communication bridge between them is cut. What surprised me most was how fully developed each hemisphere's abilities are. One side can name an object while the other side can draw something completely different. That kind of separation makes it easy to think of the hemispheres as two minds in one head.",
        "But in people with an intact brain, the hemispheres are constantly sharing information. The connection is so quick and automatic that it creates the illusion of a single unified mind. The independence still exists at the level of specialization. For example, the left hemisphere tends to organize language while the right recognizes faces or emotional tone. The difference is that both hemispheres automatically update each other, so the person never notices the split.",
        "The split-brain research is what makes this clear. When the hemispheres cannot communicate, their natural differences are exposed. When they can communicate, the differences are blended into something that feels seamless. So the independence is there, but healthy brains smooth over the edges so well that we rarely notice we have two systems working together."
      ]
    },
    {
      id: 3,
      title: "Are You a 'Natural'?",
      authors: "Bouchard — Minnesota Twin Study",
      questions: [
        "If identical twins who were raised apart turn out so similar, what does that say about the choices people think they make freely?",
        "How much room is left for personal change if personality seems to stay stable even when the environment changes?",
        "Are there traits that only look genetic because people in different environments end up being pushed in similar directions?"
      ],
      chosenIndex: 1,
      answer: [
        "This study showed that identical twins raised in completely different homes can still grow up to have strikingly similar personalities. That makes it tempting to think personality is fixed and cannot change. But the research does not say that. What it really shows is that people start life with a strong foundation of natural tendencies. Some people are naturally more outgoing. Some are naturally anxious or calm. Some take more risks without thinking about the consequences.",
        "What the study does not remove is the idea that people can change how these tendencies are expressed. Someone who is naturally anxious can still learn coping strategies. Someone who is naturally introverted can still develop social skills. The core traits might stay steady, but how someone uses them or manages them can shift a lot. The twins in the study show that the starting point is similar, not that the pathway through life is predetermined.",
        "If anything, the study suggests that self-change is less about becoming a different kind of person and more about learning how to work with the kind of person you already are. That feels realistic and honestly more comforting. There is a clear natural base, but there is still a lot you can do with it."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-neutral-200/50 z-50">
        <div 
          className="h-full bg-gradient-to-r from-neutral-300 via-neutral-400 to-neutral-300 transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Minimal header */}
      <header className="fixed top-0 left-0 right-0 z-40">
        <div className="max-w-4xl mx-auto px-8 pt-8 flex items-start justify-between">
          <a href="/" className="text-xs tracking-widest text-neutral-400 hover:text-neutral-600 transition-colors uppercase">
            ← Back
          </a>
        </div>
      </header>

      {/* Hero */}
      <div className="pt-32 pb-20 px-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs tracking-[0.3em] text-neutral-400 uppercase mb-6">AP Psychology</p>
          <h1 className="text-4xl md:text-5xl font-light text-neutral-800 tracking-tight mb-4">
            Forty Studies
          </h1>
          <p className="text-lg text-neutral-400 font-light">Readings 1 & 3</p>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-8 pb-32">
        
        {readings.map((reading, rIndex) => (
          <section 
            key={reading.id} 
            className="mb-32 animate-fadeIn"
            style={{ animationDelay: `${rIndex * 0.2}s` }}
          >
            
            {/* Reading header */}
            <div className="mb-16 pb-8 border-b border-neutral-200">
              <span className="text-xs tracking-[0.3em] text-neutral-400 uppercase">Reading {reading.id}</span>
              <h2 className="text-2xl md:text-3xl font-light text-neutral-800 mt-3 tracking-tight">
                {reading.title}
              </h2>
              <p className="text-sm text-neutral-400 mt-2 font-light">{reading.authors}</p>
            </div>

            {/* Three questions */}
            <div className="mb-16">
              <h3 className="text-xs tracking-[0.2em] text-neutral-400 uppercase mb-8">Three Questions</h3>
              <div className="space-y-4">
                {reading.questions.map((q, qIndex) => (
                  <div 
                    key={qIndex} 
                    className={`group flex gap-6 p-6 rounded-sm transition-all duration-500 cursor-default ${
                      qIndex === reading.chosenIndex 
                        ? 'bg-neutral-100' 
                        : 'hover:bg-neutral-50'
                    }`}
                  >
                    <span className={`text-sm font-light transition-colors ${
                      qIndex === reading.chosenIndex ? 'text-neutral-800' : 'text-neutral-300 group-hover:text-neutral-400'
                    }`}>
                      {String(qIndex + 1).padStart(2, '0')}
                    </span>
                    <p className={`text-base leading-relaxed font-light ${
                      qIndex === reading.chosenIndex ? 'text-neutral-800' : 'text-neutral-500'
                    }`}>
                      {q}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Answer section */}
            <div>
              <h3 className="text-xs tracking-[0.2em] text-neutral-400 uppercase mb-8">Response</h3>
              <div className="space-y-6 pl-6 border-l border-neutral-200">
                {reading.answer.map((para, pIndex) => (
                  <p 
                    key={pIndex} 
                    className="text-base md:text-lg text-neutral-700 leading-relaxed font-light"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Divider between readings */}
            {rIndex < readings.length - 1 && (
              <div className="mt-32 flex justify-center">
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
              </div>
            )}
          </section>
        ))}

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-100 py-12">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <p className="text-xs tracking-[0.2em] text-neutral-300 uppercase">
            Forty Studies That Changed Psychology
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          opacity: 0;
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FortyStudiesPage;
