export class CommonUtils {
    public static isValidValue(val: any) {
        if (val === undefined || val === null) {
            return false;
        }
        return true;
    }

    public static removeDuplicate(arr: any[]) {
        let x = (arr) => arr.filter((v, i) => arr.indexOf(v) === i)
        return x(arr);
    }
}