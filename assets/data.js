/* ══════════ SHARED DATA ══════════ */

const GOAL_LABELS = { muscle:'Muscle gain', fatLoss:'Fat loss', maintenance:'Maintenance' };

const GOAL_TIPS = {
  muscle:'Aim for higher-protein, higher-calorie meals like ofada rice with chicken or egusi soup, paired with heavier compound lifts, to fuel growth.',
  fatLoss:'Lean on fibre-rich, lower-calorie meals like beans porridge or pepper soup, paired with metabolic circuits, to stay full on fewer calories.',
  maintenance:'Balance your plate across protein, carbs and vegetables, and keep training varied — consistency is what keeps a week sustainable.'
};

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const TODAY_NAME = DAYS[(new Date().getDay()+6)%7]; // Mon=0

const MEALS = [
  { id:'moimoi-egg', name:'Moi Moi + Boiled Egg', desc:'High-protein steamed bean pudding with a boiled egg — great for recovery and sustained energy.', cal:355, protein:21, goals:['muscle','maintenance'] },
  { id:'ofada-chicken', name:'Ofada Rice + Stewed Chicken', desc:'Balanced carbs and lean protein from local ofada rice and pepper-stewed chicken.', cal:610, protein:38, goals:['muscle'] },
  { id:'beans-porridge', name:'Beans Porridge with Vegetables', desc:'Fibre-rich beans and greens that keep you full while supporting fat loss and gut health.', cal:420, protein:19, goals:['fatLoss','maintenance'] },
  { id:'fish-suya', name:'Grilled Fish Suya', desc:'Lean grilled fish coated in suya spice — high protein, low fat, great post-workout.', cal:340, protein:34, goals:['fatLoss','muscle'] },
  { id:'ogi-akamu', name:'Ogi (Akamu) with Nuts', desc:'Light, nutrient-dense fermented corn pap topped with groundnuts for steady energy.', cal:230, protein:7, goals:['fatLoss','maintenance'] },
  { id:'okra-eba', name:'Okra Soup + Eba', desc:'Vitamin-packed okra soup with a filling cassava swallow and lean protein base.', cal:480, protein:24, goals:['maintenance','muscle'] },
  { id:'jollof-chicken', name:'Jollof Rice + Grilled Chicken', desc:'Classic smoky jollof paired with grilled, not fried, chicken breast for clean protein.', cal:560, protein:36, goals:['muscle'] },
  { id:'egusi-fufu', name:'Egusi Soup + Fufu', desc:'Melon-seed soup rich in healthy fats and protein, served with a fufu swallow.', cal:650, protein:28, goals:['muscle','maintenance'] },
  { id:'plantain-egg', name:'Boiled Plantain + Scrambled Eggs', desc:'Slow-release carbs from unripe plantain with protein-rich scrambled eggs.', cal:390, protein:18, goals:['fatLoss','maintenance'] },
  { id:'pepper-soup', name:'Goat Meat Pepper Soup', desc:'Spicy, broth-based soup that is naturally low in carbs and high in protein.', cal:310, protein:30, goals:['fatLoss'] },
  { id:'akara-bread', name:'Akara + Wholemeal Bread', desc:'Bean fritters with wholemeal bread — a protein-forward breakfast classic.', cal:400, protein:17, goals:['muscle','maintenance'] },
  { id:'tuwo-miyan', name:'Tuwo Shinkafa + Miyan Kuka', desc:'Rice swallow with baobab-leaf soup, light on fat and rich in micronutrients.', cal:430, protein:16, goals:['fatLoss','maintenance'] },
  { id:'unripe-plantain-fish', name:'Unripe Plantain Porridge + Fish', desc:'Fibrous unripe plantain porridge with fish — filling with a moderate calorie load.', cal:450, protein:26, goals:['fatLoss','muscle'] },
  { id:'yam-egg-sauce', name:'Boiled Yam + Egg Sauce', desc:'A simple, high-carb post-workout combo with protein from sauced eggs.', cal:520, protein:20, goals:['muscle'] },
  { id:'salad-chicken', name:'Nigerian Salad + Grilled Chicken', desc:'Cabbage, carrots, cucumber and sweet corn with lean grilled chicken on top.', cal:300, protein:29, goals:['fatLoss'] },
  { id:'oats-groundnut', name:'Oats with Roasted Groundnuts', desc:'A fibre and protein-rich breakfast or snack option, easy to prep ahead.', cal:280, protein:11, goals:['fatLoss','maintenance'] },
  { id:'efo-riro-rice', name:'Efo Riro + Brown Rice', desc:'Spinach-based vegetable soup loaded with micronutrients, served with brown rice.', cal:470, protein:22, goals:['maintenance','muscle'] },
  { id:'kilishi-snack', name:'Kilishi (Spiced Dried Beef)', desc:'High-protein, low-carb dried beef snack — convenient between-meal fuel.', cal:250, protein:33, goals:['muscle','fatLoss'] },
];

const WORKOUTS = [
  { id:'back-squat', name:'Barbell Back Squat', desc:'Heavy compound lift that builds total leg and glute mass over time.', sets:4, reps:'8', equip:'Barbell', goals:['muscle'] },
  { id:'bench-press', name:'Bench Press', desc:'Primary chest and triceps builder for upper-body strength and size.', sets:4, reps:'8', equip:'Barbell', goals:['muscle'] },
  { id:'deadlift', name:'Conventional Deadlift', desc:'Full posterior-chain lift for hamstrings, glutes and back thickness.', sets:4, reps:'6', equip:'Barbell', goals:['muscle'] },
  { id:'weighted-pullup', name:'Weighted Pull-Ups', desc:'Loaded vertical pull for a wider, stronger back.', sets:4, reps:'8', equip:'Pull-up bar', goals:['muscle'] },
  { id:'overhead-press', name:'Overhead Press', desc:'Standing press that builds shoulder size and core stability.', sets:3, reps:'10', equip:'Barbell', goals:['muscle'] },
  { id:'barbell-row', name:'Barbell Row', desc:'Horizontal pulling movement for back thickness and posture.', sets:4, reps:'10', equip:'Barbell', goals:['muscle','maintenance'] },
  { id:'kettlebell-swing', name:'Kettlebell Swings', desc:'Explosive hip-hinge that spikes heart rate while training the posterior chain.', sets:4, reps:'20', equip:'Kettlebell', goals:['fatLoss'] },
  { id:'jump-rope', name:'Jump Rope Intervals', desc:'Simple, equipment-light cardio that torches calories in short bursts.', sets:6, reps:'60 sec', equip:'Skipping rope', goals:['fatLoss'] },
  { id:'mountain-climbers', name:'Mountain Climbers', desc:'Fast-paced core and cardio combo that needs no equipment at all.', sets:4, reps:'40', equip:'Bodyweight', goals:['fatLoss'] },
  { id:'burpees', name:'Burpees', desc:'Full-body conditioning move that pairs strength with a cardio spike.', sets:4, reps:'15', equip:'Bodyweight', goals:['fatLoss'] },
  { id:'stair-sprints', name:'Stair Sprints', desc:'High-intensity intervals using stairs or a slope for fast fat-loss conditioning.', sets:6, reps:'30 sec', equip:'None', goals:['fatLoss'] },
  { id:'battle-ropes', name:'Battle Ropes', desc:'Upper-body endurance work that keeps the heart rate elevated throughout.', sets:4, reps:'30 sec', equip:'Battle ropes', goals:['fatLoss','maintenance'] },
  { id:'bw-squat', name:'Bodyweight Squats', desc:'Accessible lower-body movement to build a consistent training habit.', sets:3, reps:'15', equip:'Bodyweight', goals:['maintenance','fatLoss'] },
  { id:'pushups', name:'Push-Ups', desc:'Classic chest and triceps builder that scales to any fitness level.', sets:3, reps:'15', equip:'Bodyweight', goals:['maintenance'] },
  { id:'plank', name:'Plank Hold', desc:'Isometric core hold that reinforces posture and trunk stability.', sets:3, reps:'45 sec', equip:'Bodyweight', goals:['maintenance'] },
  { id:'walking-lunge', name:'Walking Lunges', desc:'Single-leg movement that builds balanced strength through the legs and hips.', sets:3, reps:'12 / leg', equip:'Bodyweight', goals:['maintenance','muscle'] },
  { id:'db-rdl', name:'Dumbbell Romanian Deadlift', desc:'Hinge pattern that strengthens hamstrings and lower back with light load.', sets:3, reps:'12', equip:'Dumbbells', goals:['maintenance','muscle'] },
  { id:'band-row', name:'Resistance Band Rows', desc:'Low-impact pulling exercise that is easy to fit into a busy week.', sets:3, reps:'15', equip:'Resistance band', goals:['maintenance'] },
];

const WEEK_SPLIT = [
  { day:'Monday', focus:'Push', note:'Chest, shoulders and triceps', rest:false },
  { day:'Tuesday', focus:'Pull', note:'Back and biceps', rest:false },
  { day:'Wednesday', focus:'Legs & Core', note:'Squats, hinges and trunk work', rest:false },
  { day:'Thursday', focus:'Conditioning', note:'Intervals or a fat-loss circuit', rest:false },
  { day:'Friday', focus:'Full Body', note:'Compound lifts across the whole body', rest:false },
  { day:'Saturday', focus:'Active Recovery', note:'Light cardio, mobility or a walk', rest:false },
  { day:'Sunday', focus:'Rest', note:'Full recovery day', rest:true },
];

const MONO_CLASS = { muscle:'mono-muscle', fatLoss:'mono-fatLoss', maintenance:'mono-maintenance' };

function monogram(item, size){
  const cls = MONO_CLASS[item.goals[0]] || 'mono-maintenance';
  const letter = item.name.trim().charAt(0).toUpperCase();
  return `<div class="monogram ${size==='sm'?'sm':''} ${cls}">${letter}</div>`;
}

/* ══════════ SHARED ICONS (inline SVG, currentColor) ══════════ */
const ICON = {
  close:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>',
  check:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 12 9 18 20 6"/></svg>',
  arrow:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></svg>',
  spark:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="12" y1="3" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="21"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg>',
  pin:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-7.2 7-12a7 7 0 0 0-14 0c0 4.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.4"/></svg>',
  plate:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>',
  dumbbell:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="9" width="3" height="6" rx="1"/><rect x="19" y="9" width="3" height="6" rx="1"/><rect x="6" y="7" width="2.4" height="10" rx="1"/><rect x="15.6" y="7" width="2.4" height="10" rx="1"/><line x1="8.4" y1="12" x2="15.6" y2="12"/></svg>',
  calendar:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/></svg>',
  chart:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="21" x2="5" y2="12"/><line x1="12" y1="21" x2="12" y2="7"/><line x1="19" y1="21" x2="19" y2="15"/><line x1="3" y1="21" x2="21" y2="21"/></svg>',
  menu:'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>',
};
