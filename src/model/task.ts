import { TaskValidation } from "./TaskValidation.js";

export class Task {
    private static nextId:number = 1;

    private readonly _id: number;
    private _title!: string;
    private _description: string = "";
    private _status: number = 1;
    private _difficulty: number = 1;
    private readonly _creationDate: string;
    private _dueDate: string = "";
    private _lastEditedDate: string = "";

    constructor(title:string, description:string = "", status:number, difficulty:number, dueDate:string,id?:number, creationDate?:string, lastEditedDate?:string){
        if (id !== undefined && creationDate !== undefined && lastEditedDate !== undefined){
            this._id = id;
            this._creationDate = creationDate;
            this._lastEditedDate = lastEditedDate;
        } else {
            this._id = Task.nextId++;
            let date = new Date();
            this._creationDate = `${date.getDay()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}hs`;
        }
        this.title = title;
        this.description = description;
        this.status = status;
        this.difficulty = difficulty;
        this.dueDate = dueDate;
    }

    public set title(title : string) {
        let titleState = TaskValidation.getTitleState(title);
        if (titleState === "empty"){
            throw new Error("Title cannot be empty.");
        } else if (titleState === "too-long") {
            throw new Error("Title cannot have more than 100 characters.");
        }
        this._title = title;
    }
    
    public set description(description : string) {
        let descState = TaskValidation.getDescriptionState(description);
        if (descState === "too-long"){
            throw new Error("Description cannot have more than 500 characters.");
        }
        if (description.trim() === ""){
            description = "";
        }
        this._description = description;
    }
    
    public set status(status : number) {
        if (!TaskValidation.isValidStatus(status)){
            throw new Error("Status must be of valid value(1,2,3,4).");
        }
        this._status = status;
    }
    
    public set difficulty(difficulty : number) {
        if (!TaskValidation.isValidDifficulty(difficulty)){
            throw new Error("Difficulty must be of valid value(1,2,3).");
        }
        this._difficulty = difficulty;
    }
    
    public set dueDate(dueDate : string){
        this._dueDate = dueDate;
    }

    public set lastEditedDate(lastEditedDate : string){
        this._lastEditedDate = lastEditedDate;
    }

// * Getters
    public get id() : number {
        return this._id;
    }
    
    public get title() : string {
        return this._title;
    }
    
    public get description() : string {
        return this._description;
    }

    public get status() : number {
        return this._status;
    }

    public get difficulty() : number {
        return this._difficulty;
    }

    public get creationDate() : string {
        return this._creationDate;
    }

    public get dueDate() : string {
        return this._dueDate;
    }

    public get lastEditedDate() : string {
        return this._lastEditedDate;
    }

}