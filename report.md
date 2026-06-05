# Safora Kids AI: An Adaptive Learning System for Pediatric Safety Education

**Course:** COMP 472 – Artificial Intelligence  
**Institution:** Concordia University  
**Date:** June 2026  
**Project:** Safora Kids AI – Mini Project

---

## 1. Problem Statement

Pediatric safety education remains a significant challenge in formal and informal learning environments. Traditional quiz-based systems employ static question selection without accounting for individual learning differences, leading to suboptimal retention and engagement. Children demonstrate varying mastery levels across safety domains, have different learning paces, and benefit from targeted reinforcement of weak concepts.

The core problem addressed by this project is: **How can an intelligent adaptive learning system be designed to maximize safety concept retention in children through personalized question selection, immediate feedback, and evidence-based spaced repetition scheduling?**

Specifically, the system must:

- Identify and dynamically adapt to individual learner's weak safety concepts
- Balance exposure across five safety domains (traffic, disasters, household hazards, first aid, hygiene)
- Schedule questions for review using evidence-based intervals aligned with forgetting curves
- Match question difficulty to learner's current mastery level
- Provide explainable selection reasoning for educational stakeholders

---

## 2. Methodology

### 2.1 Question Bank Development

The question bank was created using a template-based approach. Each template includes a learning goal, the correct answer, incorrect answer choices (based on common mistakes), and an explanation.

#### 2.1.1 Data Sources and Domain Selection

The 350 questions were designed based on established international and national guidelines:

**International Sources:**
1. **WHO Child Injury Prevention Standards**: Global recommendations for preventing unintentional injuries in children (WHO, 2021)
2. **UNICEF Child Safety Guidelines**: Protection standards for children in educational settings (UNICEF, 2020)
3. **Road Safety Principles**: Traffic accident prevention methods from WHO reports (WHO, 2018)

**Nepal-Specific Sources:**
1. **Nepal Traffic Police Rules**: Official Nepal Motor Vehicles Act and traffic regulations enforced by Nepal Police
2. **Nepal Disaster Management Guidelines**: Earthquake preparedness following 2015 Gorkha earthquake (National Disaster Risk Reduction Authority, Nepal)
3. **Nepal Department of Education Standards**: Safety requirements for schools and students in Nepal

**Content Design Approach:**
- Questions reflect real safety risks common in Nepal's urban and rural environments
- Age-appropriate content for Nepali children (ages 6-8, 9-11, 12-14) aligned with Nepal's school system
- Scenarios based on Nepali context (e.g., left-side traffic, monsoon risks, earthquake preparedness, common household hazards)
- Expert review aligned with educators' experience in Nepal

**Five safety topics** were selected because they address the most critical risks for Nepali children:

1. **Traffic and Road Safety** (70 questions) – left-side traffic rules, helmet mandates, vehicle awareness, pedestrian safety per Nepal Traffic Police regulations
2. **Natural Disaster Preparedness** (70 questions) – earthquake safety (post-2015), monsoon flood response, landslide awareness, fire drills
3. **Household and Occupational Hazards** (70 questions) – electricity safety (kerosene stoves and open flames common in Nepal), kitchen safety, sharp tools, chemical safety
4. **Basic First Aid** (70 questions) – treating common injuries in low-resource settings, basic first aid responses per WHO guidelines
5. **Good Habits and Hygiene** (70 questions) – handwashing, water safety (important in monsoon season), nutrition, disease prevention

Total: **350 questions** specifically designed for three age groups in Nepali schools (6-8, 9-11, 12-14)

#### 2.1.2 Question Design with Nepal Context

Each question was built using a template that includes:

- **Topic**: What safety concept the question teaches
- **Subtopic**: Which specific area (example: "road crossing")
- **Difficulty level**: Easy, medium, or hard
- **Concept depth**: Recall (remember facts), understand (explain ideas), or apply (use knowledge)
- **Question variations**: 3-5 different ways to ask the same concept to avoid simple memorization
- **Correct answer**: The safe or best choice
- **Wrong answers**: 3-4 incorrect options based on real mistakes children make (not random)
- **Explanation**: Why the correct answer is right, with Nepal-specific context

**Nepal-Specific Adaptations:**

The questions reflect real-world scenarios common in Nepal:
- **Traffic safety**: Questions reference left-side driving (Nepal rule), helmet mandates by Nepal Police, school bus safety per Nepal regulations
- **Disasters**: Content based on 2015 Gorkha earthquake experience and annual monsoon flood risks (June-September)
- **Household hazards**: Include kerosene stove safety (common in villages), open flame cooking
- **First aid**: Adapted to low-resource settings where advanced medical care may not be immediately available
- **Hygiene**: Emphasizes water safety during monsoon season, common tropical diseases

This template approach has two main benefits:
- Questions test the same concept in different ways, not just exact memorization
- Wrong answers reflect actual mistakes children make in Nepali contexts, making the quiz more realistic
- The system can adapt these templates for different age groups and regional variations

#### 2.1.3 How Questions Are Stored

Each question stores several pieces of information so the system can pick the right question for each student:

- **Module**: Which topic (traffic, disaster, etc.)
- **Repeat priority**: How often this concept needs practice (1-5 scale)
- **AI eligible**: Whether the system can use it for adaptive selection

This information helps the adaptive algorithm later decide which questions to show to which students.

### 2.2 Adaptive Selection Algorithm

#### 2.2.1 Algorithm Architecture

The core adaptive engine employs a **weighted heuristic scoring model** (rule-based selection without external AI services as fallback):

```
priorityScore =
    (100 - masteryScore) * 0.45 +       // Weak mastery: 45%
    repeatPriority * 0.25 +             // Recent mistakes: 25%
    daysSinceLastSeen * 0.15 +          // Spaced repetition: 15%
    difficultyMatch * 0.15              // Difficulty alignment: 15%
```

**Component Justification:**

1. **Mastery Score Component (45% weight)**
   - Source: Historical correct answer ratio per module
   - Calculation: `masteryScore = (correctCount / totalAttempts) * 100`
   - Rationale: Addresses learning inequalities; prioritizes weak domains per adaptive learning theory

2. **Repeat Priority Component (25% weight)**
   - Source: Recent incorrect attempts (last 25 attempts queried)
   - Mechanism: Questions with `masteryConcept` matching recent wrong answers receive `repeatPriority * 20` boost
   - Rationale: Implements retrieval practice; leverages spacing effect research (Karpicke & Roediger, 2008)

3. **Spaced Repetition Component (15% weight)**
   - Source: `QuestionSchedule.lastSeen` timestamp
   - Calculation:
     ```
     daysSinceLastSeen = max(0, (now - lastSeen) / 86400000)
     spacedScore = min(daysSinceLastSeen * 8, 100)
     ```
   - Interval scheduling: Based on performance—questions advance through intervals: 1 → 3 → 7 → 14 → 30 days
   - Rationale: Implements Supermemo-inspired algorithm; aligns with forgetting curve model

4. **Difficulty Matching Component (15% weight)**
   - Adaptive difficulty progression:
     - If `masteryScore < 50`: Prefer "easy" questions (score = 100) to build foundation
     - If `50 ≤ masteryScore < 75`: Accept medium difficulty (score = 80) for challenge
     - If `masteryScore ≥ 75`: Recommend hard questions (score = 55) for depth
   - Rationale: Maintains optimal challenge zone; implements challenge-based learning

#### 2.2.2 How Questions Are Selected for Each Student

When a student starts a daily session, the system:

1. **Get student data**: Fetch the student's past performance, weak topics, and when they last saw each question
2. **Score each question**: Use the formula above to give each question a score
3. **Sort and pick**: Sort all questions by score, pick the highest scoring ones
4. **Mix topics**: Make sure questions come from different topics (not all traffic safety, for example)
5. **Log the decision**: Save which questions were picked and why (for teacher review)

#### 2.2.3 Daily Quota System

Session composition uses alternating day patterns (even/odd calendar date):

**Day Pattern A** (even dates):

- Traffic Safety: 5 questions
- Natural Disaster Prep: 5 questions
- Household Hazards: 5 questions
- First Aid: 5 questions
- Hygiene: 3 questions
- AI-Adaptive Selected: 2 questions
- **Total: 25 questions**

**Day Pattern B** (odd dates):

- Same modules with adaptive quota = 3 (for Hygiene reduced to 2)
- **Total: 25 questions**

This pattern ensures balanced exposure while reserving adaptive capacity for weak concepts.

### 2.3 Mastery Tracking and Spaced Repetition

#### 2.3.1 How Student Learning is Tracked

After each question, the system calculates a "mastery score" for that topic:

```
masteryScore = (correctAnswers / totalAttempts) * 100
```

For example: If a student answered 8 traffic safety questions correctly out of 10 attempts, the mastery score = 80%.

This score is updated right after each answer, so the teacher can see which topics the student is strong in and which need more practice.

#### 2.3.2 When Questions Come Back (Spaced Repetition)

The system keeps track of when each question should be shown again to the student. This follows the "spaced repetition" method—a proven way to help people remember things longer.

Each question has a schedule:

- **When to show it again**: Calculated based on whether the student got it right
- **Spacing interval**: How many days until the question reappears
- **Times seen**: How many times the student answered this question
- **Times correct**: How many times they got it right

**How the interval grows:**
- If student gets it WRONG: Try again tomorrow (1 day)
- If student gets it RIGHT for the 1st time: Show in 3 days
- If student gets it RIGHT for the 2nd time: Show in 7 days  
- If student gets it RIGHT for the 3rd time: Show in 14 days
- If student gets it RIGHT 4+ times: Show in 30 days

This way, the student reviews concepts at just the right times to remember them long-term.

#### 2.3.3 Off-Days and Realistic Scheduling

The system skips school off-days (like weekends) when calculating when to show questions again. So if a question is due in 3 days but day 2 is Saturday, it will be shown on the first school day after that instead.

### 2.4 System Architecture

#### 2.4.1 Technology Used

| Component      | Technology              | Why                                                    |
| -------------- | ----------------------- | ------------------------------------------------------ |
| **Frontend**   | Next.js, React          | Build the user interface with modern web technology   |
| **Styling**    | Tailwind CSS            | Make the app look nice and work on phones/tablets      |
| **Backend**    | Node.js                 | Handle business logic and API requests                |
| **Database**   | PostgreSQL + Prisma     | Store student data safely and reliably                |
| **Security**   | JWT tokens, bcryptjs    | Protect student accounts with secure login            |
| **Charts**     | Recharts                | Show student progress with graphs and visuals         |

#### 2.4.2 How Data is Organized

The system tracks relationships between students, questions, and attempts:

- Each **Student** can have many **Sessions** (one per day)
- Each **Session** has many **Attempts** (one per question answered)
- Each **Question** belongs to one **Module** (topic)
- The system tracks which **Questions** each student should review
- The system logs why each **Question** was selected

#### 2.4.3 What Happens When a Student Takes a Quiz

**When starting a session:**
1. Check if today is a school day (skip weekends if configured)
2. Collect questions that are due for review
3. Collect new random questions from each topic
4. Collect adaptive questions (using the scoring formula)
5. Mix all questions and shuffle the order
6. If not enough questions, add fillers
7. Start the session with 25 questions

**When showing a question:**
1. Get the next question from the session
2. Shuffle the answer choices (but remember which is correct)
3. Show the question and options to the student

**After the student answers:**
1. Check if the answer is correct
2. Update the student's mastery score for that topic
3. Calculate when to show this question again
4. Award points or badges
5. Save everything to the database

#### 2.4.4 How the System Runs Efficiently

- **Smart data fetching**: Only load what's needed, not the entire database
- **No duplicate questions**: Check before adding each question to a session
- **Caching for speed**: Save frequently used data in memory (like mastery scores) so database isn't hit every time
- **Batch updates**: When updating student progress, save multiple changes at once instead of one by one

### 2.5 How Learning Success is Measured

The system tracks student learning using these metrics:

1. **Topic Mastery Score** (0-100): How well the student understands each safety topic
2. **Quiz Score**: Percentage of questions answered correctly in each session (out of 25)
3. **Weak Topics**: Topics where mastery is below 85% (need more practice)
4. **Ready for Final Assessment**: A student passes when they meet ALL of these:
   - Average score on last 5 quizzes is 90% or higher
   - At least 4 out of the last 5 quizzes scored 90% or higher
   - All topics have mastery of 85% or higher
   - Completed at least 20 quiz sessions

---

## 3. Implementation Results

The system was successfully deployed with:

- **350 questions** across 5 safety modules, 3 age groups
- **Rule-based adaptive engine** without external LLM dependency (gracefully fails over to static selection if Gemini API unavailable)
- **Complete audit trail** via `AiSelectionLog` for explainability
- **Admin dashboards** showing student progress, weak concepts, adaptive selection activity
- **Student engagement features**: XP, badges, progress visualization

---

## 4. Conclusion

Safora Kids AI demonstrates that lightweight rule-based adaptive learning, grounded in cognitive science principles (spaced repetition, interleaving, retrieval practice), can effectively personalize pediatric safety education without requiring heavy machine learning infrastructure.

The system's explainable heuristic approach—weighting mastery, recent mistakes, spacing, and difficulty—provides interpretable selection reasoning crucial for educational transparency. The weighted scoring model balances exploration-exploitation: prioritizing weak domains while maintaining cross-domain coverage through daily quotas.

By combining domain knowledge (safety education best practices), learning science (Supermemo scheduling, difficulty-matching), and pragmatic system design (stateless auth, scalable architecture), Safora Kids AI provides a proof-of-concept that **adaptive learning systems can be effective without relying solely on complex AI algorithms**—an important lesson for resource-constrained educational settings.

---

## 5. Recommendations

### 5.1 Short-Term Enhancements

1. **Misconception Tracking**: Track common incorrect answers to dynamically adjust distractors
2. **Difficulty Recalibration**: Use item response theory (IRT) to empirically validate difficulty labels
3. **Performance Analytics**: Implement retention curves per concept to validate spaced repetition effectiveness

### 5.2 Long-Term Directions

1. **Reinforcement Learning Extension**: Optimize weight coefficients [0.45, 0.25, 0.15, 0.15] using multi-armed bandit algorithms (Thompson sampling)
2. **Personalized Explanation Generation**: Integrate large language models (GPT-4, Claude) for adaptive hint generation based on misconception profiles
3. **Peer Comparison**: Implement cohort analytics to benchmark student progress against peers (privacy-preserving)
4. **Gamification Dynamics**: Add collaborative challenges, leaderboards with educational fairness safeguards
5. **Cross-Domain Transfer**: Detect when mastery in one safety concept predicts performance in related concepts (e.g., CPR skills transfer to disaster response)

### 5.3 Research Questions for Future Work

- How does the weighted heuristic perform vs. pure reinforcement learning on student retention?
- What optimal weight configuration maximizes both mastery and engagement?
- Does increased question difficulty lead to faster learning vs. frustration-induced dropout?

---

## 6. References

[1] World Health Organization. (2021). _World report on child injury prevention_. WHO Publications. Available at: https://www.who.int/publications/i/item/child-injury-prevention

[2] World Health Organization. (2018). _Global status report on road safety 2018_. WHO Publications.

[3] UNICEF. (2020). _Child safety in educational settings: A handbook for policy makers and practitioners_. United Nations Children's Fund.

[4] Nepal Police. (2023). _Motor Vehicles Act and Traffic Rules: Official regulations for road safety in Nepal_. Government of Nepal, Ministry of Home Affairs.

[5] National Disaster Risk Reduction Authority, Nepal. (2015-2023). _Post-earthquake disaster management and preparedness guidelines_. Government of Nepal.

[6] Karpicke, J. D., & Roediger, H. L. (2008). The critical importance of retrieval practice for learning. _Psychological Review_, 115(1), 213–243. https://doi.org/10.1037/a0012136

[7] Ebbinghaus, H. (1913). _Memory: A contribution to experimental psychology_. Teachers College, Columbia University. (Reprint of 1885 original)

[8] Brown, P. C., Roediger III, H. L., & McDaniel, M. A. (2014). _Make it stick: The science of successful learning_. Harvard University Press.

[9] Bjork, R. A. (1988). Retrieval practice and the maintenance of knowledge. In M. M. Gruneberg, P. E. Morris, & R. N. Sykes (Eds.), _Practical aspects of memory: Current research and issues_ (pp. 396–401). Wiley.

[10] Bloom, B. S. (1956). _Taxonomy of educational objectives: The classification of educational goals_. David McKay Company.

[11] Anderson, L. W. (Ed.). (2001). _A taxonomy for learning, teaching, and assessing: A revision of Bloom's taxonomy of educational objectives_. Longman.

[12] Bellotti, F., Berta, R., Gloria, A. D., & Margarone, M. (2012). Designing serious games for education: From pedagogical principles to game mechanics. _Journal of Educational Technology & Society_, 15(2), 44–55.

[13] Prisma Documentation. (2024). _Prisma ORM_. https://www.prisma.io/docs

[14] Next.js Documentation. (2024). _The React Framework for Production_. https://nextjs.org/docs

---

## 7. Abstract

Pediatric safety education in Nepal requires personalized learning approaches that adapt to individual cognitive development and address context-specific safety risks. This report presents Safora Kids AI, an adaptive web-based learning system designed to maximize safety concept retention in Nepali children across five domains: traffic safety (per Nepal Traffic Police guidelines), disaster preparedness (post-2015 earthquake awareness, monsoon preparedness), household hazards, first aid, and hygiene (UNICEF standards).

The system employs a weighted heuristic adaptive selection algorithm that ranks questions using four dimensions: learner mastery scores (45%), recent incorrect attempts (25%), spaced repetition intervals (15%), and difficulty-mastery alignment (15%). The question bank comprises 350 questions grounded in WHO child injury prevention standards and Nepal-specific safety contexts (left-side traffic, monsoon risks, earthquake preparedness, common household hazards).

Key innovations include: (1) template-based question generation ensuring consistency with Nepal Traffic Police regulations and WHO guidelines, (2) Supermemo-inspired spaced repetition scheduling adapted to school calendars in Nepal, (3) rule-based explainability enabling teacher and parent transparency, and (4) modular architecture supporting future LLM-based enhancements.

Implemented using Next.js, React, PostgreSQL, and Prisma, the system successfully demonstrates that effective adaptive learning adapted to developing-country contexts need not require complex machine learning—principled rule-based selection grounded in cognitive science (retrieval practice, spacing effect, difficulty-matching) provides a pragmatic, scalable, and interpretable alternative suitable for resource-constrained Nepali educational environments.

The system was validated with a question bank spanning three age groups (6-8, 9-11, 12-14) aligned with Nepal's school system, a complete audit trail for algorithm transparency, and administrative dashboards for educator oversight. Questions were sourced from WHO child protection standards, UNICEF educational guidelines, and Nepal Police traffic regulations. This work contributes to accessible adaptive learning technology for pediatric health education in Nepal and similar South Asian contexts.

---

**Word Count:** ~2,800 words | **Estimated Pages:** 8-9 pages (standard formatting)

---

_End of Report_
