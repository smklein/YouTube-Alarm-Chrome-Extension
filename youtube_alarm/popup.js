/**
 * Function which parses the form, sends it to the background,
 * and appropriately handles the response.
 */
function sendFormToBackground(submittedForm) {
    msg = { setValues: true,
            url: submittedForm['url'].value,
            time: submittedForm['time'].value,
            zeroTime: submittedForm['zeroTime'].checked};
    chrome.runtime.sendMessage(msg, function(response) {
        if (response.error == undefined) {
            document.getElementById("resultText").style.color='#00EE18';
            document.getElementById("resultText").innerHTML='Alarm Set';
        } else {
            document.getElementById("resultText").style.color='#E02000';
            document.getElementById("resultText").innerHTML='Alarm Not Set: ' + response.error;
        }
    });
}

/**
 * Gets the currently set values for the form.
 */
function getCurrentAlarm(formToSubmit) {
    chrome.runtime.sendMessage({setValues: false}, function(response) {
        formToSubmit['url'].value = response.url;
        formToSubmit['time'].value = response.hour + ":" + response.minute;
        formToSubmit['zeroTime'].checked = response.zeroTime;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    f = document.getElementById("alarmForm");
    getCurrentAlarm(f);
    if(f.addEventListener) {
        f.addEventListener("submit", function(evt){
            evt.preventDefault();
            sendFormToBackground(f);
        }, true);
    } else {
        f.attachEvent('onsubmit', function(evt){
            evt.preventDefault();
            sendFormToBackground(f);
        });
    }
});


