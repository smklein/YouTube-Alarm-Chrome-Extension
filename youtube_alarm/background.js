console.log("Hello from the background page");

var desiredURL = "https://www.youtube.com";
var desiredHour = "0";
var desiredMinute = "0";
var desiredZeroTime = false;

chrome.alarms.onAlarm.addListener(function(alarm) {
    console.log("Alarm fired!");
    console.log(alarm);
    console.log("The ms time is now: " + Date.now());
    
    actualURL = desiredURL;
    if (desiredZeroTime) {
        actualURL += "#t=0";
    }
    tabProperties = { url: actualURL };
    chrome.tabs.create(tabProperties);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);
    if (request.setValues == false) {
        // The extension is requesting the current alarm.
        sendResponse({ hour: desiredHour,
                       minute: desiredMinute,
                       url: desiredURL,
                       zeroTime: desiredZeroTime});
        return;
    }

    if (request.url == "" || request.url == undefined) {
        sendResponse({ error: "Invalid URL"});
        return;
    }
    desiredURL = request.url;
    
    desiredZeroTime = request.zeroTime;
    console.log("zero time: " + desiredZeroTime);
    dateToFire = new Date();
    console.log("NOW: " + dateToFire);

    chrome.alarms.clearAll();
    timeArray = request.time.split(":");
    if(timeArray.length != 2) {
        sendResponse({ error: "Invalid Time"});
        return;
    }
    desiredHour = timeArray[0];
    desiredMinute = timeArray[1];
    dateToFire.setHours(desiredHour);
    dateToFire.setMinutes(desiredMinute);
    dateToFire.setSeconds(0);

    console.log("Alarm will fire at: " + dateToFire);
    timeToFire = dateToFire.getTime();
    if (timeToFire < Date.now()) {
        console.log("Setting time for tomorrow...");
        timeToFire += 1000 * 60 * 60 * 24; // Milliseconds / day
    } else {
        console.log("Setting time for today...");
    }
    console.log("Time to fire: " + timeToFire);

    alarmPeriod = 60 * 24; // Minutes / day
    alarmInfo = { when: timeToFire, periodInMinutes: alarmPeriod};
    alarmA = chrome.alarms.create("a", alarmInfo);

    sendResponse({});
});
