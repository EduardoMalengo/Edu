document.addEventListener('DOMContentLoaded', function() {
    gapi.load('client:auth2', initClient);
});

function initClient() {
    gapi.client.init({
        apiKey: 'YOUR_API_KEY',
        clientId: 'YOUR_CLIENT_ID',
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        scope: "https://www.googleapis.com/auth/calendar.events"
    }).then(function () {
        gapi.auth2.getAuthInstance().signIn().then(listUpcomingEvents);
    });
}

function listUpcomingEvents() {
    gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    }).then(function(response) {
        var events = response.result.items;
        var calendar = document.getElementById('calendar');
        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                var when = event.start.dateTime;
                if (!when) {
                    when = event.start.date;
                }
                var li = document.createElement('li');
                li.appendChild(document.createTextNode(event.summary + ' (' + when + ')'));
                calendar.appendChild(li);
            }
        } else {
            calendar.appendChild(document.createTextNode('No upcoming events found.'));
        }
    });
}