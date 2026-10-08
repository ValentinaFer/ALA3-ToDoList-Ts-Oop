
import { Task } from "./Task.js";
import { TaskValidation } from "./TaskValidation.js";

export class TaskManager {
    private _tasks : Task[] = [];

    public createTask(title:string, desc:string, status:number, difficulty:number, dueDate:string) {
        if (TaskValidation.getTitleState(title) !== "valid" || TaskValidation.getDescriptionState(desc) !== "valid" || !TaskValidation.isValidStatus(status) || !TaskValidation.isValidDifficulty(difficulty)){
            return false;
        }
        const task = new Task(title, desc, status, difficulty, dueDate);
        this._tasks[this._tasks.length] = task;
        return true;
    }

    public editTask(id : number, task:Task) : "incorrect" | "not-found" | "not-editable" | "no-changes" | "edited" |  "error-in-editing"{
        if (TaskValidation.getTitleState(task.title) !== "valid" || TaskValidation.getDescriptionState(task.description) !== "valid" || !TaskValidation.isValidStatus(task.status) || !TaskValidation.isValidDifficulty(task.difficulty)){
            return "incorrect";
        }
    
        let taskInArr = this.getTaskReferenceByID(id);
        if (taskInArr === null){
            return "not-found";
        } 
    
        if (taskInArr.status === TaskValidation.CANCELLED){
            return "not-editable";
        }
    
        if (this.areTasksTheSame(taskInArr, task)){
            return "no-changes";
        }
    
        let date = new Date();
        try {
            taskInArr.title = task.title;
            taskInArr.description = task.description;
            taskInArr.status = task.status;
            taskInArr.difficulty = task.difficulty;
            taskInArr.dueDate = task.dueDate;
            taskInArr.lastEditedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
        } catch (error) {
            return "error-in-editing"; //should never really reach herer
        }
        
        return "edited";
    }

    public cancelTask(id : number) : "not-found" | "cancelled" | "already-cancelled" {
        const task = this.getTaskReferenceByID(id);
        if (task === null){
            return "not-found";
        }
        if (task.status !== TaskValidation.CANCELLED) {
            const date = new Date();
            task.lastEditedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
            task.status = TaskValidation.CANCELLED;
            return "cancelled";
        } else {
            return "already-cancelled";
        }
    }
    
    private getTaskReferenceByID(id : number) : Task | null{
        for (let i = 0; i < this._tasks.length; i++) {
            const task = this._tasks[i];
            if (task !== undefined && task.id === id){
                return task;
            }
        }
        return null;
    }

    //returns dummy copy of task
    public getTaskDataByID(id : number): Task | null{
        for (let i = 0; i < this._tasks.length; i++) {
            const task = this._tasks[i];
            if (task !== undefined && task.id === id){
                return new Task(task.title, task.description, task.status, task.difficulty, task.dueDate, task.id, task.creationDate, task.lastEditedDate);
            }
        }
        return null;
    }
    
    public areTasksTheSame(taskA:Task, taskB:Task) : boolean{
        if (taskA.title !== taskB.title){
            return false;
        }
        if (taskA.description !== taskB.description){
            return false;
        }
        if (taskA.status !== taskB.status){
            return false;
        }
        if (taskA.difficulty !== taskB.difficulty){
            return false;
        }
        if (taskA.dueDate !== taskB.dueDate){
            return false;
        }
        return true;
    }

    public getTasksToDisplay(state: number = TaskValidation.GETALL) :  {id:number, title:string, status : number}[] {
    
        let taskToDisplay = [], task;
        if (state === TaskValidation.GETALL) {
            for (let i = 0; i < this._tasks.length; i++) {
                task = this._tasks[i];
                if (task !== undefined && task.status !== TaskValidation.CANCELLED) {
                    taskToDisplay[taskToDisplay.length] =
                    {
                        id: task.id,
                        title: task.title,
                        status: task.status
                    };
                }
            }
        } else {
            for (let i = 0; i < this._tasks.length; i++) {
                task = this._tasks[i];
                if (task !== undefined && task.status == state) {
                    taskToDisplay[taskToDisplay.length] =
                    {
                        id: task.id,
                        title: task.title,
                        status: task.status
                    };
                }
            }
        }
        return taskToDisplay;
    }

    public getTasksByTitle(title : string, tasks = this.getTasksToDisplay()) : {id:number, title:string, status: number}[] {
        let taskToDisplayFiltered = [];
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            if (task !== undefined && task.title.toLowerCase().indexOf(title) !== -1) {
                taskToDisplayFiltered[taskToDisplayFiltered.length] = {title:task.title, id:task.id, status: task.status};
            }
        }
        return taskToDisplayFiltered;
    }
    
    
}