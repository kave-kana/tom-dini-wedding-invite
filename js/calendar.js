document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll(".calendar-card").forEach(card => {

        card.addEventListener("click", function () {

            const type = this.getAttribute("data-calendar");

            const googleUrl =
                "https://www.google.com/calendar/render?action=TEMPLATE&text=Tomasz+%26+Dinesha+Wedding&dates=20260830T010000Z/20260830T060000Z&details=Join+us+to+celebrate+our+wedding+on+30+August+2026.&location=Jasmine+Banquet+Hall+Petaling+Jaya";

            const icsContent =
`BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Tomasz & Dinesha Wedding
DTSTART:20260830T010000Z
DTEND:20260830T060000Z
DESCRIPTION:Join us to celebrate our wedding!
LOCATION:Jasmine Banquet Hall Petaling Jaya
END:VEVENT
END:VCALENDAR`;

            if (type === "google") {
                window.open(googleUrl, "_blank");
            }

            if (type === "apple" || type === "android") {
                const blob = new Blob([icsContent], { type: "text/calendar" });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "Tomasz-Dinesha-Wedding.ics";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }

            // Use PopupManager to close
            if (typeof popupManager !== "undefined") {
                popupManager.closePopup();
            }

        });
    });

});
