// Book insights and prompts organized by book ID
export const bookInsights = {
  '1': [ // Mindset by Carol Dweck
    {
      insight: "Growth mindset sees challenges as opportunities for learning and development.",
      prompt: "Reflect on a recent challenge you faced. How might viewing it as an opportunity for growth change your approach?"
    },
    {
      insight: "Intelligence and talents can be developed through dedication and hard work.",
      prompt: "What's one skill you've improved through practice? How did your mindset influence that improvement?"
    },
    {
      insight: "Failure is not evidence of unintelligence but an opportunity to learn and grow.",
      prompt: "Describe a time when you learned from a failure. What did you discover about yourself?"
    }
  ],
  '2': [ // How to Win Friends and Influence People by Dale Carnegie
    {
      insight: "People crave sincere appreciation more than almost anything else.",
      prompt: "Who deserves your genuine appreciation today? What specific quality do you value in them?"
    },
    {
      insight: "To be interesting to others, be genuinely interested in them first.",
      prompt: "What meaningful question could you ask someone today to better understand their perspective?"
    },
    {
      insight: "You can change how others feel by changing your approach to them.",
      prompt: "Consider a difficult relationship in your life. How might changing your approach improve the dynamic?"
    }
  ],
  '3': [ // The Subtle Art of Not Giving a F*ck by Mark Manson
    {
      insight: "True happiness comes from solving problems, not avoiding them.",
      prompt: "What challenging problem in your life, if solved, would bring you meaningful satisfaction?"
    },
    {
      insight: "Choosing what to care about is more important than caring about everything.",
      prompt: "What are you giving too much emotional energy to that doesn't align with your values?"
    },
    {
      insight: "Taking responsibility for everything in your life is the first step toward change.",
      prompt: "In what situation could taking more responsibility (even if it wasn't your fault) lead to positive change?"
    }
  ],
  '4': [ // Man's Search for Meaning by Viktor Frankl
    {
      insight: "We cannot control what happens to us, but we can always control how we respond.",
      prompt: "What challenging circumstance are you facing that you can't control? How might you choose your response?"
    },
    {
      insight: "Finding meaning in suffering allows us to endure life's greatest challenges.",
      prompt: "Reflect on a difficult period in your life. What meaning or purpose emerged from that experience?"
    },
    {
      insight: "The pursuit of meaning, not happiness, leads to a fulfilled life.",
      prompt: "What meaningful activity or purpose gives your life significance beyond momentary happiness?"
    }
  ],
  '14': [ // The Power of Habit by Charles Duhigg
    {
      insight: "Habits follow a cycle of cue, routine, and reward that can be reprogrammed.",
      prompt: "What habit would you like to change? Try identifying its cue, routine, and reward."
    },
    {
      insight: "Keystone habits create a ripple effect that transforms other areas of life.",
      prompt: "What small habit, if established, might create positive changes across multiple areas of your life?"
    },
    {
      insight: "Willpower is a limited resource that can be strengthened like a muscle.",
      prompt: "When during the day is your willpower strongest? How could you use this insight to build better habits?"
    }
  ],
  '7': [ // Deep Work by Cal Newport
    {
      insight: "Concentrated, distraction-free work produces rare and valuable results.",
      prompt: "What important task would benefit most from your undivided attention? How could you create space for deep work?"
    },
    {
      insight: "The ability to focus intensely is becoming increasingly valuable as distractions multiply.",
      prompt: "What distractions most frequently interrupt your focused work? What boundaries could you establish?"
    },
    {
      insight: "Regular periods of deep work train your brain to concentrate more effectively.",
      prompt: "How might you schedule a daily deep work session? What would make this time sacred and protected?"
    }
  ]
};

// Default insights for when there's no book selected
export const defaultInsights = [
  {
    insight: "Self-reflection leads to greater self-awareness and personal growth.",
    prompt: "What pattern in your life would you like to understand better through journaling?"
  },
  {
    insight: "Regularly writing about your experiences helps process emotions and find clarity.",
    prompt: "What recent experience still feels unresolved? Try exploring it through writing."
  },
  {
    insight: "Journaling creates a record of your growth journey and evolving perspective.",
    prompt: "What's something you understand differently now compared to a year ago?"
  }
]; 