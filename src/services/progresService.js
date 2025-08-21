// services/progressService.js
const progressMap = new Map();

function setProgress(fileId, progress, status = "uploading") {
  progressMap.set(fileId, { progress, status });
}

function getProgress(fileId) {
  return progressMap.get(fileId) || { progress: 0, status: "pending" };
}

function clearProgress(fileId) {
  progressMap.delete(fileId);
}

module.exports = { setProgress, getProgress, clearProgress };
