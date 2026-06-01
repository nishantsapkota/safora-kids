import { AI_POOL_MODULE } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

type Template = {
  subtopic: string;
  concept: string;
  objective: string;
  questions: string[];
  answer: string;
  distractors: string[];
  explanation: string;
};

type ModuleSeed = {
  key: string;
  prefix: string;
  count: number;
  templates: Template[];
};

const moduleConfig: ModuleSeed[] = [
  {
    key: "traffic_road_safety",
    prefix: "TRF",
    count: 70,
    templates: [
      {
        subtopic: "road_crossing",
        concept: "safe_road_crossing",
        objective: "Choose safe road crossing behaviour.",
        questions: [
          "What should you do before crossing a road?",
          "You reach a busy road. What is the safest first step?",
          "Where should a child cross the road when a crossing is nearby?"
        ],
        answer: "Stop, look both ways, and cross at a safe place",
        distractors: ["Run before vehicles arrive", "Cross between parked buses", "Close your eyes and follow others", "Cross while playing"],
        explanation: "Stopping and looking both ways helps you notice vehicles before crossing."
      },
      {
        subtopic: "traffic_lights",
        concept: "traffic_light_meaning",
        objective: "Understand traffic light signals.",
        questions: [
          "What does a red traffic light mean for pedestrians and vehicles?",
          "At a crossing, the light turns red. What should you do?",
          "Which traffic signal tells you to wait?"
        ],
        answer: "Stop and wait until it is safe",
        distractors: ["Go faster", "Stand in the middle of the road", "Ignore the signal", "Wave at vehicles to stop"],
        explanation: "A red light means stop. Waiting keeps everyone safer."
      },
      {
        subtopic: "bus_safety",
        concept: "safe_bus_behaviour",
        objective: "Practise safe bus entry and exit.",
        questions: [
          "What should you do while waiting for a school bus?",
          "How should you get off a bus safely?",
          "What is safe behaviour inside a moving bus?"
        ],
        answer: "Wait in line and hold the handrail",
        distractors: ["Push others to enter first", "Jump from the bus step", "Lean out of the window", "Stand near the door while playing"],
        explanation: "Waiting calmly and using the handrail lowers the chance of falling."
      },
      {
        subtopic: "helmet_safety",
        concept: "helmet_use",
        objective: "Know why helmets are important.",
        questions: [
          "What should you wear when riding a bicycle or motorbike?",
          "Why is a helmet important on a two-wheeler?",
          "Which choice protects your head while cycling?"
        ],
        answer: "Wear a properly fitted helmet",
        distractors: ["Carry the helmet in your hand", "Wear a loose cap instead", "Share one helmet with two people", "Skip it for short trips"],
        explanation: "A properly fitted helmet protects your head during a fall."
      },
      {
        subtopic: "walking_safely",
        concept: "footpath_safety",
        objective: "Choose safe walking habits.",
        questions: [
          "Where should you walk when there is a footpath?",
          "What should you do while walking near traffic?",
          "Which habit is safest when walking to school?"
        ],
        answer: "Use the footpath and stay away from the road edge",
        distractors: ["Walk in the road lane", "Chase friends near vehicles", "Look only at a phone", "Walk behind reversing vehicles"],
        explanation: "The footpath separates you from moving vehicles."
      }
    ]
  },
  {
    key: "natural_disaster_preparedness",
    prefix: "DIS",
    count: 70,
    templates: [
      {
        subtopic: "earthquake",
        concept: "earthquake_drop_cover_hold",
        objective: "Know safe earthquake actions.",
        questions: [
          "What should you do first during an earthquake indoors?",
          "The ground starts shaking in class. What is safest?",
          "Which action protects you from falling objects in an earthquake?"
        ],
        answer: "Drop, cover, and hold on",
        distractors: ["Run down the stairs immediately", "Stand near a window", "Use the lift", "Push classmates outside"],
        explanation: "Drop, cover, and hold on protects you from falling items until shaking stops."
      },
      {
        subtopic: "flood",
        concept: "flood_safe_place",
        objective: "Identify safer flood behaviour.",
        questions: [
          "Where should you go if flood water is rising?",
          "What should you avoid during a flood?",
          "A road is covered by moving flood water. What should you do?"
        ],
        answer: "Move to higher ground with an adult",
        distractors: ["Play in the water", "Cross the flooded road", "Hide near a riverbank", "Touch electric poles in water"],
        explanation: "Higher ground is safer because flood water can move quickly."
      },
      {
        subtopic: "landslide",
        concept: "landslide_warning",
        objective: "Recognize landslide risk.",
        questions: [
          "What should you do if rocks start falling on a hill road?",
          "Which place is unsafe during heavy rain in hilly areas?",
          "What is a warning sign of landslide danger?"
        ],
        answer: "Move away from the slope and tell an adult",
        distractors: ["Stand below the slope to watch", "Collect fallen stones", "Shelter under loose soil", "Walk across cracks alone"],
        explanation: "Moving away from the slope reduces danger from falling rocks or soil."
      },
      {
        subtopic: "fire_drill",
        concept: "fire_exit_plan",
        objective: "Follow calm fire drill steps.",
        questions: [
          "What should you do when a fire alarm rings at school?",
          "How should a class leave during a fire drill?",
          "Which action helps everyone during a fire drill?"
        ],
        answer: "Line up calmly and follow the exit route",
        distractors: ["Run and shout", "Hide in the classroom", "Go back for toys", "Block the doorway"],
        explanation: "A calm line helps everyone leave safely and quickly."
      },
      {
        subtopic: "emergency_bag",
        concept: "emergency_bag_items",
        objective: "Know useful emergency supplies.",
        questions: [
          "Which item belongs in an emergency bag?",
          "What should families keep ready for disasters?",
          "Which emergency bag item helps you see at night?"
        ],
        answer: "Water, flashlight, and basic first aid items",
        distractors: ["Only video games", "Heavy glass decorations", "Open food without a container", "Sharp tools for children"],
        explanation: "Water, light, and first aid supplies help during an emergency."
      }
    ]
  },
  {
    key: "household_occupational_hazards",
    prefix: "HAZ",
    count: 70,
    templates: [
      {
        subtopic: "electricity",
        concept: "electric_shock_safety",
        objective: "Avoid unsafe electrical contact.",
        questions: [
          "What should you do before touching a damaged wire?",
          "You see a loose electric wire. What is safest?",
          "Which action helps prevent electric shock?"
        ],
        answer: "Stay away and call a trusted adult",
        distractors: ["Touch it quickly", "Pull it with wet hands", "Cover it with paper", "Ask a younger child to check"],
        explanation: "Damaged wires can shock you, so an adult should handle them."
      },
      {
        subtopic: "kitchen",
        concept: "kitchen_heat_safety",
        objective: "Know safe kitchen behaviour.",
        questions: [
          "What should you do near a hot stove?",
          "Which kitchen item should children use only with adult help?",
          "A pan is hot on the stove. What is safest?"
        ],
        answer: "Keep distance and ask an adult for help",
        distractors: ["Grab the pan handle", "Play beside the stove", "Touch steam to test it", "Run through the kitchen"],
        explanation: "Heat and steam can burn, so children should ask an adult."
      },
      {
        subtopic: "sharp_tools",
        concept: "sharp_tool_safety",
        objective: "Handle sharp tools safely.",
        questions: [
          "What should you do if you need scissors or a knife?",
          "Which behaviour is safe around sharp tools?",
          "You find a sharp blade on a table. What should you do?"
        ],
        answer: "Ask an adult and use tools carefully",
        distractors: ["Run while holding it", "Point it at a friend", "Hide it in your pocket", "Use it as a toy"],
        explanation: "Sharp tools can cut, so careful use and adult help are important."
      },
      {
        subtopic: "medicine",
        concept: "medicine_safety",
        objective: "Know medicine safety rules.",
        questions: [
          "What should you do before taking medicine?",
          "You find colourful tablets. What is safest?",
          "Who should give medicine to a child?"
        ],
        answer: "Take medicine only from a trusted adult",
        distractors: ["Taste it like candy", "Share it with friends", "Guess the amount", "Take it because it looks nice"],
        explanation: "Medicine can be harmful if it is the wrong type or amount."
      },
      {
        subtopic: "cleaning_liquids",
        concept: "chemical_safety",
        objective: "Avoid unsafe chemicals.",
        questions: [
          "What should you do with cleaning liquids?",
          "A bottle has a strong smell and warning label. What is safest?",
          "Which habit prevents chemical accidents?"
        ],
        answer: "Do not touch or taste it; tell an adult",
        distractors: ["Mix it with another liquid", "Smell it closely", "Pour it into a cup", "Use it to wash hands"],
        explanation: "Cleaning liquids can hurt skin, eyes, or stomach, so adults should handle them."
      }
    ]
  },
  {
    key: "basic_first_aid",
    prefix: "FAD",
    count: 70,
    templates: [
      {
        subtopic: "small_cut",
        concept: "small_cut_care",
        objective: "Know basic care for small cuts.",
        questions: [
          "What should you do for a small cut?",
          "A friend has a small bleeding cut. What is safest?",
          "Which first aid step helps keep a small cut clean?"
        ],
        answer: "Tell an adult and clean it gently",
        distractors: ["Rub mud on it", "Ignore it all day", "Use a dirty cloth", "Scratch around it"],
        explanation: "Cleaning a small cut and telling an adult helps prevent infection."
      },
      {
        subtopic: "burn",
        concept: "minor_burn_care",
        objective: "Know safe first aid for a minor burn.",
        questions: [
          "What should you do for a minor burn?",
          "Hot tea touches your hand. What is safest first?",
          "Which action helps cool a minor burn?"
        ],
        answer: "Cool it with clean running water and tell an adult",
        distractors: ["Put toothpaste on it", "Cover it with dirt", "Touch it repeatedly", "Hide it from adults"],
        explanation: "Cool running water helps reduce heat in a minor burn."
      },
      {
        subtopic: "nosebleed",
        concept: "nosebleed_response",
        objective: "Respond safely to a nosebleed.",
        questions: [
          "What should you do during a nosebleed?",
          "A classmate has a nosebleed. Which action helps?",
          "How should you sit when your nose is bleeding?"
        ],
        answer: "Sit up, lean slightly forward, and tell an adult",
        distractors: ["Lie flat on your back", "Put the head far backward", "Run around", "Blow the nose hard again and again"],
        explanation: "Leaning slightly forward is safer and an adult can help."
      },
      {
        subtopic: "help_calling",
        concept: "asking_for_help",
        objective: "Know when to get adult help.",
        questions: [
          "What should you do if someone is badly hurt?",
          "Who should you call when an injury looks serious?",
          "Which action is best when you are unsure how to help?"
        ],
        answer: "Call a trusted adult or emergency helper",
        distractors: ["Keep it secret", "Move the person roughly", "Laugh and walk away", "Try every treatment you know"],
        explanation: "A trusted adult or emergency helper can give the right support."
      },
      {
        subtopic: "clean_bandage",
        concept: "clean_bandage_use",
        objective: "Use clean covering for wounds.",
        questions: [
          "What should cover a clean small wound?",
          "Which cloth is safest for covering a cut?",
          "Why should a bandage be clean?"
        ],
        answer: "Use a clean bandage or clean cloth",
        distractors: ["Use a dusty rag", "Use a leaf from the ground", "Leave dirt inside", "Use a shared dirty towel"],
        explanation: "A clean bandage helps protect the wound from germs."
      }
    ]
  },
  {
    key: "good_habits_hygiene",
    prefix: "HYG",
    count: 35,
    templates: [
      {
        subtopic: "handwashing",
        concept: "handwashing_timing",
        objective: "Know when to wash hands.",
        questions: [
          "When should you wash your hands?",
          "What should you do before eating?",
          "Which habit helps remove germs from hands?"
        ],
        answer: "Wash with soap before eating and after toilet use",
        distractors: ["Wipe hands on clothes only", "Wash only once a week", "Use dirty water", "Skip soap after playing outside"],
        explanation: "Soap and water remove many germs from hands."
      },
      {
        subtopic: "clean_water",
        concept: "safe_drinking_water",
        objective: "Choose safe drinking water.",
        questions: [
          "Which water is safest to drink?",
          "What should you do if water looks dirty?",
          "Which habit helps prevent sickness from water?"
        ],
        answer: "Drink clean, treated, or boiled water",
        distractors: ["Drink from puddles", "Drink water with dirt in it", "Share an unwashed cup", "Drink from an unknown stream"],
        explanation: "Clean, treated, or boiled water is safer for your body."
      },
      {
        subtopic: "dental_care",
        concept: "teeth_brushing",
        objective: "Know basic dental hygiene.",
        questions: [
          "How can you care for your teeth every day?",
          "Which habit helps keep teeth clean?",
          "What should you do before sleeping to protect teeth?"
        ],
        answer: "Brush teeth regularly with toothpaste",
        distractors: ["Eat sweets after brushing", "Never rinse the mouth", "Use someone else's toothbrush", "Brush only once a month"],
        explanation: "Regular brushing helps remove food and protect teeth."
      },
      {
        subtopic: "food_safety",
        concept: "safe_food_habit",
        objective: "Choose safer food habits.",
        questions: [
          "What should you do before eating fruit?",
          "Which food habit is safest?",
          "How can you make snacks safer to eat?"
        ],
        answer: "Wash fruits and eat clean, covered food",
        distractors: ["Eat food dropped on the ground", "Eat uncovered food with flies", "Share a dirty plate", "Eat with unwashed hands"],
        explanation: "Clean food lowers the chance of stomach sickness."
      },
      {
        subtopic: "sleep",
        concept: "healthy_sleep",
        objective: "Know why sleep matters.",
        questions: [
          "Why is enough sleep important?",
          "Which habit helps your body rest?",
          "What should you do on a school night?"
        ],
        answer: "Sleep on time so your body and mind can rest",
        distractors: ["Stay awake all night gaming", "Skip sleep before school", "Drink lots of soda at bedtime", "Sleep only in class"],
        explanation: "Enough sleep helps children learn, grow, and feel better."
      }
    ]
  },
  {
    key: AI_POOL_MODULE,
    prefix: "AIQ",
    count: 35,
    templates: [
      {
        subtopic: "adaptive_review",
        concept: "reviewing_wrong_answers",
        objective: "Use feedback to improve.",
        questions: [
          "What should you do after getting a safety question wrong?",
          "How can feedback help you learn?",
          "What is the best way to review a missed question?"
        ],
        answer: "Read the explanation and try to understand the safe choice",
        distractors: ["Skip the explanation", "Choose faster next time without reading", "Forget the topic", "Blame the question"],
        explanation: "Reading feedback helps you learn why the safe answer is correct."
      },
      {
        subtopic: "weak_concept_practice",
        concept: "practicing_weak_topics",
        objective: "Practise weak topics calmly.",
        questions: [
          "Why might the game repeat a weak topic?",
          "What should you do when a question appears again?",
          "How does practice help with safety learning?"
        ],
        answer: "Practise again so the idea stays in memory",
        distractors: ["Guess without reading", "Stop learning that topic", "Click any answer quickly", "Ask the game to hide weak topics"],
        explanation: "Repeating weak topics helps build stronger memory."
      },
      {
        subtopic: "scenario_reasoning",
        concept: "choosing_safest_scenario_action",
        objective: "Apply safety knowledge to situations.",
        questions: [
          "In a safety scenario, how should you choose an answer?",
          "What should you think about before answering a situation question?",
          "Which strategy helps with harder safety questions?"
        ],
        answer: "Think about which action keeps people safest",
        distractors: ["Pick the funniest answer", "Choose the shortest option", "Copy the first option every time", "Ignore the situation"],
        explanation: "Scenario questions test how you use safety ideas in real life."
      },
      {
        subtopic: "retention_check",
        concept: "remembering_over_time",
        objective: "Understand spaced review.",
        questions: [
          "Why does the game ask some questions after a few days?",
          "What does remembering a topic later show?",
          "How can spaced review help you?"
        ],
        answer: "It checks that you remember the safety idea over time",
        distractors: ["It is only random", "It means the first answer did not count", "It is punishment", "It removes your progress"],
        explanation: "Spaced review checks real understanding, not just quick guessing."
      }
    ]
  }
];

const depthPrompts = [
  "Choose the correct safety rule.",
  "Choose the answer that explains the rule best.",
  "Choose what you would do in this situation.",
  "Choose the safest action and reason carefully."
];

function rotate<T>(items: T[], offset: number) {
  return items.map((_, index) => items[(index + offset) % items.length]);
}

export function buildQuestionBank() {
  return moduleConfig.flatMap((module) =>
    Array.from({ length: module.count }, (_, index) => {
      const n = index + 1;
      const depth = (index % 4) + 1;
      const difficulty = depth <= 1 ? "easy" : depth === 2 || depth === 3 ? "medium" : "hard";
      const ageGroup = index % 3 === 0 ? "6-8" : index % 3 === 1 ? "9-11" : "12-14";
      const template = module.templates[index % module.templates.length];
      const questionText = template.questions[Math.floor(index / module.templates.length) % template.questions.length];
      const distractors = rotate(template.distractors, index).slice(0, 3);

      return {
        id: `${module.prefix}_${String(n).padStart(3, "0")}`,
        module: module.key,
        subtopic: template.subtopic,
        difficulty,
        ageGroup,
        question: `${questionText} ${depthPrompts[depth - 1]}`,
        options: [template.answer, ...distractors],
        correctAnswer: 0,
        explanation: template.explanation,
        learningObjective: template.objective,
        masteryConcept: template.concept,
        variantGroup: `${template.subtopic}_v${Math.floor(index / module.templates.length) + 1}`,
        repeatPriority: depth,
        aiEligible: true,
        conceptDepth: depth
      };
    })
  );
}

export async function seedQuestions() {
  const questions = buildQuestionBank();
  for (const question of questions) {
    await prisma.question.upsert({ where: { id: question.id }, create: question, update: question });
  }
  return questions.length;
}
