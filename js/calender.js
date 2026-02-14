function downloadCalendarEvent() {

  const event = `
BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
BEGIN:VEVENT
UID:wedding-20260830@tomaszdinesha.my
DTSTAMP:20240101T000000Z
SUMMARY:Tomasz & Dinesha Wedding
DTSTART;TZID=Asia/Kuala_Lumpur:20260830T090000
DTEND;TZID=Asia/Kuala_Lumpur:20260830T140000
LOCATION:Jasmine Banquet Hall, Petaling Jaya
DESCRIPTION:Join us to celebrate our wedding! RSVP closes on 1 July 2026.
BEGIN:VALARM
TRIGGER:-P1D
ACTION:DISPLAY
DESCRIPTION:Reminder - Tomasz & Dinesha Wedding is tomorrow!
END:VALARM
END:VEVENT

BEGIN:VEVENT
UID:rsvp-deadline-20260701@tomaszdinesha.my
DTSTAMP:20240101T000000Z
SUMMARY:RSVP Deadline - Tomasz & Dinesha Wedding
DTSTART;TZID=Asia/Kuala_Lumpur:20260701T090000
DTEND;TZID=Asia/Kuala_Lumpur:20260701T100000
DESCRIPTION:Today is the last day to RSVP for the wedding!
BEGIN:VALARM
TRIGGER:-P1D
ACTION:DISPLAY
DESCRIPTION:Reminder - RSVP closes tomorrow!
END:VALARM
END:VEVENT

END:VCALENDAR
  `.trim();

  const blob = new Blob([event], { type: 'text/calendar;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = "tomasz-dinesha-wedding.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
