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
  {id:35,category:"Processing Efficiency",difficulty:"Hard",question:"A rectangle has a perimeter of 36 cm. If the length is twice the width, what is the area?",options:["54 cm²","62 cm²","72 cm²","81 cm²"],correct:2,weights:{processing:85,analytical:15},timed:true,correctIndicates:"Rapidly sets up and solves algebraic relationships. Excellent processing under complexity.",incorrectIndicates:"May struggle with multi-step geometric calculations under time pressure."},
  // STEALTH Q36: Attention Check - extremely easy, buried in middle
  {id:36,category:"Processing Efficiency",difficulty:"Easy",question:"This question checks basic attention. What is 12 + 5?",options:["17","18","16","15"],correct:0,weights:{},isAttentionCheck:true,correctIndicates:"Passed attention check.",incorrectIndicates:"Failed basic attention check."},
  // STEALTH Q37: Consistency Check - rephrased version of Q5 (categorical logic)
  {id:37,category:"Analytical Reasoning",difficulty:"Medium",question:"Every X is a Y. Some Y are Z. Which must be true?",options:["Every X is a Z","Some X might be Z","No X is a Z","Every Z is an X"],correct:1,weights:{analytical:50},consistencyPairWith:5,correctIndicates:"Consistent logical reasoning.",incorrectIndicates:"May apply logic inconsistently."},
  // STEALTH Q38: Metacognition Probe
  {id:38,category:"Adaptive Thinking",difficulty:"Easy",question:"Reflecting on the rule-switching questions earlier (where rules changed multiple times), how confident are you in your answers to those questions?",options:["Very confident - I tracked all rule changes clearly","Somewhat confident - I think I got most right","Not confident - I found it confusing","I mostly guessed"],correct:-1,weights:{},isMetacognition:true,correctIndicates:"N/A",incorrectIndicates:"N/A"},
  // STEALTH Q39: Anchoring Bias Test
  {id:39,category:"Analytical Reasoning",difficulty:"Medium",question:"Research shows 78% of employees report preferring collaborative work environments. What percentage of employees do you think actually perform better in collaborative versus independent settings?",options:["75-85% (similar to preference)","40-60% (it varies significantly)","Over 90% (collaboration is usually better)","Under 30% (most work better alone)"],correct:1,weights:{analytical:30},isAnchoringTest:true,anchoredAnswer:0,correctIndicates:"Independent critical thinking - not anchored to given statistic.",incorrectIndicates:"May be susceptible to anchoring bias."},
  // STEALTH Q40: Delayed Memory Recall (from the memo, at the very end)
  {id:40,category:"Working Memory",difficulty:"Hard",question:"Thinking back to the company memo from earlier in the assessment: What was the budget allocation for the merged Innovation Hub division?",options:["$3.8 million","$4.2 million","$4.5 million","$5.1 million"],correct:1,weights:{memory:40},isDelayedRecall:true,correctIndicates:"Excellent long-term retention.",incorrectIndicates:"Information decay - short-term memory didn't consolidate."},
  // STEALTH Q41: Honesty/Social Desirability Check
  {id:41,category:"Analytical Reasoning",difficulty:"Medium",question:"An employee realizes they accidentally received a $500 overpayment in their paycheck. Based on organizational ethics research, the most professionally sound response is:",options:["Say nothing - it's the company's error","Mention it casually if asked","Report it immediately to payroll","Wait to see if anyone notices first"],correct:2,weights:{analytical:20},isHonestyCheck:true,sociallyDesirableWrong:0,correctIndicates:"Strong ethical reasoning.",incorrectIndicates:"May rationalize ethical shortcuts."},
  // Q42: Frustration Tolerance / Persistence Test (deliberately very hard)
  {id:42,category:"Pattern Recognition",difficulty:"Hard",question:"In the sequence 1, 11, 21, 1211, 111221, 312211, what comes next? (This is a 'look-and-say' sequence where each term describes the previous term.)",options:["13112221","212221","111222","1113213211"],correct:0,weights:{pattern:60},isFrustrationTest:true,correctIndicates:"Exceptional pattern recognition and persistence with novel challenges.",incorrectIndicates:"May struggle with highly abstract or unfamiliar problem types."}
];

// Algorithm Configuration Constants
const ALGORITHM_CONFIG = {
  // Expected time per question by difficulty (milliseconds)
  expectedTime: { Easy: 20000, Medium: 35000, Hard: 50000 },
  
  // Time confidence multipliers
  timeConfidence: {
    tooFast: { threshold: 0.25, multiplier: 0.6 },      // <25% of expected = likely guessing
    fast: { threshold: 0.5, multiplier: 1.1 },          // 50% of expected = confident
    normal: { threshold: 1.5, multiplier: 1.0 },        // Normal range
    slow: { threshold: 2.5, multiplier: 0.95 },         // Slow but thoughtful
    verySlowCorrect: { multiplier: 1.05 },              // Very slow but got it right = effortful success
    verySlowWrong: { multiplier: 0.85 }                 // Very slow and wrong = genuine difficulty
  },
  
  // IRT difficulty weights
  difficultyWeight: { Easy: 0.8, Medium: 1.0, Hard: 1.3 },
  
  // Stealth question indices (0-indexed)
  stealthQuestions: {
    attentionCheck: 35,      // Q36
    consistencyCheck: 36,    // Q37 (pairs with Q5, index 4)
    consistencyPairWith: 4,  // Q5
    metacognition: 37,       // Q38
    anchoringTest: 38,       // Q39
    delayedRecall: 39,       // Q40
    honestyCheck: 40,        // Q41
    frustrationTest: 41      // Q42
  },
  
  // Category question indices for trajectory analysis (0-indexed)
  categoryIndices: {
    analytical: [0, 1, 2, 3, 4, 5, 6, 7, 36, 38, 40],
    pattern: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 41],
    memory: [18, 19, 20, 21, 22, 23, 24, 39],
    adaptive: [25, 26, 27, 28, 29, 30, 31, 37],
    processing: [32, 33, 34, 35]
  },
  
  // Question dependencies for skill ceiling detection
  dependencies: {
    5: [0, 4],      // Q6 depends on Q1 and Q5
    7: [1, 3],      // Q8 depends on Q2 and Q4
    16: [8, 13],    // Q17 depends on Q9 and Q14
    30: [25, 27],   // Q31 depends on Q26 and Q28
    31: [30]        // Q32 depends on Q31
  }
};

// Advanced Analysis Functions
const analyzeResponseTime = (timeMs, difficulty, isCorrect) => {
  const expected = ALGORITHM_CONFIG.expectedTime[difficulty];
  const ratio = timeMs / expected;
  const tc = ALGORITHM_CONFIG.timeConfidence;
  
  let confidence = 1.0;
  let interpretation = 'normal';
  
  if (ratio < tc.tooFast.threshold) {
    confidence = tc.tooFast.multiplier;
    interpretation = isCorrect ? 'quick_correct' : 'likely_guess';
  } else if (ratio < tc.fast.threshold) {
    confidence = tc.fast.multiplier;
    interpretation = 'confident';
  } else if (ratio < tc.normal.threshold) {
    confidence = tc.normal.multiplier;
    interpretation = 'normal';
  } else if (ratio < tc.slow.threshold) {
    confidence = tc.slow.multiplier;
    interpretation = 'methodical';
  } else {
    confidence = isCorrect ? tc.verySlowCorrect.multiplier : tc.verySlowWrong.multiplier;
    interpretation = isCorrect ? 'effortful_success' : 'genuine_difficulty';
  }
  
  return { confidence, interpretation, ratio };
};

const analyzeAnswerPatterns = (answers) => {
  const patterns = {
    sameAnswerStreak: 0,
    alternatingPattern: false,
    positionBias: { 0: 0, 1: 0, 2: 0, 3: 0 },
    suspicious: false,
    details: []
  };
  
  // Check for same-answer streaks
  let currentStreak = 1;
  let maxStreak = 1;
  for (let i = 1; i < Object.keys(answers).length; i++) {
    if (answers[i] === answers[i-1]) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  patterns.sameAnswerStreak = maxStreak;
  
  // Check position bias
  Object.values(answers).forEach(a => {
    if (a >= 0 && a <= 3) patterns.positionBias[a]++;
  });
  const total = Object.keys(answers).length;
  const maxBias = Math.max(...Object.values(patterns.positionBias));
  
  // Check for alternating pattern (ABAB...)
  let alternating = 0;
  for (let i = 2; i < Object.keys(answers).length; i++) {
    if (answers[i] === answers[i-2] && answers[i] !== answers[i-1]) {
      alternating++;
    }
  }
  patterns.alternatingPattern = alternating > total * 0.4;
  
  // Determine if suspicious
  if (maxStreak >= 6) {
    patterns.suspicious = true;
    patterns.details.push(`Same answer chosen ${maxStreak} times in a row`);
  }
  if (maxBias > total * 0.45) {
    patterns.suspicious = true;
    const biasedPosition = Object.entries(patterns.positionBias).find(([_, v]) => v === maxBias)[0];
    patterns.details.push(`Strong position bias toward option ${String.fromCharCode(65 + parseInt(biasedPosition))}`);
  }
  if (patterns.alternatingPattern) {
    patterns.suspicious = true;
    patterns.details.push('Alternating answer pattern detected');
  }
  
  return patterns;
};

const analyzeTrajectory = (answers, questions, categoryIndices) => {
  const trajectories = {};
  
  Object.entries(categoryIndices).forEach(([category, indices]) => {
    const validIndices = indices.filter(i => answers[i] !== undefined && questions[i] && !questions[i].isMetacognition);
    if (validIndices.length < 4) {
      trajectories[category] = { trend: 'insufficient_data', firstHalf: 0, secondHalf: 0 };
      return;
    }
    
    const midpoint = Math.floor(validIndices.length / 2);
    const firstHalf = validIndices.slice(0, midpoint);
    const secondHalf = validIndices.slice(midpoint);
    
    const firstCorrect = firstHalf.filter(i => answers[i] === questions[i].correct).length / firstHalf.length;
    const secondCorrect = secondHalf.filter(i => answers[i] === questions[i].correct).length / secondHalf.length;
    
    let trend = 'stable';
    if (secondCorrect - firstCorrect > 0.2) trend = 'improving';
    else if (firstCorrect - secondCorrect > 0.2) trend = 'declining';
    
    trajectories[category] = {
      trend,
      firstHalf: Math.round(firstCorrect * 100),
      secondHalf: Math.round(secondCorrect * 100),
      change: Math.round((secondCorrect - firstCorrect) * 100)
    };
  });
  
  return trajectories;
};

const analyzeStealthQuestions = (answers, questions, questionTimes) => {
  const config = ALGORITHM_CONFIG.stealthQuestions;
  const results = {
    attentionCheck: { passed: true, concern: null },
    consistencyCheck: { passed: true, concern: null },
    metacognition: { response: null, calibration: null },
    anchoringBias: { detected: false, concern: null },
    delayedRecall: { passed: true, concern: null },
    honestyCheck: { passed: true, concern: null },
    frustrationTolerance: { score: 'normal', timeSpent: 0 },
    overallValidity: 'high'
  };
  
  // Attention Check (Q36, index 35)
  if (answers[config.attentionCheck] !== undefined) {
    const q = questions[config.attentionCheck];
    if (answers[config.attentionCheck] !== q.correct) {
      results.attentionCheck.passed = false;
      results.attentionCheck.concern = 'Failed basic arithmetic attention check';
    }
  }
  
  // Consistency Check (Q37 vs Q5)
  const q5Answer = answers[config.consistencyPairWith];
  const q37Answer = answers[config.consistencyCheck];
  if (q5Answer !== undefined && q37Answer !== undefined) {
    // Q5 correct = 1 (Some lawyers cannot be trusted)
    // Q37 correct = 1 (Some X might be Z)
    // Both test same logical structure - if one right and one wrong, inconsistent
    const q5Correct = q5Answer === 1;
    const q37Correct = q37Answer === 1;
    if (q5Correct !== q37Correct) {
      results.consistencyCheck.passed = false;
      results.consistencyCheck.concern = 'Inconsistent responses on equivalent logic problems';
    }
  }
  
  // Metacognition (Q38, index 37)
  if (answers[config.metacognition] !== undefined) {
    results.metacognition.response = answers[config.metacognition];
    // Compare confidence to actual adaptive performance
    const adaptiveIndices = [25, 26, 27, 28, 29, 30, 31];
    const adaptiveCorrect = adaptiveIndices.filter(i => 
      answers[i] !== undefined && questions[i] && answers[i] === questions[i].correct
    ).length;
    const adaptiveAccuracy = adaptiveCorrect / adaptiveIndices.length;
    
    // 0 = Very confident, 1 = Somewhat, 2 = Not confident, 3 = Guessed
    const confidence = answers[config.metacognition];
    if (confidence === 0 && adaptiveAccuracy < 0.5) {
      results.metacognition.calibration = 'overconfident';
    } else if (confidence >= 2 && adaptiveAccuracy > 0.7) {
      results.metacognition.calibration = 'underconfident';
    } else {
      results.metacognition.calibration = 'well_calibrated';
    }
  }
  
  // Anchoring Bias (Q39, index 38)
  if (answers[config.anchoringTest] !== undefined) {
    if (answers[config.anchoringTest] === 0) { // Chose 75-85% (anchored to 78%)
      results.anchoringBias.detected = true;
      results.anchoringBias.concern = 'Susceptible to anchoring - accepted given statistic without critical evaluation';
    }
  }
  
  // Delayed Recall (Q40, index 39)
  if (answers[config.delayedRecall] !== undefined) {
    const q = questions[config.delayedRecall];
    if (answers[config.delayedRecall] !== q.correct) {
      results.delayedRecall.passed = false;
      results.delayedRecall.concern = 'Information decay - details from earlier passage not retained';
    }
  }
  
  // Honesty Check (Q41, index 40)
  if (answers[config.honestyCheck] !== undefined) {
    if (answers[config.honestyCheck] === 0) { // "Say nothing"
      results.honestyCheck.passed = false;
      results.honestyCheck.concern = 'May rationalize ethical shortcuts when convenient';
    }
  }
  
  // Frustration Tolerance (Q42, index 41)
  if (questionTimes && questionTimes[config.frustrationTest]) {
    const timeSpent = questionTimes[config.frustrationTest];
    results.frustrationTolerance.timeSpent = timeSpent;
    
    if (timeSpent < 5000) {
      results.frustrationTolerance.score = 'low';
    } else if (timeSpent < 15000) {
      results.frustrationTolerance.score = 'moderate';
    } else {
      results.frustrationTolerance.score = 'high';
    }
  }
  
  // Calculate overall validity
  let validityConcerns = 0;
  if (!results.attentionCheck.passed) validityConcerns += 2;
  if (!results.consistencyCheck.passed) validityConcerns += 1;
  if (results.metacognition.calibration === 'overconfident') validityConcerns += 0.5;
  
  if (validityConcerns >= 2) results.overallValidity = 'low';
  else if (validityConcerns >= 1) results.overallValidity = 'moderate';
  else results.overallValidity = 'high';
  
  return results;
};

const analyzeSkillCeilings = (answers, questions) => {
  const ceilings = [];
  const deps = ALGORITHM_CONFIG.dependencies;
  
  Object.entries(deps).forEach(([advancedIdx, prereqIndices]) => {
    const idx = parseInt(advancedIdx);
    const advancedCorrect = answers[idx] === questions[idx]?.correct;
    const prereqsCorrect = prereqIndices.every(i => answers[i] === questions[i]?.correct);
    
    if (prereqsCorrect && !advancedCorrect) {
      ceilings.push({
        question: questions[idx]?.id,
        category: questions[idx]?.category,
        message: `Mastered prerequisites but struggled with Q${questions[idx]?.id} - potential skill ceiling identified`
      });
    }
  });
  
  return ceilings;
};

const memoryPassage = {title:"Meridian Technologies Company Memo",content:'Meridian Technologies has announced organizational changes effective Q3. The Engineering division, led by Director Priya Sharma, will merge with the Product team under the new "Innovation Hub." The merger affects 127 employees across three offices: Seattle (58 employees), Austin (42 employees), and Boston (27 employees). Budget allocation for the merged division is $4.2 million, a 15% increase from the combined previous budgets. New reporting structure: all team leads report to Priya Sharma, who reports directly to CEO Marcus Chen. The transition timeline is 90 days, with Phase 1 (communication) lasting 2 weeks, Phase 2 (structural changes) lasting 6 weeks, and Phase 3 (integration) lasting 4 weeks.'};

const methodologyContent = {
  audience:{title:"Target Audience",icon:"👥",content:"**Target Age Range:** 18-65 years old (working-age adults eligible for employment)\n\n**Psychometric Justification:**\n\n**Cognitive Stability in Adulthood:** Research indicates that fluid intelligence reaches peak development in early adulthood and remains relatively stable through middle adulthood before gradual decline in later years (Salthouse, 2009). The 18-65 range captures the period when cognitive abilities are sufficiently developed and stable to produce reliable and valid psychometric measurements.\n\n**Legal and Practical Considerations:** Age 18 represents the legal threshold for employment in most professional contexts and the age at which individuals have typically completed secondary education, ensuring a baseline of test-taking familiarity. The upper bound of 65 aligns with standard employment age ranges while acknowledging that cognitive assessments remain valid predictors across the adult lifespan.\n\n**Norm Development:** Standardization procedures will establish age-stratified norms (e.g., 18-25, 26-35, 36-45, 46-55, 56-65) to account for documented age-related variations in processing speed and working memory. This ensures that candidate scores are compared against appropriate reference groups, maintaining test fairness and validity across the full age range.\n\n**Purpose Alignment:** As a pre-employment assessment, JICA must be designed for the population it serves: job applicants across career stages. Restricting the age range unnecessarily would limit the test's utility and potentially raise legal concerns regarding age discrimination in hiring."},
  classification:{title:"Test Classification",icon:"📋",content:"**Classification:** JICA is classified as an **aptitude test**.\n\n**Evidence-Based Rationale:**\n\nAptitude tests measure potential for future learning and performance, while achievement tests measure mastery of previously learned content. JICA is designed as an aptitude test for several key reasons:\n\n**Focus on Capacity, Not Content:** JICA items are intentionally designed to minimize reliance on specific prior knowledge. Pattern recognition tasks, abstract reasoning problems, and novel problem-solving scenarios assess how candidates think rather than what they have previously learned.\n\n**Predictive Purpose:** The explicit goal of JICA is to predict future job performance and learning potential—hallmarks of aptitude testing. Research by Schmidt and Hunter (2004) demonstrates that general cognitive ability tests have validity coefficients of approximately .51 for predicting job performance across occupations.\n\n**Fluid Intelligence Emphasis:** By emphasizing fluid intelligence (Gf) over crystallized intelligence (Gc), JICA measures innate reasoning capacity that develops relatively independently of formal education. Carroll's (1993) three-stratum theory supports that Gf is more closely associated with learning potential.\n\n**Practical Implication:** As an aptitude test, JICA provides HR with insight into a candidate's capacity to learn job-specific skills during onboarding and to adapt as role requirements evolve."},
  purpose:{title:"Purpose & Application",icon:"🎯",content:"**Primary Purpose:** The J-Industries Cognitive Assessment (JICA) is a pre-employment cognitive screening tool designed to evaluate foundational mental abilities that predict workplace success across all roles and departments.\n\n**What It Measures:**\n\nRather than testing job-specific knowledge or technical skills, JICA assesses the underlying cognitive capabilities that enable employees to learn, adapt, and solve problems effectively in any professional context:\n\n• **Problem Solving** — Ability to analyze novel situations, identify patterns, and reach logical conclusions\n• **Information Retention** — Capacity to hold and recall information without reference materials\n• **Adaptive Learning** — Ability to apply feedback and adjust approach when circumstances change\n• **Processing Efficiency** — Speed and accuracy under time pressure\n\n**Role-Fit Analysis:**\n\nJICA now includes role-specific profiling that matches cognitive profiles to job requirements. Different roles prioritize different cognitive abilities, and the system provides fit scores for:\n• Data Analyst (emphasizes analytical + pattern recognition)\n• Software Developer (emphasizes pattern + adaptive thinking)\n• Manager (emphasizes adaptive + memory)\n• Customer Service (emphasizes adaptive + memory)\n• Creative Roles (emphasizes pattern + adaptive)\n\n**Cognitive Style Profiling:**\n\nBeyond raw scores, JICA infers behavioral tendencies from problem-solving patterns, including thinking style, adaptability, attention to detail, pressure response, and learning speed.\n\n**End-Users:**\n\nThe primary end-users are HR professionals and hiring managers at J-Industries. They receive a multi-dimensional profile of each candidate showing relative strengths across cognitive domains, role-fit recommendations, and behavioral insights."},
  theoretical:{title:"Theoretical Foundation",icon:"🧠",content:"**Theoretical Framework:**\n\nJICA is grounded in the **Cattell-Horn-Carroll (CHC) theory** of cognitive abilities, specifically drawing on the distinction between fluid intelligence (Gf) and crystallized intelligence (Gc), while incorporating elements of working memory capacity from Baddeley's model.\n\n**Core Constructs Measured:**\n\n**1. Fluid Intelligence (Gf):** The ability to reason, identify patterns, and solve novel problems independent of previously acquired knowledge. This includes:\n• Inductive reasoning (identifying rules from examples)\n• Deductive reasoning (applying rules to reach conclusions)\n• Abstract pattern recognition\n\n**2. Working Memory:** The capacity to hold, manipulate, and retrieve information over short periods during cognitive tasks.\n\n**3. Adaptive Learning:** The ability to integrate feedback and apply new information to improve performance within the assessment itself.\n\n**4. Processing Speed:** The ability to perform cognitive tasks quickly and accurately, particularly under time pressure.\n\n**Why This Framework?**\n\nResearch consistently shows that fluid intelligence is the single best cognitive predictor of job performance across occupations (Schmidt & Hunter, 1998), while working memory capacity underlies the ability to manage complex tasks and learn new information efficiently.\n\n**Cognitive Style Inference:**\n\nBased on patterns of responding (not just accuracy), JICA infers behavioral tendencies such as methodical vs. intuitive thinking, adaptability to change, attention to detail, and performance under pressure. These inferences are based on response patterns rather than self-report, providing behavioral evidence of cognitive style."},
  psychometric:{title:"Psychometric Properties",icon:"📊",content:"**Standardization Procedures:**\n\n**Representative Norming Sample:** JICA requires administration to a minimum of 2,000 participants stratified by age (18-25, 26-35, 36-45, 46-55, 56-65), gender, education level, geographic region, and industry background.\n\n**Uniform Administration:** All test administrations follow identical procedures—browser-based delivery, scripted on-screen instructions, programmatic timing enforcement, and recommended testing conditions.\n\n**Norm Establishment:** From the norming sample, mean, standard deviation, and percentile ranks (1st-99th) are calculated for each category and composite score.\n\n---\n\n**Reliability Procedures:**\n\n**Internal Consistency (Cronbach's Alpha):** Target α ≥ .80 for each subscale; α ≥ .85 for total score.\n\n**Split-Half Reliability:** Items divided into matched halves, correlation calculated with Spearman-Brown correction. Target: ≥ .80.\n\n**Test-Retest Reliability:** Subset of 300 participants tested twice with 2-4 week interval. Target: r ≥ .75 for subscales; r ≥ .80 for total score.\n\n**Consistency Analysis:** Performance across difficulty levels is analyzed to detect response patterns indicative of guessing, fatigue, or inattention.\n\n---\n\n**Validity Procedures:**\n\n**Content Validity:** Panel of 5-7 subject matter experts rate each item for relevance, clarity, and appropriateness. Target Content Validity Index (CVI) ≥ .90.\n\n**Construct Validity:**\n• Convergent: JICA scores correlated with Raven's Progressive Matrices (target r ≥ .60), Wechsler Digit Span (r ≥ .55), Wonderlic (r ≥ .65)\n• Discriminant: Low correlations with personality measures (r < .30)\n• Factor Analysis: Confirmatory factor analysis verifying five-factor structure (CFI ≥ .95, RMSEA ≤ .06)\n\n**Criterion-Related Validity:**\n• Predictive study: 500 hired candidates assessed, correlated with 6-12 month performance ratings (target r ≥ .30)\n• Concurrent study: 300 current employees, correlated with existing performance data\n\n**Confidence Intervals:** All scores are reported with margin of error (±) based on standard error of measurement, acknowledging that a single test administration provides an estimate, not a precise value."},
  biasMitigation:{title:"Bias Mitigation",icon:"⚖️",content:"**Understanding Stereotype Threat:**\n\nStereotype threat occurs when individuals are aware of negative stereotypes about their group's intellectual abilities, leading to anxiety that impairs performance (Steele & Aronson, 1995). Stereotype lift is the complementary effect where non-stereotyped groups experience performance boosts.\n\n---\n\n**Test Design Elements:**\n\n**1. Reframing the Assessment:** JICA is framed as a \"problem-solving exercise\" rather than an \"intelligence test.\" Research shows this reduces stereotype threat effects by ~0.3 standard deviations (Walton & Spencer, 2009).\n\n**2. Growth Mindset Priming:** Candidates read a brief passage explaining cognitive skills are malleable and improve with practice (Dweck, 2006).\n\n**3. Self-Affirmation:** Before testing, candidates select and briefly write about a personal value important to them. This intervention reduced racial achievement gaps by 40% in Cohen et al. (2006).\n\n**4. Demographics After Testing:** Any demographic questions are collected AFTER test completion. Stricker & Ward (2004) showed this improves performance among stereotyped groups.\n\n**5. Culturally Neutral Content:** All items minimize reliance on culturally-specific knowledge. Differential Item Functioning (DIF) analysis identifies and removes biased items.\n\n---\n\n**Response Pattern Controls:**\n\n**6. Answer Option Randomization:** Answer choices (A, B, C, D) are randomly shuffled for each question on each test administration. This prevents:\n• Pattern memorization from prior test-takers\n• Position bias (tendency to select middle options)\n• Strategic guessing based on answer distribution\n• Cheating through answer-position sharing\n\nThe system maps displayed positions to correct answers internally, ensuring accurate scoring regardless of shuffle order.\n\n**7. Rush Detection & Validity Screening:** JICA monitors response timing to detect potentially invalid administrations:\n• **Severe concern:** <5 minutes total or >10 questions answered in <3 seconds\n• **Moderate concern:** <10 minutes total or >15 questions answered in <5 seconds\n• **Mild note:** Average <8 seconds per question\n\nResults flagged as rushed display prominent warnings indicating reduced validity. This prevents gaming the system and identifies candidates who may not have engaged authentically.\n\n---\n\n**Administrative Procedures:**\n\n**8. Practice Items:** Each section begins with unscored practice items to reduce initial anxiety.\n\n**9. Transparent Feedback:** Detailed results shift attribution from fixed ability to specific, developable skills.\n\n**10. Adverse Impact Monitoring:** Quarterly analysis using the 4/5ths rule (EEOC guidelines) with corrective action if disparities emerge.\n\n**11. Consistency Analysis:** Performance across difficulty levels is analyzed. Unusual patterns (e.g., missing easy questions while getting hard ones correct) are flagged as potential indicators of inattention, guessing, or other validity concerns."},
  algorithm:{title:"Scoring Algorithm",icon:"⚙️",content:"**Step 1: Response Scoring with IRT Weighting**\nEach question scored dichotomously: correct = 1 point, incorrect = 0 points. No penalty for guessing.\n\n**Item Response Theory (IRT) Difficulty Multipliers:**\n• Easy questions: 0.8× weight (less informative when correct)\n• Medium questions: 1.0× weight (baseline)\n• Hard questions: 1.3× weight (more informative when correct)\n\nThis means getting a Hard question right contributes more to your score than an Easy question, reflecting the greater ability required.\n\n**Step 2: Category Weight Application**\nEach question has predefined category weights summing to 100%. Correct answers distribute IRT-weighted points across categories.\n\n*Example:* Hard question with 70% Analytical, 30% Pattern weights → correct answer gives AR 0.91 points (0.70 × 1.3), PR 0.39 points (0.30 × 1.3).\n\n**Step 3: Raw Category Scores**\nSum IRT-weighted points per category across all questions.\n\n**Step 4: Percentile Conversion**\nRaw scores converted to percentiles using norm tables from standardization sample.\n\n**Step 5: Role-Specific Composite Scores**\nDifferent roles use different category weights:\n• **General:** AR 25% | PR 20% | WM 20% | AT 20% | PE 15%\n• **Data Analyst:** AR 35% | PR 30% | WM 15% | AT 10% | PE 10%\n• **Developer:** AR 25% | PR 35% | WM 10% | AT 20% | PE 10%\n• **Manager:** AR 20% | PR 10% | WM 25% | AT 30% | PE 15%\n• **Customer Service:** AR 10% | PR 10% | WM 30% | AT 35% | PE 15%\n• **Creative:** AR 15% | PR 35% | WM 15% | AT 25% | PE 10%\n\n**Step 6: Critical Threshold Check**\n• Analytical Reasoning: 25th percentile minimum\n• Pattern Recognition: 20th percentile minimum\n• Working Memory: 25th percentile minimum\n• Adaptive Thinking: 30th percentile minimum (highest—inability to adapt is most problematic)\n• Processing Efficiency: 15th percentile minimum\n\n**Step 7: Red Flag Detection**\nAutomatic flagging of concerning patterns:\n• Very low scores (<20th) in any category\n• Inconsistent difficulty performance (e.g., better on Hard than Easy)\n• Specific cognitive combinations (e.g., high analytical but low processing)\n• Adaptive section transition failures\n\n**Step 8: Consistency Analysis**\nPerformance across Easy/Medium/Hard questions is compared. Consistent patterns (Easy > Medium > Hard) indicate reliable results. Inconsistent patterns suggest caution in interpretation.\n\n**Step 9: Confidence Interval Calculation**\nMargin of error calculated as: ±(15 / √n × 2) where n = number of questions.\nWith 35 questions: approximately ±5 points.\n\n**Step 10: Recommendation**\n• **STRONG HIRE:** Composite ≥ 75th, no threshold breaches, no high-severity flags\n• **RECOMMEND HIRE:** Composite 50th-74th, no threshold breaches, no high-severity flags\n• **CONDITIONAL:** Composite 35th-49th, or one threshold breach, or medium-severity flags\n• **DO NOT RECOMMEND:** Composite < 35th, or multiple threshold breaches, or multiple high-severity flags\n\n**Step 11: Cognitive Style Inference**\nBehavioral tendencies inferred from response patterns:\n• Thinking Style (methodical vs. intuitive)\n• Adaptability (structured vs. flexible)\n• Attention to Detail (big-picture vs. detail-focused)\n• Pressure Response (careful vs. quick)\n• Learning Curve (gradual vs. rapid)\n• Analytical Depth (practical vs. theoretical)\n\n**Step 12: Rationale Generation**\nNatural language summary identifying strengths (>65th), adequate areas (35th-65th), and concerns (<35th) with practical implications for job performance and role fit."}
};

const categoryNames = {analytical:"Analytical Reasoning",pattern:"Pattern Recognition",memory:"Working Memory",adaptive:"Adaptive Thinking",processing:"Processing Efficiency"};

const LandingPage = ({onStart,onSuffernAccess}) => (
  <div className="h-screen bg-white flex flex-col overflow-hidden">
    <header className="border-b border-gray-100 flex-shrink-0">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-base font-semibold">J</span>
          </div>
          <div>
            <div className="text-slate-900 font-semibold tracking-tight text-sm">J-Industries</div>
            <div className="text-slate-400 text-xs tracking-wide uppercase">Talent Assessment</div>
          </div>
        </div>
      </div>
    </header>
    <main className="flex-1 flex items-center overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-6 w-full">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-block px-3 py-1 bg-slate-100 rounded-full text-slate-600 text-xs font-medium mb-4">Cognitive Assessment Platform</div>
            <h1 className="text-4xl font-light text-slate-900 leading-tight mb-4 tracking-tight">Discover your<br/><span className="font-semibold">cognitive profile</span></h1>
            <p className="text-lg text-slate-500 leading-relaxed mb-6 font-light">A comprehensive assessment measuring problem-solving, information retention, adaptive thinking, and processing efficiency.</p>
            <button onClick={onStart} className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors text-sm">Begin Assessment<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg></button>
            <p className="mt-4 text-xs text-slate-400">Approximately 20-30 minutes to complete</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-6">
            <div className="text-center mb-4">
              <a href="https://jicaapp.tech" className="group relative inline-block px-5 py-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-slate-300 active:scale-95 hover:animate-wiggle">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100 to-transparent opacity-60 animate-sheen"></div>
                <span className="relative text-xl tracking-tight flex items-center justify-center">
                  <span className="font-bold text-blue-600 animate-pulse-subtle">J</span>
                  <span className="font-medium text-slate-700">ica</span>
                  <span className="font-bold text-blue-600 animate-pulse-subtle">A</span>
                  <span className="font-medium text-slate-700">pp</span>
                  <span className="font-light text-slate-400">.tech</span>
                </span>
              </a>
              <div className="mt-2 h-8 flex items-center justify-center">
                <div className="animate-morph-container relative">
                  <div className="animate-pill-bg absolute inset-0 rounded-full"></div>
                  <span className="relative inline-flex items-center text-xs tracking-wide">
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
                padding: 4px 12px;
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
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3"><div className="text-3xl font-light text-slate-900 mb-1">35</div><div className="text-xs text-slate-500 uppercase tracking-wide">Questions</div></div>
              <div className="text-center p-3"><div className="text-3xl font-light text-slate-900 mb-1">5</div><div className="text-xs text-slate-500 uppercase tracking-wide">Categories</div></div>
              <div className="text-center p-3"><div className="text-3xl font-light text-slate-900 mb-1">20</div><div className="text-xs text-slate-500 uppercase tracking-wide">Minutes Avg</div></div>
              <div className="text-center p-3"><div className="text-3xl font-light text-slate-900 mb-1">1</div><div className="text-xs text-slate-500 uppercase tracking-wide">Profile</div></div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 leading-relaxed text-center">Research shows that cognitive skills develop with experience and practice. Your results reflect your current profile, which evolves over time.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer className="border-t border-gray-100 flex-shrink-0">
      <div className="max-w-6xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <p className="text-xs text-slate-400">Designed by Jonathan Shiell for AP Psychology</p>
          <span className="hidden sm:block text-slate-300">•</span>
          <a href="https://jicaapp.tech" className="text-xs hover:text-slate-700 font-medium transition-colors"><span className="text-blue-500 font-semibold">J</span><span className="text-slate-500">ica</span><span className="text-blue-500 font-semibold">A</span><span className="text-slate-500">pp.tech</span></a>
        </div>
        <button onClick={onSuffernAccess} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Instructor Access →</button>
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

const ResultsPage = ({answers, questionTimes, totalTestTime, onViewMethodology}) => {
  const [selectedRole, setSelectedRole] = useState('general');
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  
  // Rush detection thresholds
  const MIN_SECONDS_PER_QUESTION = 3; // Less than 3 seconds is definitely rushing
  const MIN_TOTAL_TEST_TIME = 5 * 60 * 1000; // 5 minutes minimum for 35 questions
  const EXPECTED_MIN_TIME = 10 * 60 * 1000; // 10 minutes is reasonable minimum
  
  // Analyze timing data
  const timingAnalysis = useMemo(() => {
    if (!questionTimes || !totalTestTime) return { isRushed: false, rushLevel: 'none' };
    
    const times = Object.values(questionTimes);
    const avgTimePerQuestion = times.reduce((a, b) => a + b, 0) / times.length;
    const questionsUnder3Sec = times.filter(t => t < 3000).length;
    const questionsUnder5Sec = times.filter(t => t < 5000).length;
    
    // Determine rush level
    let rushLevel = 'none';
    let isRushed = false;
    let message = '';
    
    if (totalTestTime < MIN_TOTAL_TEST_TIME || questionsUnder3Sec > 10) {
      rushLevel = 'severe';
      isRushed = true;
      message = `This assessment was completed in ${Math.round(totalTestTime / 1000)} seconds (${Math.round(totalTestTime / 60000)} minutes), with ${questionsUnder3Sec} questions answered in under 3 seconds. These results are unlikely to represent the candidate's true cognitive abilities and should not be used for hiring decisions.`;
    } else if (totalTestTime < EXPECTED_MIN_TIME || questionsUnder5Sec > 15) {
      rushLevel = 'moderate';
      isRushed = true;
      message = `This assessment was completed faster than expected (${Math.round(totalTestTime / 60000)} minutes). ${questionsUnder5Sec} questions were answered in under 5 seconds. Results should be interpreted with caution.`;
    } else if (avgTimePerQuestion < 8000) {
      rushLevel = 'mild';
      isRushed = false;
      message = `Assessment completed at a quick pace. Results appear valid but the candidate may benefit from a more deliberate approach.`;
    }
    
    return {
      isRushed,
      rushLevel,
      message,
      totalTimeSeconds: Math.round(totalTestTime / 1000),
      totalTimeMinutes: Math.round(totalTestTime / 60000 * 10) / 10,
      avgTimePerQuestion: Math.round(avgTimePerQuestion / 1000 * 10) / 10,
      questionsUnder3Sec,
      questionsUnder5Sec
    };
  }, [questionTimes, totalTestTime]);
  
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
    
    // Track time-confidence weighted scores
    const timeWeightedScores = {analytical:0,pattern:0,memory:0,adaptive:0,processing:0};
    const responsePatterns = { fastCorrect: 0, fastWrong: 0, slowCorrect: 0, slowWrong: 0 };
    
    questions.forEach((q, i) => {
      // Skip stealth questions from main scoring (they have empty weights or special handling)
      if (q.isMetacognition || q.isAttentionCheck && Object.keys(q.weights).length === 0) return;
      
      const isCorrect = answers[i] === q.correct;
      const diffMult = ALGORITHM_CONFIG.difficultyWeight[q.difficulty] || 1.0;
      
      // Calculate time confidence if timing data available
      let timeConfidence = 1.0;
      if (questionTimes && questionTimes[i]) {
        const timeAnalysis = analyzeResponseTime(questionTimes[i], q.difficulty, isCorrect);
        timeConfidence = timeAnalysis.confidence;
        
        // Track response patterns
        const isFast = timeAnalysis.ratio < 0.5;
        if (isFast && isCorrect) responsePatterns.fastCorrect++;
        else if (isFast && !isCorrect) responsePatterns.fastWrong++;
        else if (!isFast && isCorrect) responsePatterns.slowCorrect++;
        else responsePatterns.slowWrong++;
      }
      
      // Track difficulty performance
      if (difficultyPerformance[q.difficulty]) {
        difficultyPerformance[q.difficulty].total++;
        if (isCorrect) difficultyPerformance[q.difficulty].correct++;
      }
      
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
        const timeAdjustedWeight = irtWeight * timeConfidence;
        
        maxScores[category] += baseWeight;
        irtMax[category] += irtWeight;
        
        if (isCorrect) {
          rawScores[category] += baseWeight;
          irtScores[category] += irtWeight;
          timeWeightedScores[category] += timeAdjustedWeight;
        }
      });
    });
    
    // Calculate percentiles using time-weighted scores (most advanced)
    const percentiles = {};
    Object.keys(irtScores).forEach(cat => {
      // Blend IRT and time-weighted scores (70% IRT, 30% time-weighted for stability)
      const blendedScore = irtMax[cat] > 0 
        ? (irtScores[cat] * 0.7 + timeWeightedScores[cat] * 0.3) / irtMax[cat]
        : 0;
      percentiles[cat] = Math.round(blendedScore * 100);
    });
    
    // Calculate consistency score (are easy/hard performances aligned?)
    const easyRate = difficultyPerformance.Easy.total > 0 ? difficultyPerformance.Easy.correct / difficultyPerformance.Easy.total : 0;
    const hardRate = difficultyPerformance.Hard.total > 0 ? difficultyPerformance.Hard.correct / difficultyPerformance.Hard.total : 0;
    const consistencyScore = 1 - Math.abs(easyRate - hardRate - 0.3); // Expect ~30% difference
    const isConsistent = consistencyScore > 0.5;
    
    // Calculate confidence interval (±margin based on question count)
    const marginOfError = Math.round(15 / Math.sqrt(questions.length) * 2); // Simplified SE calculation
    
    // Calculate impulsivity score from response patterns
    const totalFast = responsePatterns.fastCorrect + responsePatterns.fastWrong;
    const impulsivityScore = totalFast > 0 
      ? Math.round((responsePatterns.fastWrong / totalFast) * 100)
      : 0;
    
    return {
      raw: rawScores,
      max: maxScores,
      irt: irtScores,
      irtMax: irtMax,
      timeWeighted: timeWeightedScores,
      percentiles,
      difficultyPerformance,
      categoryPerformance,
      responsePatterns,
      impulsivityScore,
      consistencyScore: Math.round(consistencyScore * 100),
      isConsistent,
      marginOfError
    };
  }, [answers, questionTimes]);

  // Advanced Analysis
  const advancedAnalysis = useMemo(() => {
    return {
      answerPatterns: analyzeAnswerPatterns(answers),
      trajectories: analyzeTrajectory(answers, questions, ALGORITHM_CONFIG.categoryIndices),
      stealthResults: analyzeStealthQuestions(answers, questions, questionTimes),
      skillCeilings: analyzeSkillCeilings(answers, questions)
    };
  }, [answers, questionTimes]);

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

  // Red flag detection - enhanced with advanced analysis
  const getRedFlags = () => {
    const flags = [];
    const p = scores.percentiles;
    const adv = advancedAnalysis;
    
    // Critical cognitive concerns
    if (p.adaptive < 20) flags.push({ severity: 'high', message: 'Very low adaptability — may struggle significantly with changing requirements or new processes', category: 'Adaptive Thinking' });
    if (p.analytical < 20) flags.push({ severity: 'high', message: 'Very low analytical reasoning — may have difficulty with problem-solving and logical decisions', category: 'Analytical Reasoning' });
    if (p.memory < 20) flags.push({ severity: 'high', message: 'Very low working memory — may struggle to retain information during training and complex tasks', category: 'Working Memory' });
    
    // Pattern concerns
    if (p.analytical > 70 && p.processing < 35) flags.push({ severity: 'medium', message: 'High analytical but low processing speed — capable but may be slow under pressure', category: 'Processing Efficiency' });
    if (p.pattern > 70 && p.adaptive < 40) flags.push({ severity: 'medium', message: 'Strong pattern recognition but low adaptability — may resist changing established methods', category: 'Adaptive Thinking' });
    if (p.memory < 35 && p.analytical > 60) flags.push({ severity: 'medium', message: 'Good reasoning but weak memory — may need written references and documentation', category: 'Working Memory' });
    
    // Impulsivity flag
    if (scores.impulsivityScore > 50) {
      flags.push({ severity: 'medium', message: `High impulsivity detected (${scores.impulsivityScore}% of quick answers were wrong) — may rush to conclusions without careful consideration`, category: 'Response Style' });
    }
    
    // Consistency flags
    if (!scores.isConsistent) {
      const easyRate = scores.difficultyPerformance.Easy.correct / scores.difficultyPerformance.Easy.total;
      const hardRate = scores.difficultyPerformance.Hard.correct / scores.difficultyPerformance.Hard.total;
      if (hardRate > easyRate) {
        flags.push({ severity: 'low', message: 'Unusual pattern: performed better on hard questions than easy ones — may indicate rushing or attention issues on simpler tasks', category: 'Consistency' });
      }
    }
    
    // Answer pattern flags
    if (adv.answerPatterns.suspicious) {
      adv.answerPatterns.details.forEach(detail => {
        flags.push({ severity: 'medium', message: detail, category: 'Response Pattern' });
      });
    }
    
    // Trajectory flags
    Object.entries(adv.trajectories).forEach(([cat, traj]) => {
      if (traj.trend === 'declining' && traj.change < -25) {
        flags.push({ severity: 'medium', message: `Performance declined significantly in ${categoryNames[cat] || cat} (${traj.firstHalf}% → ${traj.secondHalf}%) — may indicate fatigue or loss of focus`, category: categoryNames[cat] || cat });
      }
    });
    
    // Stealth question flags
    const stealth = adv.stealthResults;
    if (!stealth.attentionCheck.passed) {
      flags.push({ severity: 'high', message: stealth.attentionCheck.concern, category: 'Validity' });
    }
    if (!stealth.consistencyCheck.passed) {
      flags.push({ severity: 'medium', message: stealth.consistencyCheck.concern, category: 'Validity' });
    }
    if (stealth.metacognition.calibration === 'overconfident') {
      flags.push({ severity: 'low', message: 'Metacognitive miscalibration — expressed high confidence despite lower actual performance (Dunning-Kruger pattern)', category: 'Self-Awareness' });
    }
    if (stealth.anchoringBias.detected) {
      flags.push({ severity: 'low', message: stealth.anchoringBias.concern, category: 'Critical Thinking' });
    }
    if (!stealth.delayedRecall.passed) {
      flags.push({ severity: 'low', message: stealth.delayedRecall.concern, category: 'Long-term Retention' });
    }
    if (!stealth.honestyCheck.passed) {
      flags.push({ severity: 'medium', message: stealth.honestyCheck.concern, category: 'Ethical Reasoning' });
    }
    if (stealth.frustrationTolerance.score === 'low') {
      flags.push({ severity: 'low', message: 'Low frustration tolerance — gave up quickly on challenging problem (spent <5 seconds)', category: 'Persistence' });
    }
    
    // Skill ceiling flags
    adv.skillCeilings.forEach(ceiling => {
      flags.push({ severity: 'low', message: ceiling.message, category: ceiling.category });
    });
    
    // Adaptive section specific analysis
    const adaptiveIndices = [25, 26, 27, 28, 29, 30, 31];
    const adaptiveCorrect = adaptiveIndices.map(i => answers[i] === questions[i]?.correct);
    if (adaptiveCorrect[0] && adaptiveCorrect[1] && !adaptiveCorrect[2] && !adaptiveCorrect[3]) {
      flags.push({ severity: 'medium', message: 'Struggled with Rule 1 to Rule 2 transition — may have difficulty when procedures change', category: 'Adaptive Thinking' });
    }
    if (adaptiveCorrect[2] && adaptiveCorrect[3] && !adaptiveCorrect[5] && !adaptiveCorrect[6]) {
      flags.push({ severity: 'medium', message: 'Struggled with Rule 2 to Rule 3 transition — shows pattern of difficulty with cumulative rule changes', category: 'Adaptive Thinking' });
    }
    
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

  // Tab state
  const [activeTab, setActiveTab] = useState('overview');
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'roles', label: 'Role Fit', icon: '💼' },
    { id: 'style', label: 'Cognitive Style', icon: '🧠' },
    { id: 'analytics', label: 'Deep Analytics', icon: '🔬' },
    { id: 'questions', label: 'Questions', icon: '❓' },
  ];

  // Calculate cognitive style traits (moved outside of render for tabs)
  const cognitiveStyleTraits = useMemo(() => {
    const p = scores.percentiles;
    const dp = scores.difficultyPerformance;
    
    const thinkingStyle = scores.isConsistent && p.processing < 60 ? 'Methodical' : p.processing > 70 ? 'Intuitive' : 'Balanced';
    const thinkingScore = p.processing > 70 ? 80 : p.processing < 40 ? 20 : 50;
    
    const adaptability = p.adaptive > 70 ? 'Highly Flexible' : p.adaptive > 50 ? 'Adaptable' : p.adaptive > 30 ? 'Prefers Structure' : 'Rigid';
    const adaptScore = p.adaptive;
    
    const easyRate = dp.Easy.total > 0 ? (dp.Easy.correct / dp.Easy.total) * 100 : 50;
    const detailLevel = easyRate > 85 ? 'Highly Detail-Oriented' : easyRate > 70 ? 'Attentive' : easyRate > 50 ? 'Moderate' : 'Big-Picture Focus';
    const detailScore = easyRate;
    
    const pressureResponse = p.processing > 70 ? 'Thrives Under Pressure' : p.processing > 50 ? 'Handles Pressure Well' : p.processing > 30 ? 'Needs Time' : 'Struggles Under Pressure';
    const pressureScore = p.processing;
    
    const learningSpeed = p.adaptive > 60 && p.pattern > 60 ? 'Quick Learner' : p.adaptive > 40 ? 'Steady Learner' : 'Needs Reinforcement';
    const learnScore = (p.adaptive + p.pattern) / 2;
    
    const analyticalDepth = p.analytical > 70 ? 'Deep Analyzer' : p.analytical > 50 ? 'Solid Reasoner' : 'Surface-Level';
    const analyticalScore = p.analytical;
    
    return [
      { name: 'Thinking Style', value: thinkingStyle, score: thinkingScore, left: 'Methodical', right: 'Intuitive', color: 'blue' },
      { name: 'Adaptability', value: adaptability, score: adaptScore, left: 'Structured', right: 'Flexible', color: 'purple' },
      { name: 'Attention to Detail', value: detailLevel, score: detailScore, left: 'Big Picture', right: 'Detail-Focused', color: 'emerald' },
      { name: 'Pressure Response', value: pressureResponse, score: pressureScore, left: 'Careful', right: 'Quick', color: 'amber' },
      { name: 'Learning Curve', value: learningSpeed, score: learnScore, left: 'Gradual', right: 'Rapid', color: 'cyan' },
      { name: 'Analytical Depth', value: analyticalDepth, score: analyticalScore, left: 'Practical', right: 'Theoretical', color: 'rose' },
    ];
  }, [scores]);

  // Only show high-severity flags in main view
  const importantFlags = redFlags.filter(f => f.severity === 'high');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sticky Header with Methodology Button */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-semibold">J</span>
            </div>
            <span className="text-slate-900 font-medium">Assessment Results</span>
            {totalTestTime && (
              <span className="text-slate-400 text-sm hidden sm:inline">· {Math.round(totalTestTime / 60000)} min</span>
            )}
          </div>
          <button 
            onClick={onViewMethodology} 
            className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            View Methodology
          </button>
        </div>
        
        {/* Tab Bar */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id 
                    ? 'border-slate-900 text-slate-900' 
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Rush Warning - Always visible if applicable */}
        {timingAnalysis.rushLevel === 'severe' && (
          <div className="mb-6 p-4 bg-rose-50 border-2 border-rose-300 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <h3 className="text-rose-800 font-semibold">Results Validity Concern</h3>
                <p className="text-rose-700 text-sm mt-1">{timingAnalysis.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Important Concerns - Always visible if applicable */}
        {importantFlags.length > 0 && (
          <div className="mb-6 space-y-2">
            {importantFlags.map((flag, idx) => (
              <div key={idx} className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-rose-200 text-rose-800">Important</span>
                  <div>
                    <p className="text-slate-700 text-sm">{flag.message}</p>
                    <p className="text-slate-400 text-xs mt-1">Related to: {flag.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Main Content Grid - Always Visible */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Cognitive Profile (Spider Chart) */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Cognitive Profile</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0"/>
                  <PolarAngleAxis dataKey="category" tick={{fill:'#64748b',fontSize:10}}/>
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{fill:'#94a3b8',fontSize:9}}/>
                  <Radar name="Score" dataKey="value" stroke="#0f172a" fill="#0f172a" fillOpacity={0.1} strokeWidth={2}/>
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Composite Score */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-center">
            <div className="text-center">
              <div className="text-5xl font-light text-slate-900">{composite}</div>
              <div className="text-slate-400 text-xs">±{scores.marginOfError}</div>
              <div className="text-slate-500 text-xs uppercase tracking-wide mt-1 mb-4">Composite Percentile</div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${style.bg} ${style.text}`}>
                {recommendation.level}
              </div>
            </div>
          </div>

          {/* Performance Consistency */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Consistency</h2>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {Object.entries(scores.difficultyPerformance).map(([diff, data]) => (
                <div key={diff} className="text-center p-2 bg-slate-50 rounded-lg">
                  <div className={`text-xs font-medium ${
                    diff === 'Easy' ? 'text-emerald-600' : diff === 'Medium' ? 'text-amber-600' : 'text-rose-600'
                  }`}>{diff}</div>
                  <div className="text-lg font-light text-slate-900">
                    {data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0}%
                  </div>
                </div>
              ))}
            </div>
            <div className={`p-2 rounded-lg text-xs ${scores.isConsistent ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
              {scores.isConsistent ? '✓ Reliable results' : '⚠ Interpret with caution'}
            </div>
          </div>
        </div>

        {/* Category Scores Bar */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(scores.percentiles).map(([cat, val]) => (
              <div key={cat} className="text-center">
                <div className="text-xs text-slate-500 mb-1 truncate">{categoryNames[cat].split(' ')[0]}</div>
                <div className="text-xl font-light text-slate-900">{val}</div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-slate-900 rounded-full" style={{width:`${val}%`}}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Assessment Summary</h2>
              <div className={`${style.bg} ${style.border} border rounded-xl p-4 mb-6`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${style.icon} rounded-full flex items-center justify-center`}>
                    <span className={`text-lg ${style.text}`}>{recommendation.icon}</span>
                  </div>
                  <div>
                    <div className={`font-semibold ${style.text}`}>{recommendation.level}</div>
                    <p className="text-slate-600 text-sm">{generateRationale()}</p>
                  </div>
                </div>
              </div>
              
              {/* All insights (including medium/low severity) */}
              {redFlags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Insights & Considerations</h3>
                  <div className="space-y-2">
                    {redFlags.map((flag, idx) => (
                      <div key={idx} className={`p-3 rounded-lg border ${
                        flag.severity === 'high' ? 'bg-rose-50 border-rose-200' :
                        flag.severity === 'medium' ? 'bg-amber-50 border-amber-200' :
                        'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex items-start gap-2">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                            flag.severity === 'high' ? 'bg-rose-200 text-rose-800' :
                            flag.severity === 'medium' ? 'bg-amber-200 text-amber-800' :
                            'bg-blue-200 text-blue-800'
                          }`}>
                            {flag.severity === 'high' ? 'Important' : flag.severity === 'medium' ? 'Note' : 'Info'}
                          </span>
                          <p className="text-slate-700 text-sm flex-1">{flag.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {redFlags.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <span className="text-3xl mb-2 block">✓</span>
                  No significant concerns identified
                </div>
              )}
            </div>
          )}

          {/* Role Fit Tab */}
          {activeTab === 'roles' && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Role Fit Analysis</h2>
              <p className="text-slate-500 text-sm mb-4">See how this profile matches different job types</p>
              
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
                  <div className="text-3xl font-light text-slate-900">{composite}<span className="text-lg text-slate-400">th</span></div>
                  <div className="text-xs text-slate-400 mt-1">Range: {Math.max(0, composite - scores.marginOfError)} - {Math.min(100, composite + scores.marginOfError)}</div>
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
              
              <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                <h3 className="text-sm font-medium text-slate-700 mb-2">Weight Distribution for {roleProfiles[selectedRole].name}</h3>
                <div className="space-y-2">
                  {Object.entries(roleProfiles[selectedRole].weights).map(([cat, weight]) => (
                    <div key={cat} className="flex items-center gap-2">
                      <span className="text-xs text-slate-600 w-28">{categoryNames[cat]}</span>
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-700 rounded-full" style={{width:`${weight * 100}%`}}/>
                      </div>
                      <span className="text-xs text-slate-500 w-10 text-right">{Math.round(weight * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Cognitive Style Tab */}
          {activeTab === 'style' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-slate-900">Cognitive Style Profile</h2>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Inferred from behavior</span>
              </div>
              <p className="text-slate-500 text-sm mb-6">These traits are derived from how you approached the assessment, not from a personality test.</p>
              
              <div className="space-y-4">
                {cognitiveStyleTraits.map((trait) => (
                  <div key={trait.name} className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">{trait.name}</span>
                      <span className="text-sm font-semibold text-slate-700">{trait.value}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 w-20 text-right">{trait.left}</span>
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-600 rounded-full" style={{ width: `${trait.score}%` }}/>
                      </div>
                      <span className="text-xs text-slate-400 w-20">{trait.right}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-blue-800 text-xs">
                  <strong>Disclaimer:</strong> This cognitive style profile is inferred from problem-solving patterns observed during the assessment. 
                  It reflects behavioral tendencies during cognitive tasks, not personality traits.
                </p>
              </div>
            </div>
          )}

          {/* Deep Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Deep Analytics</h2>
              <p className="text-slate-500 text-sm mb-6">Advanced psychometric analysis using response timing, patterns, and embedded validity checks.</p>
              
              {/* Response Validity Index */}
              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">📋 Response Validity Index</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className={`p-3 rounded-lg ${advancedAnalysis.stealthResults.attentionCheck.passed ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                    <div className="text-xs text-slate-500">Attention Check</div>
                    <div className={`font-semibold ${advancedAnalysis.stealthResults.attentionCheck.passed ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {advancedAnalysis.stealthResults.attentionCheck.passed ? '✓ Passed' : '✗ Failed'}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${advancedAnalysis.stealthResults.consistencyCheck.passed ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                    <div className="text-xs text-slate-500">Consistency Check</div>
                    <div className={`font-semibold ${advancedAnalysis.stealthResults.consistencyCheck.passed ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {advancedAnalysis.stealthResults.consistencyCheck.passed ? '✓ Consistent' : '⚠ Inconsistent'}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${advancedAnalysis.stealthResults.overallValidity === 'high' ? 'bg-emerald-50' : advancedAnalysis.stealthResults.overallValidity === 'moderate' ? 'bg-amber-50' : 'bg-rose-50'}`}>
                    <div className="text-xs text-slate-500">Overall Validity</div>
                    <div className={`font-semibold ${advancedAnalysis.stealthResults.overallValidity === 'high' ? 'text-emerald-700' : advancedAnalysis.stealthResults.overallValidity === 'moderate' ? 'text-amber-700' : 'text-rose-700'}`}>
                      {advancedAnalysis.stealthResults.overallValidity.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Metacognitive & Bias Profile */}
              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">🧠 Metacognitive & Bias Profile</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-lg">
                    <div className="text-xs text-slate-500">Self-Assessment Calibration</div>
                    <div className={`font-semibold ${
                      advancedAnalysis.stealthResults.metacognition.calibration === 'well_calibrated' ? 'text-emerald-700' :
                      advancedAnalysis.stealthResults.metacognition.calibration === 'overconfident' ? 'text-amber-700' :
                      advancedAnalysis.stealthResults.metacognition.calibration === 'underconfident' ? 'text-blue-700' : 'text-slate-500'
                    }`}>
                      {advancedAnalysis.stealthResults.metacognition.calibration === 'well_calibrated' ? '✓ Well Calibrated' :
                       advancedAnalysis.stealthResults.metacognition.calibration === 'overconfident' ? '⚠ Overconfident' :
                       advancedAnalysis.stealthResults.metacognition.calibration === 'underconfident' ? 'ℹ Underconfident' : '— N/A'}
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <div className="text-xs text-slate-500">Anchoring Bias</div>
                    <div className={`font-semibold ${advancedAnalysis.stealthResults.anchoringBias.detected ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {advancedAnalysis.stealthResults.anchoringBias.detected ? '⚠ Susceptible' : '✓ Independent'}
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <div className="text-xs text-slate-500">Ethical Reasoning</div>
                    <div className={`font-semibold ${advancedAnalysis.stealthResults.honestyCheck.passed ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {advancedAnalysis.stealthResults.honestyCheck.passed ? '✓ Sound' : '⚠ Concern'}
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <div className="text-xs text-slate-500">Frustration Tolerance</div>
                    <div className={`font-semibold ${
                      advancedAnalysis.stealthResults.frustrationTolerance.score === 'high' ? 'text-emerald-700' :
                      advancedAnalysis.stealthResults.frustrationTolerance.score === 'moderate' ? 'text-blue-700' : 'text-amber-700'
                    }`}>
                      {advancedAnalysis.stealthResults.frustrationTolerance.score === 'high' ? '✓ High Persistence' :
                       advancedAnalysis.stealthResults.frustrationTolerance.score === 'moderate' ? 'Moderate' : '⚠ Low Persistence'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Patterns */}
              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">⚡ Response Time Analysis</h3>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  <div className="p-2 bg-emerald-50 rounded-lg text-center">
                    <div className="text-xl font-light text-emerald-700">{scores.responsePatterns.fastCorrect}</div>
                    <div className="text-xs text-slate-500">Fast ✓</div>
                  </div>
                  <div className="p-2 bg-rose-50 rounded-lg text-center">
                    <div className="text-xl font-light text-rose-700">{scores.responsePatterns.fastWrong}</div>
                    <div className="text-xs text-slate-500">Fast ✗</div>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg text-center">
                    <div className="text-xl font-light text-blue-700">{scores.responsePatterns.slowCorrect}</div>
                    <div className="text-xs text-slate-500">Slow ✓</div>
                  </div>
                  <div className="p-2 bg-amber-50 rounded-lg text-center">
                    <div className="text-xl font-light text-amber-700">{scores.responsePatterns.slowWrong}</div>
                    <div className="text-xs text-slate-500">Slow ✗</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <span className="text-sm text-slate-600">Impulsivity Index</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${scores.impulsivityScore > 50 ? 'bg-rose-500' : scores.impulsivityScore > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{width: `${Math.min(scores.impulsivityScore, 100)}%`}} />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{scores.impulsivityScore}%</span>
                  </div>
                </div>
              </div>

              {/* Trajectory Analysis */}
              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">📈 Performance Trajectory</h3>
                <div className="space-y-2">
                  {Object.entries(advancedAnalysis.trajectories).map(([cat, traj]) => (
                    <div key={cat} className="flex items-center justify-between p-2 bg-white rounded-lg">
                      <span className="text-sm text-slate-600">{categoryNames[cat]?.split(' ')[0] || cat}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">{traj.firstHalf}%</span>
                        <span className={`text-base ${traj.trend === 'improving' ? 'text-emerald-600' : traj.trend === 'declining' ? 'text-rose-600' : 'text-slate-400'}`}>
                          {traj.trend === 'improving' ? '↗' : traj.trend === 'declining' ? '↘' : '→'}
                        </span>
                        <span className="text-xs text-slate-400">{traj.secondHalf}%</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          traj.trend === 'improving' ? 'bg-emerald-100 text-emerald-700' :
                          traj.trend === 'declining' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {traj.trend === 'insufficient_data' ? 'N/A' : traj.trend === 'stable' ? 'Stable' : `${traj.change > 0 ? '+' : ''}${traj.change}%`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Memory & Skill Analysis */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">💾 Memory Retention</h3>
                  <div className={`p-3 rounded-lg ${advancedAnalysis.stealthResults.delayedRecall.passed ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                    <div className="text-xs text-slate-500">Delayed Recall Test</div>
                    <div className={`font-semibold ${advancedAnalysis.stealthResults.delayedRecall.passed ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {advancedAnalysis.stealthResults.delayedRecall.passed ? '✓ Information Retained' : '⚠ Information Decay'}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Tested recall of passage details at end of assessment</p>
                  </div>
                </div>
                
                {advancedAnalysis.skillCeilings.length > 0 && (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">🎯 Skill Ceilings Detected</h3>
                    <div className="space-y-2">
                      {advancedAnalysis.skillCeilings.slice(0, 2).map((c, i) => (
                        <div key={i} className="p-2 bg-amber-50 rounded-lg text-xs text-amber-800">{c.message}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {advancedAnalysis.answerPatterns.suspicious && (
                <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl">
                  <h3 className="text-sm font-semibold text-rose-800 mb-2">⚠ Suspicious Response Patterns</h3>
                  <ul className="text-rose-700 text-sm space-y-1">
                    {advancedAnalysis.answerPatterns.details.map((d, i) => <li key={i}>• {d}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Questions Tab */}
          {activeTab === 'questions' && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Question Breakdown</h2>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {questions.map((q, i) => (
                  <div key={q.id} className="border border-gray-100 rounded-xl overflow-hidden">
                    <button onClick={() => setExpandedQuestion(expandedQuestion === i ? null : i)} className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${answers[i] === q.correct ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{answers[i] === q.correct ? '✓' : '×'}</span>
                        <span className="text-slate-700 text-sm">Q{q.id}</span>
                        <span className="text-slate-400 text-xs hidden sm:inline">· {q.category}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${q.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' : q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{q.difficulty}</span>
                      </div>
                      <svg className={`w-4 h-4 text-slate-400 transition-transform ${expandedQuestion === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                    </button>
                    {expandedQuestion === i && (
                      <div className="p-4 pt-0 border-t border-gray-100 bg-slate-50">
                        <p className="text-slate-700 text-sm mb-4 mt-3">{q.question}</p>
                        <div className="grid md:grid-cols-2 gap-3 mb-3">
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="text-slate-500 text-xs mb-1">Your Answer</div>
                            <div className={`text-sm font-medium ${answers[i] === q.correct ? 'text-emerald-700' : 'text-rose-700'}`}>{String.fromCharCode(65 + answers[i])}. {q.options[answers[i]]}</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="text-slate-500 text-xs mb-1">Correct Answer</div>
                            <div className="text-emerald-700 text-sm font-medium">{String.fromCharCode(65 + q.correct)}. {q.options[q.correct]}</div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-3 border border-gray-200 mb-3">
                          <div className="text-slate-500 text-xs mb-2">Score Impact</div>
                          <div className="space-y-1">
                            {Object.entries(q.weights).map(([cat, weight]) => (
                              <div key={cat} className="flex items-center gap-2">
                                <span className="text-xs text-slate-600 w-24">{categoryNames[cat].split(' ')[0]}</span>
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full ${
                                    cat === 'analytical' ? 'bg-violet-500' :
                                    cat === 'pattern' ? 'bg-blue-500' :
                                    cat === 'memory' ? 'bg-emerald-500' :
                                    cat === 'adaptive' ? 'bg-orange-500' : 'bg-rose-500'
                                  }`} style={{ width: `${weight}%` }}/>
                                </div>
                                <span className="text-xs text-slate-500 w-8 text-right">{weight}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className={`text-sm p-3 rounded-lg ${answers[i] === q.correct ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                          {answers[i] === q.correct ? q.correctIndicates : q.incorrectIndicates}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
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

// Utility function to shuffle array and return shuffle map
const shuffleWithMap = (array) => {
  const indices = array.map((_, i) => i);
  const shuffled = [...indices];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  // shuffleMap[displayIndex] = originalIndex
  return shuffled;
};

export default function App() {
  const [page, setPage] = useState('landing');
  const [showSuffernModal, setShowSuffernModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showMemoryPassage, setShowMemoryPassage] = useState(false);
  const [isSuffernMode, setIsSuffernMode] = useState(false);
  
  // Timing tracking
  const [testStartTime, setTestStartTime] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [questionTimes, setQuestionTimes] = useState({});
  const [totalTestTime, setTotalTestTime] = useState(null);
  
  // Answer shuffling - generate shuffle maps for all questions once at start
  const [shuffleMaps, setShuffleMaps] = useState({});

  const handleStart = () => {
    // Generate shuffle maps for all questions
    const maps = {};
    questions.forEach((q, i) => {
      maps[i] = shuffleWithMap(q.options);
    });
    setShuffleMaps(maps);
    setTestStartTime(Date.now());
    setQuestionStartTime(Date.now());
    setPage('test');
  };
  
  const handleMemoryContinue = () => {
    setShowMemoryPassage(false);
    setQuestionStartTime(Date.now()); // Reset timer after memory passage
  };
  
  const handleAnswer = (displayIndex) => {
    // Convert displayed answer index to original answer index using shuffle map
    const originalIndex = shuffleMaps[currentQuestion][displayIndex];
    
    // Record time spent on this question
    const timeSpent = Date.now() - questionStartTime;
    setQuestionTimes(prev => ({...prev, [currentQuestion]: timeSpent}));
    
    const newAnswers = {...answers, [currentQuestion]: originalIndex};
    setAnswers(newAnswers);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        // Show memory passage before question 17 (index 16)
        if (currentQuestion === 15) {
          setShowMemoryPassage(true);
        }
        setCurrentQuestion(currentQuestion + 1);
        setQuestionStartTime(Date.now());
      } else {
        setTotalTestTime(Date.now() - testStartTime);
        setPage('results');
      }
    }, 300);
  };
  
  const handleSuffernConfirm = () => { setShowSuffernModal(false); setIsSuffernMode(true); setPage('suffernResults'); };

  // Get shuffled options for current question
  const getShuffledOptions = (questionIndex) => {
    if (!shuffleMaps[questionIndex]) return questions[questionIndex].options;
    return shuffleMaps[questionIndex].map(origIdx => questions[questionIndex].options[origIdx]);
  };
  
  // Get selected answer in display order (for highlighting)
  const getDisplaySelectedAnswer = (questionIndex) => {
    const originalAnswer = answers[questionIndex];
    if (originalAnswer === undefined) return undefined;
    // Find which display index maps to the original answer
    return shuffleMaps[questionIndex]?.findIndex(origIdx => origIdx === originalAnswer);
  };

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
        showMemoryPassage ? (
          <MemoryPassagePage onContinue={handleMemoryContinue}/>
        ) : (
          <QuestionPage 
            question={{...questions[currentQuestion], options: getShuffledOptions(currentQuestion)}} 
            questionNumber={currentQuestion + 1} 
            totalQuestions={questions.length} 
            onAnswer={handleAnswer} 
            selectedAnswer={getDisplaySelectedAnswer(currentQuestion)}
          />
        )
      )}
      {page === 'results' && (
        <ResultsPage 
          answers={answers} 
          questionTimes={questionTimes}
          totalTestTime={totalTestTime}
          onViewMethodology={() => setPage('methodology')}
        />
      )}
      {page === 'suffernResults' && <SuffernResultsPage onViewMethodology={() => setPage('methodology')}/>}
      {page === 'methodology' && <MethodologyPage onBack={() => setPage(isSuffernMode ? 'suffernResults' : 'results')}/>}
    </>
  );
}
