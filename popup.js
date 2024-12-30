document.getElementById('solveButton').addEventListener('click', async () => {
  console.log('solve button clicked');
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['solver.js']
  });
});