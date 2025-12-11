import React, { useState, useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Analytics } from '@vercel/analytics/react';

const questions = [
  {id:1,category:"Analytical Reasoning",difficulty:"Easy",question:"All managers at a company must complete leadership training. Sarah is a manager at the company. Which conclusion is valid?",options:["Sarah has not completed leadership training","Sarah must complete leadership training","Sarah is the only manager at the company","Leadership training is optional for managers"],correct:1,weights:{analytical:100},correctIndicates:"Strong deductive reasoning ability. Candidate can follow logical rules and draw valid conclusions from given premises.",incorrectIndicates:"May struggle with formal logic or fail to recognize when conclusions necessarily follow from stated conditions."},
  {id:2,category:"Analytical Reasoning",difficulty:"Easy",question:"In a certain code, FISH is written as EHRG. How would BIRD be written in the same code?",options:["AHQC","CJSE","AKPC","AQHC"],correct:0,weights:{analytical:70,pattern:30},correctIndicates:"Can identify transformation rules and apply them consistently. Shows systematic thinking.",incorrectIndicates:"May have difficulty recognizing patterns in sequential transformations or applying rules consistently."},
  {id:3,category:"Analytical Reasoning",difficulty:"Medium",question:"A company has three departments: Sales, Engineering, and Marketing. The following is known: (1) The Sales department has more employees than Marketing. (2) Engineering has fewer employees than Marketing. (3) The total number of employees across all departments is 90. If Sales has twice as many employees as Engineering, and Marketing has 30 employees, how many employees does Sales have?",options:["36","40","45","48"],correct:1,weights:{analytical:100},correctIndicates:"Excellent multi-step reasoning. Can manage multiple constraints simultaneously and solve complex word problems.",incorrectIndicates:"May struggle with problems requiring integration of multiple pieces of information or algebraic reasoning."},
  {id:4,category:"Analytical Reasoning",difficulty:"Medium",question:"Five people (A, B, C, D, E) are sitting in a row. A is not at either end. B is somewhere to the left of C. D is at the right end. E is next to A. Which of the following must be true?",options:["B is at the left end","E is at the left end","C is next to D","B is next to E"],correct:0,weights:{analytical:100},correctIndicates:"Strong spatial-logical reasoning. Can systematically work through constraints to determine necessary conclusions.",incorrectIndicates:"May have difficulty with spatial arrangement problems or distinguishing between possible and necessary conclusions."},
  {id:5,category:"Analytical Reasoning",difficulty:"Medium",question:"If no politicians can be trusted, and some lawyers are politicians, which statement must be true?",options:["No lawyers can be trusted","Some lawyers cannot be trusted","All lawyers are politicians","Some politicians are not lawyers"],correct:1,weights:{analytical:100},correctIndicates:"Understands categorical logic and can correctly interpret quantified statements (all, some, none).",incorrectIndicates:"May over-generalize from premises or confuse 'some' with 'all' in logical reasoning."},
  {id:6,category:"Analytical Reasoning",difficulty:"Hard",question:"A researcher is testing four hypotheses (W, X, Y, Z) about a phenomenon. She discovers: If W is true, then X must be false. If Y is true, then W must be true. Z is true only if both X and Y are true. If the researcher confirms that Y is true, what can she conclude about Z?",options:["Z must be true","Z must be false","Z could be either true or false","There is not enough information to determine Z"],correct:1,weights:{analytical:100},correctIndicates:"Exceptional logical reasoning. Can trace chains of implications across multiple conditional statements.",incorrectIndicates:"May struggle with complex conditional reasoning or fail to track cascading logical consequences."},
  {id:7,category:"Analytical Reasoning",difficulty:"Hard",question:"A pharmaceutical company is testing a new drug. In their study: 80% of patients who received the drug showed improvement. 30% of patients who received a placebo also showed improvement. 500 patients received the drug, and 500 received the placebo. Approximately how many more patients improved with the drug compared to the placebo?",options:["200","250","350","400"],correct:1,weights:{analytical:85,processing:15},correctIndicates:"Can translate word problems into calculations and compare quantities accurately. Strong quantitative reasoning.",incorrectIndicates:"May misinterpret comparative questions or make calculation errors under complexity."},
  {id:8,category:"Analytical Reasoning",difficulty:"Hard",question:"Three friends—Kai, Leo, and Maya—each have a different favorite color (red, blue, green) and a different pet (cat, dog, bird). The following is known: (1) Kai's favorite color is not red. (2) The person who likes blue has a dog. (3) Maya does not have a bird. (4) Leo likes green. (5) Maya has a cat. What is Kai's favorite color?",options:["Red","Blue","Green","Cannot be determined"],correct:1,weights:{analytical:100},correctIndicates:"Excellent at systematic constraint satisfaction. Can organize complex information and eliminate possibilities methodically.",incorrectIndicates:"May struggle to organize multiple constraints or miss key deductions in logic puzzles."},
  {id:9,category:"Pattern Recognition",difficulty:"Easy",question:"What comes next in the sequence? 2, 6, 18, 54, ___",options:["108","162","148","180"],correct:1,weights:{pattern:100},correctIndicates:"Quickly identifies multiplicative patterns. Strong numerical pattern recognition.",incorrectIndicates:"May default to additive thinking or miss non-linear patterns in sequences."},
  {id:10,category:"Pattern Recognition",difficulty:"Easy",question:"What comes next in the sequence? A, C, F, J, ___",options:["N","O","M","P"],correct:1,weights:{pattern:100},correctIndicates:"Can identify patterns with increasing intervals. Flexible pattern recognition.",incorrectIndicates:"May assume constant intervals or struggle with accelerating/decelerating patterns."},
  {id:11,category:"Pattern Recognition",difficulty:"Medium",question:"In a sequence, each term is formed by taking the previous term, multiplying by 2, then subtracting 3. If the 4th term is 27, what is the 2nd term?",options:["9","12","15","18"],correct:0,weights:{pattern:80,analytical:20},correctIndicates:"Can reverse-engineer patterns and work backwards from known values. Strong algebraic reasoning.",incorrectIndicates:"May struggle with inverse operations or working backwards through multi-step transformations."},
  {id:12,category:"Pattern Recognition",difficulty:"Medium",question:"Look at the pattern: 1, 1, 2, 3, 5, 8, 13, 21, ___. What comes next?",options:["29","32","34","36"],correct:2,weights:{pattern:100},correctIndicates:"Recognizes the Fibonacci pattern (sum of previous two terms). Familiar with common mathematical sequences.",incorrectIndicates:"May not recognize additive-recursive patterns or may look for simpler rules."},
  {id:13,category:"Pattern Recognition",difficulty:"Medium",question:"The pattern shows: ○ □ △ ○ □ △ ○ □ △. If this pattern continues, what shape will be in the 25th position?",options:["Circle (○)","Square (□)","Triangle (��)","Cannot be determined"],correct:0,weights:{pattern:100},correctIndicates:"Understands modular/cyclic patterns and can calculate positions within repeating sequences.",incorrectIndicates:"May struggle with modular arithmetic or counting positions in cycles."},
  {id:14,category:"Pattern Recognition",difficulty:"Hard",question:"In a number grid, each cell contains a value based on its position. Row 1: 1, 2, 3, 4. Row 2: 2, 4, 6, 8. Row 3: 3, 6, 9, 12. What value would be in Row 5, Column 3?",options:["12","15","18","20"],correct:1,weights:{pattern:100},correctIndicates:"Can identify two-dimensional patterns and generalize rules from examples. Strong abstract pattern recognition.",incorrectIndicates:"May struggle to see relationships in multi-dimensional patterns or fail to generalize from examples."},
  {id:15,category:"Pattern Recognition",difficulty:"Hard",question:"Examine the sequence: 3, 4, 7, 11, 18, 29, ___. What comes next?",options:["40","43","47","52"],correct:2,weights:{pattern:100},correctIndicates:"Identifies complex recursive patterns similar to Lucas sequences. High-level pattern recognition.",incorrectIndicates:"May not recognize that each term is the sum of the two preceding terms in non-obvious sequences."},
  {id:16,category:"Pattern Recognition",difficulty:"Hard",question:"A code translates words by summing the position of each letter in the alphabet (A=1, B=2, ... Z=26). CAT → 24, DOG → 26, FISH → 42. What would HELP translate to?",options:["32","37","41","46"],correct:2,weights:{pattern:85,analytical:15},correctIndicates:"Can decode cipher patterns by analyzing examples. Strong inductive reasoning from examples.",incorrectIndicates:"May struggle to identify the underlying rule when only given input-output examples."},
  {id:17,category:"Working Memory",difficulty:"Easy",question:"According to the memo you read, who is the Director leading the merged Innovation Hub?",options:["Marcus Chen","Priya Sharma","The memo did not specify","The CEO"],correct:1,weights:{memory:100},correctIndicates:"Successfully retained key personnel information from the passage. Good factual recall.",incorrectIndicates:"May not have encoded or retained specific names from the reading passage."},
  {id:18,category:"Working Memory",difficulty:"Easy",question:"How many total employees are affected by the merger?",options:["115","127","142","156"],correct:1,weights:{memory:100},correctIndicates:"Retained specific numerical information from the passage. Strong numerical recall.",incorrectIndicates:"May struggle to retain specific numbers or may confuse similar figures."},
  {id:19,category:"Working Memory",difficulty:"Medium",question:"Which office has the fewest employees affected by the merger?",options:["Seattle","Austin","Boston","Denver"],correct:2,weights:{memory:100},correctIndicates:"Can compare and rank memorized information. Strong comparative recall.",incorrectIndicates:"May have difficulty retaining multiple data points for comparison or confuse relative rankings."},
  {id:20,category:"Working Memory",difficulty:"Medium",question:"What is the total duration of the transition timeline?",options:["10 weeks","12 weeks","90 days","60 days"],correct:2,weights:{memory:100},correctIndicates:"Retained timeline information accurately. Good temporal recall.",incorrectIndicates:"May confuse duration details or have difficulty retaining time-related information."},
  {id:21,category:"Working Memory",difficulty:"Medium",question:"By what percentage did the budget increase compared to the combined previous budgets?",options:["10%","12%","15%","20%"],correct:2,weights:{memory:100},correctIndicates:"Retained percentage information accurately. Strong quantitative recall.",incorrectIndicates:"May struggle with retaining percentage or ratio information."},
  {id:22,category:"Working Memory",difficulty:"Hard",question:"If Phase 1 begins on September 1st, when would Phase 3 be completed?",options:["November 1st","November 15th","November 29th","December 1st"],correct:2,weights:{memory:60,analytical:40},correctIndicates:"Can combine recalled information with calculation. Excellent applied memory.",incorrectIndicates:"May struggle to use memorized information in calculations or lose track of multi-step problems."},
  {id:23,category:"Working Memory",difficulty:"Hard",question:"What is the difference in employee count between the largest and smallest office locations?",options:["27","31","42","58"],correct:1,weights:{memory:80,analytical:20},correctIndicates:"Can perform calculations using recalled data. Strong working memory integration.",incorrectIndicates:"May struggle to hold multiple values in memory while performing operations."},
  {id:24,category:"Adaptive Thinking",difficulty:"Medium",question:"Using the rule provided (reverse the word, then replace vowels with the next vowel: A→E, E→I, I→O, O→U, U→A), what does CAT become?",options:["TEC","TAC","TIC","TEK"],correct:0,weights:{adaptive:100},ruleSet:1,correctIndicates:"Successfully learned and applied a new rule. Good initial rule acquisition.",incorrectIndicates:"May struggle to apply multi-step transformation rules or miss components of complex instructions."},
  {id:25,category:"Adaptive Thinking",difficulty:"Medium",question:"Using the same rule, what does HOME become?",options:["IMUH","EMOH","OMEH","UMIH"],correct:0,weights:{adaptive:100},ruleSet:1,correctIndicates:"Consistently applies learned rules across examples. Reliable rule following.",incorrectIndicates:"May apply rules inconsistently or forget steps when applying to new examples."},
  {id:26,category:"Adaptive Thinking",difficulty:"Hard",question:"NEW RULE: Reverse the word, then replace all CONSONANTS with the previous consonant in the alphabet (C→B, D→C, etc.). Vowels remain unchanged. What does MIND become?",options:["CMOL","CNOM","DNIM","CLOM"],correct:0,weights:{adaptive:100},ruleSet:2,correctIndicates:"Successfully adapted to a new rule, abandoning the previous one. Strong cognitive flexibility.",incorrectIndicates:"May experience interference from the previous rule or struggle to switch mental sets."},
  {id:27,category:"Adaptive Thinking",difficulty:"Hard",question:"Using the NEW rule (reverse, replace consonants with previous consonant, vowels unchanged), what does PLAY become?",options:["XZKP","YAKO","YAKP","XALP"],correct:2,weights:{adaptive:100},ruleSet:2,correctIndicates:"Maintains the new rule correctly across examples. Good rule maintenance after switching.",incorrectIndicates:"May revert to old rules or apply the new rule inconsistently."},
  {id:28,category:"Adaptive Thinking",difficulty:"Hard",question:"ANOTHER NEW RULE: Do not reverse. Simply double every consonant and remove all vowels. What does CREATIVE become?",options:["CCRRTTVV","CCRTVV","CCRRTV","CCRRTTV"],correct:0,weights:{adaptive:100},ruleSet:3,correctIndicates:"Rapidly adapts to yet another rule change. Excellent cognitive flexibility and learning agility.",incorrectIndicates:"May experience cumulative interference from multiple previous rules or fatigue in rule-switching."},
  {id:29,category:"Adaptive Thinking",difficulty:"Hard",question:"Using the NEWEST rule (double consonants, remove vowels, no reversal), what does ALGORITHM become?",options:["LLGGRRTTHHM","LLGGRRTTHHMM","LGRTHM","LLGGRRTTHMM"],correct:1,weights:{adaptive:100},ruleSet:3,correctIndicates:"Maintains the third rule correctly. Demonstrates sustained adaptability across multiple changes.",incorrectIndicates:"May struggle with sustained rule changes or make errors under cognitive load from multiple switches."},
  {id:30,category:"Processing Efficiency",difficulty:"Easy",question:"What is 15% of 80?",options:["10","12","15","18"],correct:1,weights:{processing:100},timed:true,correctIndicates:"Quick and accurate mental math. Efficient numerical processing.",incorrectIndicates:"May need more time for percentage calculations or make errors under time pressure."},
  {id:31,category:"Processing Efficiency",difficulty:"Easy",question:"If you buy 3 items at $4.50 each and pay with a $20 bill, how much change do you receive?",options:["$5.50","$6.00","$6.50","$7.00"],correct:2,weights:{processing:100},timed:true,correctIndicates:"Fast multi-step arithmetic. Efficient practical calculation.",incorrectIndicates:"May struggle with multi-step calculations under time constraints."},
  {id:32,category:"Processing Efficiency",difficulty:"Medium",question:"A train travels 240 miles in 4 hours. At the same speed, how far will it travel in 7 hours?",options:["380 miles","400 miles","420 miles","480 miles"],correct:2,weights:{processing:100},timed:true,correctIndicates:"Quickly identifies and applies rate relationships. Efficient proportional reasoning.",incorrectIndicates:"May struggle with rate/ratio problems under time pressure."},
  {id:33,category:"Processing Efficiency",difficulty:"Medium",question:"Which number does NOT belong in this set? 4, 9, 16, 25, 32, 49",options:["9","25","32","49"],correct:2,weights:{processing:70,pattern:30},timed:true,correctIndicates:"Rapidly identifies perfect squares and spots the outlier. Fast pattern recognition.",incorrectIndicates:"May not quickly recognize perfect square patterns or identify outliers efficiently."},
  {id:34,category:"Processing Efficiency",difficulty:"Medium",question:"Rearrange the letters 'OLGIC' to form a word. What is the first letter of that word?",options:["C","G","L","O"],correct:2,weights:{processing:100},timed:true,correctIndicates:"Fast mental manipulation and word recognition. Efficient verbal processing.",incorrectIndicates:"May need more time for anagram solving or mental letter rearrangement."},
  {id:35,category:"Processing Efficiency",difficulty:"Hard",question:"A rectangle has a perimeter of 36 cm. If the length is twice the width, what is the area?",options:["54 cm²","62 cm²","72 cm²","81 cm²"],correct:2,weights:{processing:85,analytical:15},timed:true,correctIndicates:"Rapidly sets up and solves algebraic relationships. Excellent processing under complexity.",incorrectIndicates:"May struggle with multi-step geometric calculations under time pressure."}
];

const memoryPassage = {title:"Meridian Technologies Company Memo",content:'Meridian Technologies has announced organizational changes effective Q3. The Engineering division, led by Director Priya Sharma, will merge with the Product team under the new "Innovation Hub." The merger affects 127 employees across three offices: Seattle (58 employees), Austin (42 employees), and Boston (27 employees). Budget allocation for the merged division is $4.2 million, a 15% increase from the combined previous budgets. New reporting structure: all team leads report to Priya Sharma, who reports directly to CEO Marcus Chen. The transition timeline is 90 days, with Phase 1 (communication) lasting 2 weeks, Phase 2 (structural changes) lasting 6 weeks, and Phase 3 (integration) lasting 4 weeks.'};

const methodologyContent = {
  audience:{title:"Target Audience",icon:"👥",content:"**Target Age Range:** 18-65 years old (working-age adults eligible for employment)\n\n**Psychometric Justification:**\n\n**Cognitive Stability in Adulthood:** Research indicates that fluid intelligence reaches peak development in early adulthood and remains relatively stable through middle adulthood before gradual decline in later years (Salthouse, 2009). The 18-65 range captures the period when cognitive abilities are sufficiently developed and stable to produce reliable and valid psychometric measurements.\n\n**Legal and Practical Considerations:** Age 18 represents the legal threshold for employment in most professional contexts and the age at which individuals have typically completed secondary education, ensuring a baseline of test-taking familiarity. The upper bound of 65 aligns with standard employment age ranges while acknowledging that cognitive assessments remain valid predictors across the adult lifespan.\n\n**Norm Development:** Standardization procedures will establish age-stratified norms (e.g., 18-25, 26-35, 36-45, 46-55, 56-65) to account for documented age-related variations in processing speed and working memory. This ensures that candidate scores are compared against appropriate reference groups, maintaining test fairness and validity across the full age range.\n\n**Purpose Alignment:** As a pre-employment assessment, JICA must be designed for the population it serves: job applicants across career stages. Restricting the age range unnecessarily would limit the test's utility and potentially raise legal concerns regarding age discrimination in hiring."},
  classification:{title:"Test Classification",icon:"📋",content:"**Classification:** JICA is classified as an **aptitude test**.\n\n**Evidence-Based Rationale:**\n\nAptitude tests measure potential for future learning and performance, while achievement tests measure mastery of previously learned content. JICA is designed as an aptitude test for several key reasons:\n\n**Focus on Capacity, Not Content:** JICA items are intentionally designed to minimize reliance on specific prior knowledge. Pattern recognition tasks, abstract reasoning problems, and novel problem-solving scenarios assess how candidates think rather than what they have previously learned.\n\n**Predictive Purpose:** The explicit goal of JICA is to predict future job performance and learning potential—hallmarks of aptitude testing. Research by Schmidt and Hunter (2004) demonstrates that general cognitive ability tests have validity coefficients of approximately .51 for predicting job performance across occupations.\n\n**Fluid Intelligence Emphasis:** By emphasizing fluid intelligence (Gf) over crystallized intelligence (Gc), JICA measures innate reasoning capacity that develops relatively independently of formal education. Carroll's (1993) three-stratum theory supports that Gf is more closely associated with learning potential.\n\n**Practical Implication:** As an aptitude test, JICA provides HR with insight into a candidate's capacity to learn job-specific skills during onboarding and to adapt as role requirements evolve."},
  purpose:{title:"Purpose & Application",icon:"🎯",content:"**Primary Purpose:** The J-Industries Cognitive Assessment (JICA) is a pre-employment cognitive screening tool designed to evaluate foundational mental abilities that predict workplace success across all roles and departments.\n\n**What It Measures:**\n\nRather than testing job-specific knowledge or technical skills, JICA assesses the underlying cognitive capabilities that enable employees to learn, adapt, and solve problems effectively in any professional context:\n\n• **Problem Solving** — Ability to analyze novel situations, identify patterns, and reach logical conclusions\n• **Information Retention** — Capacity to hold and recall information without reference materials\n• **Adaptive Learning** — Ability to apply feedback and adjust approach when circumstances change\n• **Processing Efficiency** — Speed and accuracy under time pressure\n\n**Application:**\n\nJICA serves as a standardized component of J-Industries' hiring process, administered to all candidates after initial resume screening but before final interviews.\n\n**End-Users:**\n\nThe primary end-users are HR professionals and hiring managers at J-Industries. They receive a multi-dimensional profile of each candidate showing relative strengths across cognitive domains, rather than a simple pass/fail designation."},
  theoretical:{title:"Theoretical Foundation",icon:"🧠",content:"**Theoretical Framework:**\n\nJICA is grounded in the **Cattell-Horn-Carroll (CHC) theory** of cognitive abilities, specifically drawing on the distinction between fluid intelligence (Gf) and crystallized intelligence (Gc), while incorporating elements of working memory capacity from Baddeley's model.\n\n**Core Constructs Measured:**\n\n**1. Fluid Intelligence (Gf):** The ability to reason, identify patterns, and solve novel problems independent of previously acquired knowledge. This includes:\n• Inductive reasoning (identifying rules from examples)\n• Deductive reasoning (applying rules to reach conclusions)\n• Abstract pattern recognition\n\n**2. Working Memory:** The capacity to hold, manipulate, and retrieve information over short periods during cognitive tasks.\n\n**3. Adaptive Learning:** The ability to integrate feedback and apply new information to improve performance within the assessment itself.\n\n**4. Processing Speed:** The ability to perform cognitive tasks quickly and accurately, particularly under time pressure.\n\n**Why This Framework?**\n\nResearch consistently shows that fluid intelligence is the single best cognitive predictor of job performance across occupations (Schmidt & Hunter, 1998), while working memory capacity underlies the ability to manage complex tasks and learn new information efficiently."},
  psychometric:{title:"Psychometric Properties",icon:"📊",content:"**Standardization Procedures:**\n\n**Representative Norming Sample:** JICA requires administration to a minimum of 2,000 participants stratified by age (18-25, 26-35, 36-45, 46-55, 56-65), gender, education level, geographic region, and industry background.\n\n**Uniform Administration:** All test administrations follow identical procedures—browser-based delivery, scripted on-screen instructions, programmatic timing enforcement, and recommended testing conditions.\n\n**Norm Establishment:** From the norming sample, mean, standard deviation, and percentile ranks (1st-99th) are calculated for each category and composite score.\n\n---\n\n**Reliability Procedures:**\n\n**Internal Consistency (Cronbach's Alpha):** Target α ≥ .80 for each subscale; α ≥ .85 for total score.\n\n**Split-Half Reliability:** Items divided into matched halves, correlation calculated with Spearman-Brown correction. Target: ≥ .80.\n\n**Test-Retest Reliability:** Subset of 300 participants tested twice with 2-4 week interval. Target: r ≥ .75 for subscales; r ≥ .80 for total score.\n\n---\n\n**Validity Procedures:**\n\n**Content Validity:** Panel of 5-7 subject matter experts rate each item for relevance, clarity, and appropriateness. Target Content Validity Index (CVI) ≥ .90.\n\n**Construct Validity:**\n• Convergent: JICA scores correlated with Raven's Progressive Matrices (target r ≥ .60), Wechsler Digit Span (r ≥ .55), Wonderlic (r ≥ .65)\n• Discriminant: Low correlations with personality measures (r < .30)\n• Factor Analysis: Confirmatory factor analysis verifying five-factor structure (CFI ≥ .95, RMSEA ≤ .06)\n\n**Criterion-Related Validity:**\n• Predictive study: 500 hired candidates assessed, correlated with 6-12 month performance ratings (target r ≥ .30)\n• Concurrent study: 300 current employees, correlated with existing performance data"},
  biasMitigation:{title:"Bias Mitigation",icon:"⚖️",content:"**Understanding Stereotype Threat:**\n\nStereotype threat occurs when individuals are aware of negative stereotypes about their group's intellectual abilities, leading to anxiety that impairs performance (Steele & Aronson, 1995). Stereotype lift is the complementary effect where non-stereotyped groups experience performance boosts.\n\n---\n\n**Test Design Elements:**\n\n**1. Reframing the Assessment:** JICA is framed as a \"problem-solving exercise\" rather than an \"intelligence test.\" Research shows this reduces stereotype threat effects by ~0.3 standard deviations (Walton & Spencer, 2009).\n\n**2. Growth Mindset Priming:** Candidates read a brief passage explaining cognitive skills are malleable and improve with practice (Dweck, 2006).\n\n**3. Self-Affirmation:** Before testing, candidates select and briefly write about a personal value important to them. This intervention reduced racial achievement gaps by 40% in Cohen et al. (2006).\n\n**4. Demographics After Testing:** Any demographic questions are collected AFTER test completion. Stricker & Ward (2004) showed this improves performance among stereotyped groups.\n\n**5. Culturally Neutral Content:** All items minimize reliance on culturally-specific knowledge. Differential Item Functioning (DIF) analysis identifies and removes biased items.\n\n---\n\n**Administrative Procedures:**\n\n**6. Practice Items:** Each section begins with unscored practice items to reduce initial anxiety.\n\n**7. Transparent Feedback:** Detailed results shift attribution from fixed ability to specific, developable skills.\n\n**8. Adverse Impact Monitoring:** Quarterly analysis using the 4/5ths rule (EEOC guidelines) with corrective action if disparities emerge."},
  algorithm:{title:"Scoring Algorithm",icon:"⚙️",content:"**Step 1: Response Scoring**\nEach question scored dichotomously: correct = 1 point, incorrect = 0 points. No penalty for guessing.\n\n**Step 2: Category Weight Application**\nEach question has predefined category weights summing to 100%. Correct answers distribute points across categories by weight.\n\n*Example:* Question with 70% Analytical, 30% Pattern weights → correct answer gives AR 0.70 points, PR 0.30 points.\n\n**Step 3: Raw Category Scores**\nSum weighted points per category across all questions.\n\n**Step 4: Percentile Conversion**\nRaw scores converted to percentiles using norm tables from standardization sample.\n\n**Step 5: Composite Score**\nWeighted average of category percentiles:\n**Composite = (AR × 0.25) + (PR × 0.20) + (WM × 0.20) + (AT × 0.20) + (PE × 0.15)**\n\n**Step 6: Critical Threshold Check**\n• Analytical Reasoning: 25th percentile minimum\n• Pattern Recognition: 20th percentile minimum\n• Working Memory: 25th percentile minimum\n• Adaptive Thinking: 30th percentile minimum (highest—inability to adapt is most problematic)\n• Processing Efficiency: 15th percentile minimum\n\n**Step 7: Recommendation**\n• **STRONG HIRE:** Composite ≥ 75th, no category below threshold\n• **RECOMMEND HIRE:** Composite 50th-74th, no category below threshold\n• **CONDITIONAL:** Composite 35th-49th, or one category slightly below threshold\n• **DO NOT RECOMMEND:** Composite < 35th, or multiple/severe threshold breaches\n\n**Step 8: Rationale Generation**\nNatural language summary identifying strengths (>65th), adequate areas (35th-65th), and concerns (<35th) with practical implications for job performance."}
};

const categoryNames = {analytical:"Analytical Reasoning",pattern:"Pattern Recognition",memory:"Working Memory",adaptive:"Adaptive Thinking",processing:"Processing Efficiency"};

const LandingPage = ({onStart,onSuffernAccess}) => (
  <div className="min-h-screen bg-white flex flex-col">
    <header className="border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg font-semibold">J</span>
          </div>
          <div>
            <div className="text-slate-900 font-semibold tracking-tight">J-Industries</div>
            <div className="text-slate-400 text-xs tracking-wide uppercase">Talent Assessment</div>
          </div>
        </div>
      </div>
    </header>
    <main className="flex-1 flex items-center">
      <div className="max-w-6xl mx-auto px-6 py-16 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block px-3 py-1 bg-slate-100 rounded-full text-slate-600 text-sm font-medium mb-6">Cognitive Assessment Platform</div>
            <h1 className="text-5xl font-light text-slate-900 leading-tight mb-6 tracking-tight">Discover your<br/><span className="font-semibold">cognitive profile</span></h1>
            <p className="text-xl text-slate-500 leading-relaxed mb-8 font-light">A comprehensive assessment measuring problem-solving, information retention, adaptive thinking, and processing efficiency.</p>
            <button onClick={onStart} className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors">Begin Assessment<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg></button>
            <p className="mt-6 text-sm text-slate-400">Approximately 20-30 minutes to complete</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-8 lg:p-12">
            <div className="text-center mb-8">
              <a href="https://jicaapp.tech" className="group relative inline-block px-6 py-3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-slate-300 active:scale-95 hover:animate-wiggle">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100 to-transparent opacity-60 animate-sheen"></div>
                <span className="relative text-2xl tracking-tight flex items-center justify-center">
                  <span className="font-bold text-blue-600 animate-pulse-subtle">J</span>
                  <span className="font-medium text-slate-700">ica</span>
                  <span className="font-bold text-blue-600 animate-pulse-subtle">A</span>
                  <span className="font-medium text-slate-700">pp</span>
                  <span className="font-light text-slate-400">.tech</span>
                </span>
              </a>
              <div className="mt-4 h-10 flex items-center justify-center">
                <div className="animate-morph-container relative">
                  <div className="animate-pill-bg absolute inset-0 rounded-full"></div>
                  <span className="relative inline-flex items-center text-sm tracking-wide">
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 animate-letter-float">J</span>
                    <span className="text-slate-400 animate-morph-text">-</span>
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 animate-letter-float animation-delay-100">I</span>
                    <span className="text-slate-400 animate-morph-text">ndustries</span>
                    <span className="animate-morph-text">&nbsp;</span>
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500 animate-letter-float animation-delay-200">C</span>
                    <span className="text-slate-400 animate-morph-text">ognitive</span>
                    <span className="animate-morph-text">&nbsp;</span>
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 animate-letter-float animation-delay-300">A</span>
                    <span className="text-slate-400 animate-morph-text">ssessment</span>
                    <span className="animate-morph-text">&nbsp;</span>
                    <span className="animate-morph-space">&nbsp;</span>
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-600 animate-letter-float animation-delay-400">A</span>
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">pp</span>
                  </span>
                </div>
              </div>
            </div>
            <style>{`
              @keyframes sheen {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
              }
              @keyframes wiggle {
                0%, 100% { transform: rotate(-2deg) scale(1.05); }
                25% { transform: rotate(2deg) scale(1.05); }
                50% { transform: rotate(-2deg) scale(1.05); }
                75% { transform: rotate(2deg) scale(1.05); }
              }
              @keyframes pulse-subtle {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.8; transform: scale(1.05); }
              }
              @keyframes letter-glow {
                0%, 100% { text-shadow: 0 0 0 transparent; }
                50% { text-shadow: 0 0 8px rgba(59, 130, 246, 0.5); }
              }
              @keyframes letter-float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-2px); }
              }
              @keyframes morph-text {
                0%, 35% { max-width: 150px; opacity: 1; }
                45%, 85% { max-width: 0; opacity: 0; }
                95%, 100% { max-width: 150px; opacity: 1; }
              }
              @keyframes morph-space {
                0%, 35% { width: 0; }
                45%, 85% { width: 6px; }
                95%, 100% { width: 0; }
              }
              @keyframes pill-bg {
                0%, 35% { opacity: 0; transform: scale(0.8); }
                45%, 85% { opacity: 1; transform: scale(1); }
                95%, 100% { opacity: 0; transform: scale(0.8); }
              }
              .animate-sheen {
                animation: sheen 3s ease-in-out infinite;
              }
              .hover\\:animate-wiggle:hover {
                animation: wiggle 0.4s ease-in-out;
              }
              .animate-pulse-subtle {
                animation: letter-glow 2s ease-in-out infinite;
              }
              .group:hover .animate-pulse-subtle {
                animation: pulse-subtle 0.3s ease-in-out, letter-glow 0.5s ease-in-out infinite;
              }
              .animate-morph-text {
                display: inline-block;
                overflow: hidden;
                white-space: nowrap;
                animation: morph-text 8s ease-in-out infinite;
              }
              .animate-morph-space {
                display: inline-block;
                animation: morph-space 8s ease-in-out infinite;
              }
              .animate-morph-container {
                display: inline-flex;
                align-items: center;
                padding: 6px 16px;
                transition: all 0.3s ease;
              }
              .animate-pill-bg {
                background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(99, 102, 241, 0.15) 50%, rgba(59, 130, 246, 0.1) 100%);
                border: 1px solid rgba(59, 130, 246, 0.2);
                box-shadow: 0 4px 15px rgba(59, 130, 246, 0.15), inset 0 1px 2px rgba(255,255,255,0.5);
                animation: pill-bg 8s ease-in-out infinite;
              }
              .animate-letter-float {
                display: inline-block;
                animation: letter-float 3s ease-in-out infinite;
              }
              .animation-delay-100 { animation-delay: 0.1s; }
              .animation-delay-200 { animation-delay: 0.2s; }
              .animation-delay-300 { animation-delay: 0.3s; }
              .animation-delay-400 { animation-delay: 0.4s; }
            `}</style>
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center p-6"><div className="text-4xl font-light text-slate-900 mb-2">35</div><div className="text-sm text-slate-500 uppercase tracking-wide">Questions</div></div>
              <div className="text-center p-6"><div className="text-4xl font-light text-slate-900 mb-2">5</div><div className="text-sm text-slate-500 uppercase tracking-wide">Categories</div></div>
              <div className="text-center p-6"><div className="text-4xl font-light text-slate-900 mb-2">20</div><div className="text-sm text-slate-500 uppercase tracking-wide">Minutes Avg</div></div>
              <div className="text-center p-6"><div className="text-4xl font-light text-slate-900 mb-2">1</div><div className="text-sm text-slate-500 uppercase tracking-wide">Profile</div></div>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-200">
              <p className="text-sm text-slate-500 leading-relaxed text-center">Research shows that cognitive skills develop with experience and practice. Your results reflect your current profile, which evolves over time.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer className="border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <p className="text-sm text-slate-400">Designed by Jonathan Shiell for AP Psychology</p>
          <span className="hidden sm:block text-slate-300">•</span>
          <a href="https://jicaapp.tech" className="text-sm hover:text-slate-700 font-medium transition-colors"><span className="text-blue-500 font-semibold">J</span><span className="text-slate-500">ica</span><span className="text-blue-500 font-semibold">A</span><span className="text-slate-500">pp.tech</span></a>
        </div>
        <button onClick={onSuffernAccess} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">Instructor Access →</button>
      </div>
    </footer>
  </div>
);

const SuffernModal = ({onConfirm,onCancel}) => (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Instructor Access</h2>
        <p className="text-slate-500 text-sm leading-relaxed">This will bypass the assessment and provide direct access to the methodology, scoring explanations, and question rationales.</p>
      </div>
      <div className="bg-slate-50 rounded-xl p-4 mb-6">
        <p className="text-slate-600 text-sm text-center">I confirm that I am Mr. Suffern and wish to access the assessment materials directly.</p>
      </div>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium">Cancel</button>
        <button onClick={onConfirm} className="flex-1 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium">Confirm Access</button>
      </div>
    </div>
  </div>
);

const MemoryPassagePage = ({onContinue}) => {
  const [timeLeft,setTimeLeft] = useState(60);
  React.useEffect(() => {
    const timer = setInterval(() => setTimeLeft(t => t <= 1 ? (clearInterval(timer), 0) : t - 1), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center"><span className="text-white text-sm font-semibold">J</span></div>
            <span className="text-slate-400 text-sm">Working Memory Section</span>
          </div>
          <div className="flex items-center gap-2 text-amber-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span className="font-mono font-medium">{timeLeft}s</span>
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              <p className="text-amber-800 text-sm"><strong>Important:</strong> Read the following passage carefully. You will be asked questions about it later and will not be able to refer back.</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 pb-4 border-b border-gray-100">{memoryPassage.title}</h2>
            <p className="text-slate-600 leading-relaxed text-lg">{memoryPassage.content}</p>
          </div>
          <button onClick={onContinue} className="w-full mt-6 py-4 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors">I'm ready to continue</button>
        </div>
      </main>
    </div>
  );
};

const QuestionPage = ({question,questionNumber,totalQuestions,onAnswer,selectedAnswer}) => {
  const progress = (questionNumber / totalQuestions) * 100;
  const isAdaptive = question.category === "Adaptive Thinking";
  const isProcessing = question.category === "Processing Efficiency";
  const categoryColors = {"Analytical Reasoning":"bg-violet-50 text-violet-700 border-violet-200","Pattern Recognition":"bg-blue-50 text-blue-700 border-blue-200","Working Memory":"bg-emerald-50 text-emerald-700 border-emerald-200","Adaptive Thinking":"bg-orange-50 text-orange-700 border-orange-200","Processing Efficiency":"bg-rose-50 text-rose-700 border-rose-200"};
  const difficultyColors = {Easy:"text-emerald-600",Medium:"text-amber-600",Hard:"text-rose-600"};
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center"><span className="text-white text-sm font-semibold">J</span></div>
            <span className="text-slate-400 text-sm">Question {questionNumber} of {totalQuestions}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-sm font-medium ${difficultyColors[question.difficulty]}`}>{question.difficulty}</span>
            {isProcessing && <span className="flex items-center gap-1 text-rose-600 text-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>Timed</span>}
          </div>
        </div>
      </header>
      <div className="bg-white border-b border-gray-100"><div className="max-w-3xl mx-auto"><div className="h-1 bg-slate-100"><div className="h-full bg-slate-900 transition-all duration-500 ease-out" style={{width:`${progress}%`}}/></div></div></div>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="mb-6"><span className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium border ${categoryColors[question.category]}`}>{question.category}</span></div>
          {isAdaptive && question.ruleSet === 1 && questionNumber === 24 && <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6"><p className="text-blue-800 text-sm"><strong>Rule:</strong> Reverse the word, then replace all vowels with the next vowel in sequence (A→E, E→I, I→O, O→U, U→A).</p></div>}
          {isAdaptive && question.ruleSet === 2 && questionNumber === 26 && <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6"><p className="text-orange-800 text-sm"><strong>⚠️ Rule Change:</strong> Reverse the word, then replace all CONSONANTS with the previous consonant in the alphabet. Vowels remain unchanged.</p></div>}
          {isAdaptive && question.ruleSet === 3 && questionNumber === 28 && <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6"><p className="text-emerald-800 text-sm"><strong>⚠️ New Rule:</strong> Do NOT reverse. Simply double every consonant and remove all vowels.</p></div>}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-6 shadow-sm"><p className="text-slate-900 text-xl leading-relaxed">{question.question}</p></div>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button key={index} onClick={() => onAnswer(index)} className={`w-full p-5 rounded-xl text-left transition-all duration-200 border ${selectedAnswer === index ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-gray-200 text-slate-700 hover:border-slate-300 hover:shadow-sm"}`}>
                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full mr-4 text-sm font-medium ${selectedAnswer === index ? "bg-white text-slate-900" : "bg-slate-100 text-slate-600"}`}>{String.fromCharCode(65 + index)}</span>
                {option}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

const ResultsPage = ({answers,onViewMethodology}) => {
  const [selectedRole, setSelectedRole] = useState('general');
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  
  // Role profiles for different job types
  const roleProfiles = {
    general: { name: 'General', weights: { analytical: 0.25, pattern: 0.20, memory: 0.20, adaptive: 0.20, processing: 0.15 }, icon: '👤' },
    analyst: { name: 'Data Analyst', weights: { analytical: 0.35, pattern: 0.30, memory: 0.15, adaptive: 0.10, processing: 0.10 }, icon: '📊' },
    developer: { name: 'Software Developer', weights: { analytical: 0.25, pattern: 0.35, memory: 0.10, adaptive: 0.20, processing: 0.10 }, icon: '💻' },
    manager: { name: 'Manager', weights: { analytical: 0.20, pattern: 0.10, memory: 0.25, adaptive: 0.30, processing: 0.15 }, icon: '👔' },
    customer_service: { name: 'Customer Service', weights: { analytical: 0.10, pattern: 0.10, memory: 0.30, adaptive: 0.35, processing: 0.15 }, icon: '🎧' },
    creative: { name: 'Creative Role', weights: { analytical: 0.15, pattern: 0.35, memory: 0.15, adaptive: 0.25, processing: 0.10 }, icon: '🎨' },
  };

  // Difficulty multipliers for IRT-style scoring
  const difficultyMultiplier = { Easy: 0.8, Medium: 1.0, Hard: 1.3 };
  
  const scores = useMemo(() => {
    const rawScores = {analytical:0,pattern:0,memory:0,adaptive:0,processing:0};
    const maxScores = {analytical:0,pattern:0,memory:0,adaptive:0,processing:0};
    const irtScores = {analytical:0,pattern:0,memory:0,adaptive:0,processing:0};
    const irtMax = {analytical:0,pattern:0,memory:0,adaptive:0,processing:0};
    
    // Track performance by difficulty for consistency analysis
    const difficultyPerformance = { Easy: { correct: 0, total: 0 }, Medium: { correct: 0, total: 0 }, Hard: { correct: 0, total: 0 } };
    
    // Track category-level performance for pattern analysis
    const categoryPerformance = {};
    
    questions.forEach((q, i) => {
      const isCorrect = answers[i] === q.correct;
      const diffMult = difficultyMultiplier[q.difficulty];
      
      // Track difficulty performance
      difficultyPerformance[q.difficulty].total++;
      if (isCorrect) difficultyPerformance[q.difficulty].correct++;
      
      // Track category performance
      if (!categoryPerformance[q.category]) {
        categoryPerformance[q.category] = { correct: 0, total: 0, easyMissed: 0, hardCorrect: 0 };
      }
      categoryPerformance[q.category].total++;
      if (isCorrect) {
        categoryPerformance[q.category].correct++;
        if (q.difficulty === 'Hard') categoryPerformance[q.category].hardCorrect++;
      } else {
        if (q.difficulty === 'Easy') categoryPerformance[q.category].easyMissed++;
      }
      
      Object.entries(q.weights).forEach(([category, weight]) => {
        const baseWeight = weight / 100;
        const irtWeight = baseWeight * diffMult;
        
        maxScores[category] += baseWeight;
        irtMax[category] += irtWeight;
        
        if (isCorrect) {
          rawScores[category] += baseWeight;
          irtScores[category] += irtWeight;
        }
      });
    });
    
    // Calculate percentiles using IRT-weighted scores
    const percentiles = {};
    Object.keys(irtScores).forEach(cat => {
      percentiles[cat] = Math.round((irtScores[cat] / irtMax[cat]) * 100);
    });
    
    // Calculate consistency score (are easy/hard performances aligned?)
    const easyRate = difficultyPerformance.Easy.total > 0 ? difficultyPerformance.Easy.correct / difficultyPerformance.Easy.total : 0;
    const hardRate = difficultyPerformance.Hard.total > 0 ? difficultyPerformance.Hard.correct / difficultyPerformance.Hard.total : 0;
    const consistencyScore = 1 - Math.abs(easyRate - hardRate - 0.3); // Expect ~30% difference
    const isConsistent = consistencyScore > 0.5;
    
    // Calculate confidence interval (±margin based on question count)
    const marginOfError = Math.round(15 / Math.sqrt(questions.length) * 2); // Simplified SE calculation
    
    return {
      raw: rawScores,
      max: maxScores,
      irt: irtScores,
      irtMax: irtMax,
      percentiles,
      difficultyPerformance,
      categoryPerformance,
      consistencyScore: Math.round(consistencyScore * 100),
      isConsistent,
      marginOfError
    };
  }, [answers]);

  // Calculate composite score based on selected role
  const getCompositeForRole = (roleKey) => {
    const weights = roleProfiles[roleKey].weights;
    return Math.round(
      scores.percentiles.analytical * weights.analytical +
      scores.percentiles.pattern * weights.pattern +
      scores.percentiles.memory * weights.memory +
      scores.percentiles.adaptive * weights.adaptive +
      scores.percentiles.processing * weights.processing
    );
  };

  const composite = getCompositeForRole(selectedRole);

  // Red flag detection
  const getRedFlags = () => {
    const flags = [];
    const p = scores.percentiles;
    
    // Critical cognitive concerns
    if (p.adaptive < 20) flags.push({ severity: 'high', message: 'Very low adaptability — may struggle significantly with changing requirements or new processes', category: 'Adaptive Thinking' });
    if (p.analytical < 20) flags.push({ severity: 'high', message: 'Very low analytical reasoning — may have difficulty with problem-solving and logical decisions', category: 'Analytical Reasoning' });
    if (p.memory < 20) flags.push({ severity: 'high', message: 'Very low working memory — may struggle to retain information during training and complex tasks', category: 'Working Memory' });
    
    // Pattern concerns
    if (p.analytical > 70 && p.processing < 35) flags.push({ severity: 'medium', message: 'High analytical but low processing speed — capable but may be slow under pressure', category: 'Processing Efficiency' });
    if (p.pattern > 70 && p.adaptive < 40) flags.push({ severity: 'medium', message: 'Strong pattern recognition but low adaptability — may resist changing established methods', category: 'Adaptive Thinking' });
    if (p.memory < 35 && p.analytical > 60) flags.push({ severity: 'medium', message: 'Good reasoning but weak memory — may need written references and documentation', category: 'Working Memory' });
    
    // Consistency flags
    if (!scores.isConsistent) {
      const easyRate = scores.difficultyPerformance.Easy.correct / scores.difficultyPerformance.Easy.total;
      const hardRate = scores.difficultyPerformance.Hard.correct / scores.difficultyPerformance.Hard.total;
      if (hardRate > easyRate) {
        flags.push({ severity: 'low', message: 'Unusual pattern: performed better on hard questions than easy ones — may indicate rushing or attention issues on simpler tasks', category: 'Consistency' });
      }
    }
    
    // Adaptive section specific analysis (Q24-29)
    const adaptiveQuestions = questions.filter(q => q.category === 'Adaptive Thinking');
    const adaptiveAnswers = adaptiveQuestions.map((q, idx) => answers[questions.indexOf(q)] === q.correct);
    const ruleTransitions = [
      { from: 0, to: 2, name: 'Rule 1 to Rule 2' },
      { from: 2, to: 4, name: 'Rule 2 to Rule 3' }
    ];
    ruleTransitions.forEach(({ from, to, name }) => {
      if (adaptiveAnswers[from] && adaptiveAnswers[from + 1] && !adaptiveAnswers[to] && !adaptiveAnswers[to + 1]) {
        flags.push({ severity: 'medium', message: `Struggled with ${name} transition — may have difficulty when procedures change`, category: 'Adaptive Thinking' });
      }
    });
    
    return flags;
  };

  const redFlags = getRedFlags();

  const getRecommendation = () => {
    const p = scores.percentiles;
    const thresholds = {analytical:25,pattern:20,memory:25,adaptive:30,processing:15};
    const breaches = Object.entries(thresholds).filter(([cat, thresh]) => p[cat] < thresh);
    const highSeverityFlags = redFlags.filter(f => f.severity === 'high').length;
    
    if (composite >= 75 && breaches.length === 0 && highSeverityFlags === 0) return {level:"Strong Hire",color:"emerald",icon:"✓",desc:"Excellent cognitive profile with no significant concerns"};
    else if (composite >= 50 && breaches.length === 0 && highSeverityFlags === 0) return {level:"Recommend",color:"blue",icon:"→",desc:"Solid cognitive abilities suitable for most roles"};
    else if (composite >= 35 || breaches.length <= 1) return {level:"Conditional",color:"amber",icon:"!",desc:"Some areas may require additional support or role matching"};
    else return {level:"Not Recommended",color:"rose",icon:"×",desc:"Significant concerns across multiple cognitive domains"};
  };

  const recommendation = getRecommendation();
  const radarData = [{category:'Analytical',value:scores.percentiles.analytical,fullMark:100},{category:'Pattern',value:scores.percentiles.pattern,fullMark:100},{category:'Memory',value:scores.percentiles.memory,fullMark:100},{category:'Adaptive',value:scores.percentiles.adaptive,fullMark:100},{category:'Processing',value:scores.percentiles.processing,fullMark:100}];

  const generateRationale = () => {
    const p = scores.percentiles;
    const strengths = Object.entries(p).filter(([_, v]) => v >= 65).map(([k]) => categoryNames[k]);
    const concerns = Object.entries(p).filter(([_, v]) => v < 35).map(([k]) => categoryNames[k]);
    let text = "";
    if (strengths.length > 0) text += `Strong performance in ${strengths.join(" and ")}. `;
    if (concerns.length > 0) text += `Areas for development include ${concerns.join(" and ")}. `;
    return text || "Balanced performance across all cognitive domains.";
  };

  const recStyles = {emerald:{bg:"bg-emerald-50",border:"border-emerald-200",text:"text-emerald-700",icon:"bg-emerald-100"},blue:{bg:"bg-blue-50",border:"border-blue-200",text:"text-blue-700",icon:"bg-blue-100"},amber:{bg:"bg-amber-50",border:"border-amber-200",text:"text-amber-700",icon:"bg-amber-100"},rose:{bg:"bg-rose-50",border:"border-rose-200",text:"text-rose-700",icon:"bg-rose-100"}};
  const style = recStyles[recommendation.color];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4"><span className="text-white text-xl font-semibold">J</span></div>
          <h1 className="text-3xl font-light text-slate-900 mb-2">Assessment Complete</h1>
          <p className="text-slate-500">Your cognitive profile has been analyzed using advanced psychometric methods</p>
        </div>
        
        {/* Main Recommendation */}
        <div className={`${style.bg} ${style.border} border rounded-2xl p-6 mb-8`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 ${style.icon} rounded-full flex items-center justify-center`}><span className={`text-xl ${style.text}`}>{recommendation.icon}</span></div>
            <div className="flex-1">
              <div className={`text-lg font-semibold ${style.text}`}>{recommendation.level}</div>
              <p className="text-slate-600 text-sm mt-1">{generateRationale()}</p>
            </div>
          </div>
        </div>

        {/* Role Fit Selector */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Role Fit Analysis</h2>
          <p className="text-slate-500 text-sm mb-4">See how this profile matches different job types:</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(roleProfiles).map(([key, role]) => (
              <button
                key={key}
                onClick={() => setSelectedRole(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedRole === key
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {role.icon} {role.name}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <div className="text-sm text-slate-500">Fit Score for {roleProfiles[selectedRole].name}</div>
              <div className="text-3xl font-light text-slate-900">{composite}<span className="text-lg text-slate-400">th percentile</span></div>
              <div className="text-xs text-slate-400 mt-1">Confidence interval: {Math.max(0, composite - scores.marginOfError)} - {Math.min(100, composite + scores.marginOfError)}</div>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              composite >= 70 ? 'bg-emerald-100 text-emerald-700' :
              composite >= 50 ? 'bg-blue-100 text-blue-700' :
              composite >= 35 ? 'bg-amber-100 text-amber-700' :
              'bg-rose-100 text-rose-700'
            }`}>
              {composite >= 70 ? 'Excellent Fit' : composite >= 50 ? 'Good Fit' : composite >= 35 ? 'Moderate Fit' : 'Poor Fit'}
            </div>
          </div>
        </div>

        {/* Red Flags Section */}
        {redFlags.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">⚠️ Insights & Considerations</h2>
            <div className="space-y-3">
              {redFlags.map((flag, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${
                    flag.severity === 'high' ? 'bg-rose-50 border-rose-200' :
                    flag.severity === 'medium' ? 'bg-amber-50 border-amber-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`text-sm font-medium px-2 py-0.5 rounded ${
                      flag.severity === 'high' ? 'bg-rose-200 text-rose-800' :
                      flag.severity === 'medium' ? 'bg-amber-200 text-amber-800' :
                      'bg-blue-200 text-blue-800'
                    }`}>
                      {flag.severity === 'high' ? 'Important' : flag.severity === 'medium' ? 'Note' : 'Info'}
                    </span>
                    <div>
                      <p className="text-slate-700 text-sm">{flag.message}</p>
                      <p className="text-slate-400 text-xs mt-1">Related to: {flag.category}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Consistency */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Performance Consistency</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {Object.entries(scores.difficultyPerformance).map(([diff, data]) => (
              <div key={diff} className="text-center p-4 bg-slate-50 rounded-xl">
                <div className={`text-xs font-medium uppercase tracking-wide mb-2 ${
                  diff === 'Easy' ? 'text-emerald-600' : diff === 'Medium' ? 'text-amber-600' : 'text-rose-600'
                }`}>{diff}</div>
                <div className="text-2xl font-light text-slate-900">
                  {data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0}%
                </div>
                <div className="text-xs text-slate-400">{data.correct}/{data.total} correct</div>
              </div>
            ))}
          </div>
          <div className={`p-3 rounded-lg text-sm ${scores.isConsistent ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
            {scores.isConsistent 
              ? '✓ Consistent performance across difficulty levels — reliable indicator of true ability'
              : '⚠ Inconsistent performance pattern — results should be interpreted with caution'}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Cognitive Profile</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0"/>
                  <PolarAngleAxis dataKey="category" tick={{fill:'#64748b',fontSize:11}}/>
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{fill:'#94a3b8',fontSize:10}}/>
                  <Radar name="Score" dataKey="value" stroke="#0f172a" fill="#0f172a" fillOpacity={0.1} strokeWidth={2}/>
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-center">
            <div className="text-center">
              <div className="text-6xl font-light text-slate-900 mb-1">{composite}</div>
              <div className="text-slate-400 text-xs mb-1">±{scores.marginOfError}</div>
              <div className="text-slate-500 text-sm uppercase tracking-wide mb-6">Composite Percentile</div>
              <div className="space-y-3">
                {Object.entries(scores.percentiles).map(([cat, val]) => (
                  <div key={cat} className="flex items-center justify-between">
                    <span className="text-slate-600 text-sm">{categoryNames[cat]}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-slate-900 rounded-full" style={{width:`${val}%`}}/></div>
                      <span className="text-slate-900 text-sm font-medium w-8 text-right">{val}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Question Breakdown</h2>
          <div className="space-y-2">
            {questions.map((q, i) => (
              <div key={q.id} className="border border-gray-100 rounded-xl overflow-hidden">
                <button onClick={() => setExpandedQuestion(expandedQuestion === i ? null : i)} className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${answers[i] === q.correct ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{answers[i] === q.correct ? '✓' : '×'}</span>
                    <span className="text-slate-700 text-sm">Question {q.id}</span>
                    <span className="text-slate-400 text-sm">· {q.category}</span>
                  </div>
                  <svg className={`w-5 h-5 text-slate-400 transition-transform ${expandedQuestion === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                </button>
                {expandedQuestion === i && (
                  <div className="p-4 pt-0 border-t border-gray-100 bg-slate-50">
                    <p className="text-slate-700 text-sm mb-4 mt-4">{q.question}</p>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="text-slate-500 text-xs mb-1">Your Answer</div>
                        <div className={`text-sm font-medium ${answers[i] === q.correct ? 'text-emerald-700' : 'text-rose-700'}`}>{String.fromCharCode(65 + answers[i])}. {q.options[answers[i]]}</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="text-slate-500 text-xs mb-1">Correct Answer</div>
                        <div className="text-emerald-700 text-sm font-medium">{String.fromCharCode(65 + q.correct)}. {q.options[q.correct]}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {Object.entries(q.weights).map(([cat, weight]) => <span key={cat} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-slate-600">{categoryNames[cat]}: {weight}%</span>)}
                    </div>
                    <div className={`text-sm p-3 rounded-lg ${answers[i] === q.correct ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>{answers[i] === q.correct ? q.correctIndicates : q.incorrectIndicates}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <button onClick={onViewMethodology} className="w-full py-4 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors">View Assessment Methodology</button>
      </div>
    </div>
  );
};

const SuffernResultsPage = ({onViewMethodology}) => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const sampleRadarData = [{category:'Analytical',value:72,fullMark:100},{category:'Pattern',value:68,fullMark:100},{category:'Memory',value:81,fullMark:100},{category:'Adaptive',value:75,fullMark:100},{category:'Processing',value:64,fullMark:100}];
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4"><span className="text-white text-xl font-semibold">J</span></div>
          <h1 className="text-3xl font-light text-slate-900 mb-2">Instructor View</h1>
          <p className="text-slate-500">Complete assessment rationale and question breakdown</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">Sample Cognitive Profile</h2>
          <p className="text-slate-500 text-sm mb-4">This shows how results appear to candidates</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={sampleRadarData}>
                <PolarGrid stroke="#e2e8f0"/>
                <PolarAngleAxis dataKey="category" tick={{fill:'#64748b',fontSize:11}}/>
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{fill:'#94a3b8',fontSize:10}}/>
                <Radar name="Score" dataKey="value" stroke="#0f172a" fill="#0f172a" fillOpacity={0.1} strokeWidth={2}/>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">Working Memory Passage</h2>
          <p className="text-slate-500 text-sm mb-4">Candidates read this before questions 17-23 and cannot refer back</p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h3 className="text-amber-900 font-medium mb-2">{memoryPassage.title}</h3>
            <p className="text-amber-800 text-sm leading-relaxed">{memoryPassage.content}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Complete Question Bank (35 Questions)</h2>
          <div className="space-y-2">
            {questions.map((q, i) => (
              <div key={q.id} className="border border-gray-100 rounded-xl overflow-hidden">
                <button onClick={() => setExpandedQuestion(expandedQuestion === i ? null : i)} className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-sm font-medium">{q.id}</span>
                    <span className="text-slate-700 text-sm">{q.category}</span>
                    <span className={`text-xs font-medium ${q.difficulty === "Easy" ? "text-emerald-600" : q.difficulty === "Medium" ? "text-amber-600" : "text-rose-600"}`}>{q.difficulty}</span>
                  </div>
                  <svg className={`w-5 h-5 text-slate-400 transition-transform ${expandedQuestion === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                </button>
                {expandedQuestion === i && (
                  <div className="p-4 pt-0 border-t border-gray-100 bg-slate-50">
                    <p className="text-slate-700 text-sm mb-4 mt-4">{q.question}</p>
                    <div className="bg-white rounded-lg p-3 border border-gray-200 mb-4">
                      <div className="text-slate-500 text-xs mb-2">Answer Options</div>
                      {q.options.map((opt, idx) => <div key={idx} className={`text-sm py-1 ${idx === q.correct ? 'text-emerald-700 font-medium' : 'text-slate-600'}`}>{String.fromCharCode(65 + idx)}. {opt} {idx === q.correct && '✓'}</div>)}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {Object.entries(q.weights).map(([cat, weight]) => <span key={cat} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-slate-600">{categoryNames[cat]}: {weight}%</span>)}
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="bg-emerald-50 rounded-lg p-3">
                        <div className="text-emerald-800 text-xs font-medium mb-1">If Correct:</div>
                        <p className="text-emerald-700 text-sm">{q.correctIndicates}</p>
                      </div>
                      <div className="bg-rose-50 rounded-lg p-3">
                        <div className="text-rose-800 text-xs font-medium mb-1">If Incorrect:</div>
                        <p className="text-rose-700 text-sm">{q.incorrectIndicates}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <button onClick={onViewMethodology} className="w-full py-4 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors">View Assessment Methodology</button>
      </div>
    </div>
  );
};

const MethodologyModal = ({content,onClose}) => (
  <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
    <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
      <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{content.icon}</span>
          <h2 className="text-xl font-semibold text-slate-900">{content.title}</h2>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div className="p-6 overflow-y-auto flex-1">
        <div className="prose prose-slate prose-sm max-w-none">
          {content.content.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-slate-600 mb-4 leading-relaxed whitespace-pre-wrap">
              {paragraph.split('**').map((part, j) => j % 2 === 1 ? <strong key={j} className="text-slate-900">{part}</strong> : part)}
            </p>
          ))}
        </div>
      </div>
      <div className="p-4 border-t border-gray-100 flex-shrink-0">
        <button onClick={onClose} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors">Close</button>
      </div>
    </div>
  </div>
);

const MethodologyPage = ({onBack}) => {
  const [activeModal, setActiveModal] = useState(null);
  const boxes = [{key:'audience',...methodologyContent.audience},{key:'classification',...methodologyContent.classification},{key:'purpose',...methodologyContent.purpose},{key:'theoretical',...methodologyContent.theoretical},{key:'psychometric',...methodologyContent.psychometric},{key:'biasMitigation',...methodologyContent.biasMitigation},{key:'algorithm',...methodologyContent.algorithm}];
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4"><span className="text-white text-xl font-semibold">J</span></div>
          <h1 className="text-3xl font-light text-slate-900 mb-2">Assessment Methodology</h1>
          <p className="text-slate-500">Understanding the science behind JICA</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {boxes.map((box) => (
            <button key={box.key} onClick={() => setActiveModal(box)} className="bg-white border border-gray-200 rounded-2xl p-6 text-left hover:border-slate-300 hover:shadow-lg transition-all duration-200 group">
              <span className="text-3xl mb-4 block">{box.icon}</span>
              <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-slate-700">{box.title}</h3>
              <p className="text-slate-400 text-sm">Click to learn more →</p>
            </button>
          ))}
        </div>
        <button onClick={onBack} className="w-full py-4 border border-gray-200 bg-white text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors">← Back to Results</button>
      </div>
      {activeModal && <MethodologyModal content={activeModal} onClose={() => setActiveModal(null)}/>}
    </div>
  );
};

export default function App() {
  const [page, setPage] = useState('landing');
  const [showSuffernModal, setShowSuffernModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showMemoryPassage, setShowMemoryPassage] = useState(false);
  const [isSuffernMode, setIsSuffernMode] = useState(false);

  const handleStart = () => { setPage('test'); };
  const handleMemoryContinue = () => setShowMemoryPassage(false);
  const handleAnswer = (answerIndex) => {
    const newAnswers = {...answers, [currentQuestion]: answerIndex};
    setAnswers(newAnswers);
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        // Show memory passage before question 17 (index 16)
        if (currentQuestion === 15) {
          setShowMemoryPassage(true);
        }
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setPage('results');
      }
    }, 300);
  };
  const handleSuffernConfirm = () => { setShowSuffernModal(false); setIsSuffernMode(true); setPage('suffernResults'); };

  return (
    <>
      <Analytics />
      {page === 'landing' && (
        <>
          <LandingPage onStart={handleStart} onSuffernAccess={() => setShowSuffernModal(true)}/>
          {showSuffernModal && <SuffernModal onConfirm={handleSuffernConfirm} onCancel={() => setShowSuffernModal(false)}/>}
        </>
      )}
      {page === 'test' && (
        showMemoryPassage ? <MemoryPassagePage onContinue={handleMemoryContinue}/> : <QuestionPage question={questions[currentQuestion]} questionNumber={currentQuestion + 1} totalQuestions={questions.length} onAnswer={handleAnswer} selectedAnswer={answers[currentQuestion]}/>
      )}
      {page === 'results' && <ResultsPage answers={answers} onViewMethodology={() => setPage('methodology')}/>}
      {page === 'suffernResults' && <SuffernResultsPage onViewMethodology={() => setPage('methodology')}/>}
      {page === 'methodology' && <MethodologyPage onBack={() => setPage(isSuffernMode ? 'suffernResults' : 'results')}/>}
    </>
  );
}
