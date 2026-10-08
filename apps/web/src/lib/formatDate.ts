const monthYearFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
})


export function formatMonthYear(isoDate: string): string {
    return monthYearFormatter.format(new Date(`${isoDate}T00:00:00Z`))
}