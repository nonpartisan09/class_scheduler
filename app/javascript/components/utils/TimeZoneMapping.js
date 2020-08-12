function getLocalTimezoneFromMap(timezoneMap) {
    const tzIdentifier = getLocalTimeZone();
    const mappedZone = timezoneMap[tzIdentifier];

    return mappedZone;
}

function getLocalTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export default getLocalTimezoneFromMap;