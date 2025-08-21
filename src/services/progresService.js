const redis = require('../config/redis');

const setProgress = async (fileId, status , progress) => {
    await redis.hset(`progress:${fileId}`, { status, progress });
};

const getProgress = async (fileId) => {
    const data = await redis.hgetall(`progress:${fileId}`);
    return {
        file_Id: fileId,
        status: data.status || 'unknown', 
        progress: Number(data.progress) || 0
    };
};

module.exports = { setProgress, getProgress };