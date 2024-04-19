const TRACK_URL = 'https://crystalmathlabs.com/track.php?player=onechunkup&skill=hitpoints&time=all';
const STARTING_EXP = 16290962; 
const TOTAL_ESSENCE_NEEDED = 208000;
const TOTAL_MINOTAURS_NEEDED = 320000;

let minotaursKilled = 0;

async function fetchPlayerEXP() {
  const response = await fetch(TRACK_URL);
  const htmlString = await response.text();
  const doc = new DOMParser().parseFromString(htmlString, 'text/html');

  // Select the table row that contains HP XP data
  const row = doc.querySelector('tr.column_skill:nth-child(1)'); // targets the first tr.column_skill element

  if (row) {
    // Extract the text content from the second td element (which contains the XP value)
    const xpValue = row.querySelector('td:nth-child(2)').textContent.trim();
    return parseInt(xpValue.replace(/,/g, ''), 10); // removes commas and converts to integer
  } else {
    console.error('Failed to find HP XP data in the provided URL.');
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

  const currentHitpointsExp = await fetchPlayerEXP();
  console.log('Current Hitpoints EXP:', currentHitpointsExp);

  if (currentHitpointsExp !== null) {
    const expGained = currentHitpointsExp - STARTING_EXP;
    console.log('EXP Gained:', expGained);

    const calculatedMinotaursKilled = Math.floor(expGained / 13.3);
    console.log('Calculated Minotaurs Killed:', calculatedMinotaursKilled);

    const totalMinotaursKilled = calculatedMinotaursKilled + minotaursKilled;

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
          Limpwurt has slain ~<span class="green"><span class="math-inline">\{totalMinotaursKilled\.toLocaleString\(\)\}</span\> Minotaurs, 
\~<span class\="green"\></span>{remainingMinotaurs.toLocaleString()}</span> more to go.
          <img src="Ensouled_minotaur_head.webp" alt="Minotaur Head">
        </p>
        <div class="minotaurs-per-day">
          <p>Avg. killed per day: <span class="green"><span class="math-inline">\{Math\.floor\(minotaursPerDay\)\.toLocaleString\(\)\}</span\></p\>
</div\>
</div\>
<br\>
<p\>
<img src\="Pure\_essence\.webp" alt\="Pure Essence"\>
Pure Rune Essence obtained\: \~<span class\="green"\></span>{pureRuneEssence.toLocaleString()}</span>, 
        of ~${TOTAL_ESSENCE_NEEDED.toLocaleString()} needed
        <img src="Pure_essence.webp" alt="Pure Essence"> 
      </p>
    `;
  } else {

    console.error('Failed to fetch player EXP.');
  }

  loadingElement.style.display = 'none';
}

updateResult();