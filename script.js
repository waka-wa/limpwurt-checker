const SKILL_NAME = 'hitpoints';
const STARTING_EXP = 16290962; 
const START_TIME = 1708977600;
const TOTAL_ESSENCE_NEEDED = 208000;
const TOTAL_MINOTAURS_NEEDED = 320000;
const CACHE_DURATION = 600000;

let minotaursKilledManually = 0;
let cachedData = null;
let cacheTimestamp = 0;

async function fetchPlayerEXP() {
  const currentTime = Date.now();

  if (cachedData && currentTime - cacheTimestamp < CACHE_DURATION) {
    console.log('Using cached data');
    return cachedData;
  }

  const url = 'https://corsproxy.io/?https://secure.runescape.com/m=hiscore_oldschool/index_lite.json?player=OneChunkUp';

  try {
    const response = await fetch(url);
    const jsonData = await response.json();
    const hitpointsData = jsonData.skills.find(skill => skill.id === 4);
    const xp = hitpointsData.xp;

    console.log('Hitpoints XP:', xp);
    cachedData = xp;
    cacheTimestamp = currentTime;
    return xp;
  } catch (error) {
    console.error('Error fetching Hitpoints XP:', error);
    return null;
  }
}

function updateMinotaurCount() {
  minotaursKilledManually++;
  updateResult();
}

async function updateResult() {
  const loadingElement = document.getElementById('loading');
  loadingElement.style.display = 'block';

  const currentHitpointsExp = await fetchPlayerEXP();
  console.log('Current Hitpoints EXP:', currentHitpointsExp);

  if (currentHitpointsExp !== null) {
    const expGained = currentHitpointsExp - STARTING_EXP;
    console.log('EXP Gained:', expGained);

    const calculatedMinotaursKilled = Math.floor(expGained / 13.3);
    console.log('Calculated Minotaurs Killed:', calculatedMinotaursKilled);

    const totalMinotaursKilled = calculatedMinotaursKilled + minotaursKilledManually;

    const currentTime = Math.floor(Date.now() / 1000);
    const elapsedSeconds = currentTime - START_TIME;
    const minutesElapsed = elapsedSeconds / 60;
    const minotaursPerMinute = totalMinotaursKilled / minutesElapsed;
    const minotaursPerDay = minotaursPerMinute * 1440;

    const pureRuneEssence = Math.floor(totalMinotaursKilled / 20.2) * 15;
    const remainingEssence = Math.max(TOTAL_ESSENCE_NEEDED - pureRuneEssence, 0);
    const remainingMinotaurs = Math.max(TOTAL_MINOTAURS_NEEDED - totalMinotaursKilled, 0);

    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `
    <div class="minotaurs-killed">
      <p>
        <img src="Ensouled_minotaur_head.webp" alt="Minotaur Head">
        Limpwurt has slain ~ <span class="spoiler" data-spoiler="${totalMinotaursKilled.toLocaleString()}">[SPOILER]</span> Minotaurs, ~  
        <span class="spoiler" data-spoiler="${remainingMinotaurs.toLocaleString()}">[SPOILER]</span> more to go.
        <img src="Ensouled_minotaur_head.webp" alt="Minotaur Head">
      </p>
      <p>
        <img src="Pure_essence.webp" alt="Pure Essence">
        Pure Rune Essence obtained: ~ <span class="spoiler" data-spoiler="${pureRuneEssence.toLocaleString()}">[SPOILER]</span> -  
        of ${TOTAL_ESSENCE_NEEDED.toLocaleString()} needed
        <img src="Pure_essence.webp" alt="Pure Essence">  
      </p>
      <p class="hint">(All values are approximations. Click on [SPOILER] to reveal)</p>
      <div>
        <p>
          <span class="spoiler" data-spoiler-image="most_recent_post.webp">[SPOILER] - Recent posted progress (April 17th)</span>
        </p>
      </div>
    </div>
  `;

  const spoilerElements = document.querySelectorAll('.spoiler');
  spoilerElements.forEach(spoiler => {
    spoiler.addEventListener('click', () => {
      if (spoiler.classList.contains('revealed')) {
        if (spoiler.dataset.spoilerImage) {
          spoiler.textContent = spoiler.dataset.spoilerText;
        } else {
          spoiler.textContent = '[SPOILER]';
        }
        spoiler.classList.remove('revealed');
      } else {
        if (spoiler.dataset.spoilerImage) {
          const imageSrc = spoiler.dataset.spoilerImage;
          spoiler.dataset.spoilerText = spoiler.textContent;
          spoiler.innerHTML = `<img src="${imageSrc}" alt="Recent posted progress (April 17th)">`;
        } else {
          spoiler.textContent = spoiler.dataset.spoiler;
        }
        spoiler.classList.add('revealed');
      }
    });
  });
  } else {
    console.error('Failed to fetch Hitpoints XP.');
  }

  loadingElement.style.display = 'none';
}

updateResult();