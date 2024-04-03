const startingExp = 20041506;
const startTime = 1708977600;
let minotaursKilled = 0;

async function fetchPlayerEXP() {
  const apiUrl = `https://osrs-hiscore-pulling.onrender.com/stats/OneChunkUp?skill=ranged`;
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log('API Response:', data);
    return data.experience;
  } catch (error) {
    console.error('Error fetching player EXP:', error);
    return null;
  }
}

function updateMinotaurCount() {
  minotaursKilled++;
  updateResult();
}

async function updateResult() {
  const loadingElement = document.getElementById('loading');
  loadingElement.style.display = 'block';

  const currentExp = await fetchPlayerEXP();
  console.log('Current EXP:', currentExp);

  if (currentExp !== null) {
    const expGained = currentExp - startingExp;
    console.log('EXP Gained:', expGained);
    
    const calculatedMinotaursKilled = Math.floor(expGained / 40);
    console.log('Calculated Minotaurs Killed:', calculatedMinotaursKilled);
    
    const totalMinotaursKilled = calculatedMinotaursKilled + minotaursKilled;
    
    const currentTime = Math.floor(Date.now() / 1000);
    const elapsedSeconds = currentTime - startTime;
    
    const minutesElapsed = elapsedSeconds / 60;
    const minotaursPerMinute = totalMinotaursKilled / minutesElapsed;
    const minotaursPerDay = minotaursPerMinute * 1440;
    
    const pureRuneEssence = Math.floor(totalMinotaursKilled / 20.2) * 15;
    
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `
      <p>OneChunkUp has killed approximately ${totalMinotaursKilled} Minotaurs.</p>
      <p>Minotaurs killed per minute: ${minotaursPerMinute.toFixed(2)}</p>
      <p>Minotaurs killed per day: ${Math.floor(minotaursPerDay)}</p>
      <p>Estimated Pure Rune Essence obtained: ${pureRuneEssence}</p>
    `;
  } else {
    console.error('Failed to fetch player EXP.');
  }

  loadingElement.style.display = 'none';
}

const CACHE_DURATION = 600000; // Cache for 10 minutes
let cachedData = null;
let cacheTimestamp = 0;

async function fetchPlayerEXP() {
  const currentTime = Date.now();
  if (cachedData && currentTime - cacheTimestamp < CACHE_DURATION) {
    console.log('Using cached data');
    return cachedData;
  }

  const apiUrl = `https://osrs-hiscore-pulling.onrender.com/stats/OneChunkUp?skill=ranged`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log('API Response:', data);
    cachedData = data.experience;
    cacheTimestamp = currentTime;
    return data.experience;
  } catch (error) {
    console.error('Error fetching player EXP:', error);
    return null;
  }
}

updateResult();