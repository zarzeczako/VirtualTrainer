const ćwiczenia = {
  Push: ['Wyciskanie sztangi', 'Pompki', 'Wyciskanie hantli siedząc'],
  Pull: ['Podciąganie', 'Wiosłowanie sztangą', 'Face pulls'],
  Legs: ['Przysiady', 'Martwy ciąg', 'Wykroki'],
  'Full body': ['Burpees', 'Przysiady', 'Pompki', 'Plank'],
  Core: ['Plank', 'Russian twists', 'Brzuszki'],
  Cardio: ['Bieg', 'Skakanie na skakance', 'Jumping jacks'],
  HIIT: ['Sprinty 20s/10s', 'Burpees', 'Mountain climbers'],
  Rest: [],
  'Stretching + Mobility': ['Rozciąganie nóg', 'Mobilizacja bioder', 'Rolowanie pleców']
};

const generateExercisesFor = (dayType) => ćwiczenia[dayType] || [];

module.exports = generateExercisesFor;
