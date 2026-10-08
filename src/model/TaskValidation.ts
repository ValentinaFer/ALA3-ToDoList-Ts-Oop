export class TaskValidation{
    private static readonly PENDING = 1;
    private static readonly IN_PROGRESS = 2;
    private static readonly COMPLETED = 3;
    public static readonly CANCELLED = 4;

    public static readonly GETALL = 0;

    private static readonly VALID_STATUS_CREATION = [TaskValidation.PENDING, TaskValidation.IN_PROGRESS, TaskValidation.CANCELLED,TaskValidation.COMPLETED];
    private static readonly VALID_DIFFICULTIES = [1,2,3];

    public static isValidStatus(status:number){
        for (let i = 0; i < TaskValidation.VALID_STATUS_CREATION.length; i++){
            if (status === TaskValidation.VALID_STATUS_CREATION[i]){
                return true;
            }
        }
        return false;
    }

    public static isValidDifficulty(difficulty:number){
        for (let i = 0; i < TaskValidation.VALID_DIFFICULTIES.length; i++){
            if (difficulty === TaskValidation.VALID_DIFFICULTIES[i]){
                return true;
            }
        }
        return false;
    }

    public static getTitleState(title:string){
        if (title.trim() === ""){
            return "empty";
        } else if (title.length > 100){
            return "too-long";
        }
        return "valid";
    }

    public static getDescriptionState(description:string){
        if (description.length > 500 && description.trim() !== ""){
            return "too-long"
        }
        return "valid";
    }
}