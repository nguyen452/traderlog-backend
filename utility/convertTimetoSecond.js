const convertTimeToSeconds = (time) => {
    const timeArray = time.split(":");
    const hour = timeArray[0];
    const min = timeArray[1];
    const sec = timeArray[2];

    const totalSeconds = (hour * 60 * 60 ) + (min * 60 ) + (sec * 1)
    return totalSeconds;
  }

module.exports = convertTimeToSeconds;
