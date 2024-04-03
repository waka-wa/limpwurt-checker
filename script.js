const startDate = new Date('2024-02-26');
let minotaursKilled = 0;

function calculateDuration(startDate) {
  const currentDate = new Date();
  const timeDiff = currentDate.getTime() - startDate.getTime();
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  return `${days}d${remainingHours}h${remainingMinutes}m${remainingSeconds}s`;
}

async function fetchPlayerEXP(playerName, skill) {
  const apiUrl = `https://osrs-hiscore-pulling.onrender.com/stats/${playerName}?skill=${skill}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data.experience;
}

function calculateMinotaursKilled(expGained) {
  const newMinotaursKilled = Math.floor(expGained / 40);
  return newMinotaursKilled;
}

function calculateMinotaursPerMinute(minotaursKilled, startDate) {
  const timeDiffMinutes = (new Date().getTime() - startDate.getTime()) / 60000;
  const minotaursPerMinute = minotaursKilled / timeDiffMinutes;
  return minotaursPerMinute.toFixed(2);
}

function updateMinotaurCount() {
  minotaursKilled++;
  updateResult();
}

async function updateResult() {
  const playerName = 'OneChunkUp';
  const skill = 'ranged';
  const duration = calculateDuration(startDate);

  const expGained = await fetchPlayerEXP(playerName, skill);
  const calculatedMinotaursKilled = calculateMinotaursKilled(expGained);
  const minotaursPerMinute = calculateMinotaursPerMinute(calculatedMinotaursKilled + minotaursKilled, startDate);

  const resultElement = document.getElementById('result');
  resultElement.innerHTML = `
    <p>${playerName} has killed approximately ${calculatedMinotaursKilled + minotaursKilled} Minotaurs since ${startDate.toDateString()}.</p>
    <p>That's roughly ${minotaursPerMinute} Minotaurs per minute!</p>
  `;
}

updateResult();