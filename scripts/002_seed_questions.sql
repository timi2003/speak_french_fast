-- Seed sample questions for testing
INSERT INTO public.question_bank (module, skill_type, question_text, options, correct_answer, explanation, difficulty_level) VALUES
(
  'listening',
  'comprehension',
  'What is the main topic of the conversation?',
  '{"A": "Travel planning", "B": "Restaurant reservation", "C": "Weather forecast", "D": "Movie recommendation"}',
  'B',
  'The conversation clearly focuses on making a restaurant reservation for dinner.',
  'beginner'
),
(
  'reading',
  'comprehension',
  'According to the passage, what is the primary benefit of renewable energy?',
  '{"A": "It is cheaper than fossil fuels", "B": "It reduces environmental impact", "C": "It creates more jobs", "D": "It is more efficient"}',
  'B',
  'The passage emphasizes that renewable energy significantly reduces environmental impact and carbon emissions.',
  'intermediate'
),
(
  'writing',
  'composition',
  'Write an essay about the importance of learning a foreign language in the modern world (250-400 words).',
  '{}',
  '',
  'This is an open-ended writing task evaluated by AI for grammar, vocabulary, and structure.',
  'intermediate'
);

-- Seed daily tasks
INSERT INTO public.daily_tasks (day_number, task_type, instructions) VALUES
(1, 'listening', 'Listen to the audio and answer comprehension questions'),
(2, 'reading', 'Read the passage and answer multiple choice questions'),
(3, 'writing', 'Write an essay about your favorite hobby'),
(4, 'speaking', 'Record yourself describing a memorable travel experience'),
(5, 'listening', 'Complete the listening comprehension exercise');
