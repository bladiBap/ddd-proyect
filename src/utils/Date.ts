export class DateUtils {

    static formatDate(date: Date): Date {
        
        const year = date.getFullYear();
        const month = (Number) ((date.getMonth() + 1).toString().padStart(2, '0'));
        const day = (Number) (date.getDate().toString().padStart(2, '0'));
        
        const newDate = new Date(year, month - 1, day);
        return newDate;
    }
}