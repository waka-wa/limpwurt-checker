const startingExp = 16290962;
const startTime = 1708977600;
const totalEssenceNeeded = 208000;
const totalMinotaursNeeded = 320000;
let minotaursKilled = 0;

async function fetchPlayerEXP() {
  const currentTime = Date.now();
  if (cachedData && currentTime - cacheTimestamp < CACHE_DURATION) {
    console.log('Using cached data');
    return cachedData;
  }

  const apiUrl = `https://jpx3bpeukc.execute-api.us-east-2.amazonaws.com/osrshiscorepuller/stats?username=OneChunkUp&skill=hitpoints`;

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
    const calculatedMinotaursKilled = Math.floor(expGained / 13.3);
    console.log('Calculated Minotaurs Killed:', calculatedMinotaursKilled);
    const totalMinotaursKilled = calculatedMinotaursKilled + minotaursKilled;
    const currentTime = Math.floor(Date.now() / 1000);
    const elapsedSeconds = currentTime - startTime;
    const minutesElapsed = elapsedSeconds / 60;
    const minotaursPerMinute = totalMinotaursKilled / minutesElapsed;
    const minotaursPerDay = minotaursPerMinute * 1440;
    const pureRuneEssence = Math.floor(totalMinotaursKilled / 20.2) * 15;
    const remainingEssence = Math.max(totalEssenceNeeded - pureRuneEssence, 0);
    const remainingMinotaurs = Math.max(totalMinotaursNeeded - totalMinotaursKilled, 0);
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `
      <div class="minotaurs-killed">
        <p><img src="Ensouled_minotaur_head.webp" alt="Minotaur Head"> Limpwurt has slain ~<span class="green">${totalMinotaursKilled.toLocaleString()}</span> Minotaurs, ~<span class="green">${remainingMinotaurs.toLocaleString()}</span> more to go. <img src="Ensouled_minotaur_head.webp" alt="Minotaur Head"></p>
        <div class="minotaurs-per-day">
          <p>Avg. killed per day: <span class="green">${Math.floor(minotaursPerDay).toLocaleString()}</span></p>
        </div>
      </div>
      <br>
      <p><img src="Pure_essence.webp" alt="Pure Essence">  Pure Rune Essence obtained: ~<span class="green">${pureRuneEssence.toLocaleString()}</span>, of ~${totalEssenceNeeded.toLocaleString()} needed  <img src="Pure_essence.webp" alt="Pure Essence"></p>
    `;
  } else {
    console.error('Failed to fetch player EXP.');
  }

  loadingElement.style.display = 'none';
}

const CACHE_DURATION = 600000; // Cache for 10 minutes
let cachedData = null;
let cacheTimestamp = 0;

updateResult();