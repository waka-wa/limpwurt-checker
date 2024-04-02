const startDate = new Date('2024-02-26');

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

async function fetchPlayerEXP(playerName, skill, startTime) {
  const apiUrl = `https://crystalmathlabs.com/api.php?type=trackehp&player=${playerName}&skill=${skill}&time=${startTime}`;
  const response = await fetch(apiUrl);
  const data = await response.text();
  return parseInt(data, 10);
}

function calculateMinotaursKilled(expGained) {
  const minotaursKilled = Math.floor(expGained / 40);
  return minotaursKilled;
}

function calculateMinotaursPerMinute(minotaursKilled, startDate) {
  const timeDiffMinutes = (new Date().getTime() - startDate.getTime()) / 60000;
  const minotaursPerMinute = minotaursKilled / timeDiffMinutes;
  return minotaursPerMinute.toFixed(2);
}

async function main() {
  const playerName = 'OneChunkUp';
  const skill = 'Ranged';
  const duration = calculateDuration(startDate);

  const expGained = await fetchPlayerEXP(playerName, skill, duration);
  const minotaursKilled = calculateMinotaursKilled(expGained);
  const minotaursPerMinute = calculateMinotaursPerMinute(minotaursKilled, startDate);

  const resultElement = document.getElementById('result');
  resultElement.innerHTML = `
    <p>${playerName} has killed approximately ${minotaursKilled} Minotaurs since ${startDate.toDateString()}.</p>
    <p>That's roughly ${minotaursPerMinute} Minotaurs per minute!</p>
  `;
}

main();