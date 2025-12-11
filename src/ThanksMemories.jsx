import React, { useState, useEffect, useRef } from 'react';

const ThanksForTheMemoriesPage = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const contentRef = useRef(null);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);

      // Determine active section based on scroll
      const sections = document.querySelectorAll('.essay-section');
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.5 && rect.bottom > 0) {
          setActiveSection(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const essayContent = [
    {
      id: 'intro',
      highlight: '"Smashed" vs "Hit"',
      content: `After reading Elizabeth Loftus's "Thanks for the Memories," it becomes pretty shocking that eyewitness testimony is still treated as something reliable. Loftus shows that memory is not a perfect recording of events. It is something our brains constantly reshape. In her study, simply changing one word in a question, like using "smashed" instead of "hit," caused people to remember the same car accident as more violent. Some even remembered broken glass that never existed. If something as small as a verb can distort memory, then it makes sense that real life situations filled with stress, fear, and confusion would create even more inaccurate recollections.`
    },
    {
      id: 'cameras-argument',
      highlight: 'The Case for Cameras',
      content: `Because of this, I think there is a strong argument in favor of adding more surveillance cameras in urban areas. Cameras are not influenced by leading questions, suggestion, or emotional reactions. They do not have schemas or expectations that fill in gaps the way human memory does. A camera records what actually happened in that moment. So when we compare a fallible eyewitness to a device that captures events objectively, it is pretty clear which one is more trustworthy.`
    },
    {
      id: 'legal-impact',
      highlight: 'Confidence ≠ Accuracy',
      content: `This matters in real legal cases. Many wrongful convictions have happened because witnesses were confident but still completely mistaken. One of the biggest ideas in Loftus's research is that confidence and accuracy do not necessarily match. People can genuinely believe their memory is correct even when it is not. If video evidence had existed in many of those mistaken-identity cases, innocent people might have avoided prison. Cameras offer a way to check memory against reality, which feels like a major improvement for fairness in the justice system.`
    },
    {
      id: 'privacy-concerns',
      highlight: 'The Privacy Dilemma',
      content: `However, adding more surveillance cameras is not a simple or risk-free solution. There are real privacy concerns when cameras appear in every public place. People may feel uncomfortable knowing they are constantly recorded. Communities that already have low trust in law enforcement might worry about how the footage will be used and who will control it. There is also the broader moral dilemma of how much monitoring is acceptable in a society that values personal freedom. Surveillance might prevent crime, but it can also make everyday life feel monitored in a way that many people will not support.`
    },
    {
      id: 'balanced-approach',
      highlight: 'Strategic Implementation',
      content: `Because of that, I think the most reasonable approach is to use cameras in a strategic and limited way. They should be placed in areas where crime is more likely to occur and where they can actually help investigators avoid relying only on eyewitnesses. There also need to be clear laws about who can access recordings, how long they are kept, and how they can be used. These rules can help prevent misuse while still taking advantage of the benefits.`
    },
    {
      id: 'conclusion',
      highlight: 'Memory vs Reality',
      content: `In the end, Loftus's study shows that eyewitness memory is too easily distorted to be treated as solid evidence on its own. Memory feels real to the person recalling it, but that does not make it accurate. Surveillance cameras, even with their limitations, offer a more dependable way to document events. When used carefully and ethically, they can help balance public safety with personal privacy. Based on what we know about how memory actually works, adding more cameras under the right conditions seems like a logical step.`
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-stone-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-stone-600 to-stone-800 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating back button */}
      <a
        href="/"
        className="fixed top-6 left-6 text-stone-400 hover:text-stone-600 transition-colors z-40 text-sm"
      >
        ← Back
      </a>

      {/* Side progress dots */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
        {essayContent.map((section, index) => (
          <div
            key={section.id}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${activeSection === index
              ? 'bg-stone-800 scale-125'
              : 'bg-stone-300'
              }`}
            title={section.highlight}
          />
        ))}
      </div>

      {/* Hero section */}
      <header className="min-h-[70vh] flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Animated memory fragments background */}
        <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-6xl font-serif"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
                animation: `float ${10 + Math.random() * 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            >
              ?
            </div>
          ))}
        </div>

        <div className="max-w-2xl text-center relative z-10">
          <p className="text-stone-400 text-sm tracking-widest uppercase mb-4">AP Psychology • Reading Response</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-800 mb-6 leading-tight">
            Thanks for the
            <span className="block italic text-stone-500">Memories</span>
          </h1>
          <p className="text-stone-500 text-lg mb-8">
            On eyewitness testimony, memory distortion, and the case for surveillance
          </p>
          <div className="flex items-center justify-center gap-3 text-sm text-stone-400">
            <span>Based on Loftus's study</span>
            <span className="w-1 h-1 bg-stone-300 rounded-full" />
            <span>Prompt 2</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone-400">
          <span className="text-xs tracking-wider">Scroll to read</span>
          <div className="w-5 h-8 border-2 border-stone-300 rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-stone-400 rounded-full animate-bounce" />
          </div>
        </div>
      </header>

      {/* Essay content */}
      <main ref={contentRef} className="max-w-2xl mx-auto px-6 pb-32">
        {essayContent.map((section, index) => (
          <section
            key={section.id}
            className="essay-section mb-12"
          >
            {/* Section highlight phrase */}
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-stone-200/50 text-stone-500 text-xs tracking-wider uppercase rounded-full">
                {section.highlight}
              </span>
            </div>

            {/* Paragraph */}
            <p className="text-lg md:text-xl text-stone-700 leading-relaxed font-serif">
              {section.content}
            </p>

            {/* Decorative elements between sections */}
            {index < essayContent.length - 1 && (
              <div className="mt-10 mb-6 flex items-center justify-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-px bg-stone-200" />
                  <span className="text-xs text-stone-400 italic">•</span>
                  <div className="w-12 h-px bg-stone-200" />
                </div>
              </div>
            )}
          </section>
        ))}

        {/* Footer */}
        <footer className="pt-16 border-t border-stone-200 text-center">
          <p className="text-stone-400 text-sm">
            Response to "Thanks for the Memories" from<br />
            <span className="italic">Forty Studies That Changed Psychology</span>
          </p>
        </footer>
      </main>

      {/* Floating quote accent */}
      <div className="fixed bottom-6 right-6 text-8xl font-serif text-stone-200 pointer-events-none select-none hidden lg:block">
        "
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(5deg); opacity: 0.6; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        
        @keyframes glitch {
          0%, 90%, 100% { opacity: 0.4; transform: translate(0, 0); }
          92% { opacity: 0.6; transform: translate(-2px, 1px); }
          94% { opacity: 0.2; transform: translate(2px, -1px); }
          96% { opacity: 0.7; transform: translate(-1px, -1px); }
          98% { opacity: 0.3; transform: translate(1px, 1px); }
        }
        
        @keyframes cameraFlash {
          0%, 90%, 100% { opacity: 0.5; }
          95% { opacity: 1; }
        }
        
        @keyframes swing {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        
        .memory-fragment {
          animation: glitch 3s ease-in-out infinite;
        }
        
        .camera-flash {
          animation: cameraFlash 2s ease-in-out infinite;
        }
        
        .balance-scale {
          animation: swing 2s ease-in-out infinite;
        }
        
        .essay-section {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .essay-section:nth-child(1) { animation-delay: 0.1s; }
        .essay-section:nth-child(2) { animation-delay: 0.15s; }
        .essay-section:nth-child(3) { animation-delay: 0.2s; }
        .essay-section:nth-child(4) { animation-delay: 0.25s; }
        .essay-section:nth-child(5) { animation-delay: 0.3s; }
        .essay-section:nth-child(6) { animation-delay: 0.35s; }
      `}</style>
    </div>
  );
};

export default ThanksForTheMemoriesPage;
