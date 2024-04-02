const startDate = new Date('2024-02-26');
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
async function main() {
  const playerName = 'OneChunkUp';
  const skill = 'Ranged';
  const startTime = Math.floor((Date.now() - startDate.getTime()) / 1000);

  const expGained = await fetchPlayerEXP(playerName, skill, startTime);
  const minotaursKilled = calculateMinotaursKilled(expGained);

  const resultElement = document.getElementById('result');
  resultElement.textContent = `${playerName} has killed approximately ${minotaursKilled} Minotaurs since ${startDate.toDateString()}.`;
}
main();