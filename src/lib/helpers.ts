export const getTime = (date: string) => {
    const curDate = new Date(date);
    let diff =(new Date().getTime() - curDate.getTime()) / 1000;
    diff = Math.abs(Math.round(diff/(60 * 60)));
    return diff
}
export const getNoun = (count: number, one: string, two: string, five: string) => {
    let n = Math.abs(count);
    n %= 100;
    if (n >= 5 && n <= 20) {
        return five;
    }
    n %= 10;
    if (n === 1) {
        return one;
    }
    if (n >= 2 && n <= 4) {
        return two;
    }
    return five;
}