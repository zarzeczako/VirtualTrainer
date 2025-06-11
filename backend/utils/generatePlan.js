// backend/utils/generatePlan.js

const Exercise = require('../models/Exercise');

const kategorie = [
  'Push',
  'Pull',
  'Legs',
  'Full body',
  'Core',
  'Cardio',
  'HIIT',
  'Stretching + Mobility'
];

const losujRestIndexes = () => {
  const candidates = [];
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      if (i !== j && Math.abs(i - j) > 1) {
        candidates.push([i, j]);
      }
    }
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
};

const losujZBazy = async (category, level, gender, goal) => {
  const filter = {
    category,
    level,
    goal,
    $or: [{ gender }, { gender: 'uniwersalne' }]
  };
  const result = await Exercise.aggregate([
    { $match: filter },
    { $sample: { size: 3 } }
  ]);
  return result.map((ex) => ex.name);
};

const generatePlan = async (goal, gender, level) => {
  const dostępneKategorie = [...kategorie];

  const shuffled = dostępneKategorie
    .map((c) => ({ c, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((x) => x.c);

  const [restA, restB] = losujRestIndexes();

  const fullPlan = new Array(7);

  fullPlan[restA] = { nazwa: 'Odpoczynek', ćwiczenia: [] };
  fullPlan[restB] = { nazwa: 'Odpoczynek', ćwiczenia: [] };

  let idxKat = 0;
  for (let i = 0; i < 7; i++) {
    if (!fullPlan[i]) {
      const cat = shuffled[idxKat % shuffled.length];
      const cwiczenia = await losujZBazy(cat, level, gender, goal);
      fullPlan[i] = {
        nazwa: cat,
        ćwiczenia: Array.isArray(cwiczenia) ? cwiczenia : []
      };
      idxKat++;
    }
  }

  return fullPlan;
};

module.exports = generatePlan;
