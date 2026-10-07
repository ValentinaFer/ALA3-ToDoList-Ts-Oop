import { Interface } from "../interface/Interface.js";
import { Task } from "./Task.js";
import { TaskValidation } from "./TaskValidation.js";

export class TaskManager {
    private static _tasks : Task[] = [];

    public static createTask(title:string, desc:string, status:number, difficulty:number, dueDate:string) {
        if (TaskValidation.getTitleState(title) !== "valid" || TaskValidation.getDescriptionState(desc) !== "valid"){
            return false;
        }
        const task = new Task(title, desc, status, difficulty, dueDate);
        TaskManager._tasks[TaskManager._tasks.length] = task;
        return true;
    }

    public static editTask(id : number, task:Task) : "incorrect" | "not-found" | "not-editable" | "no-changes" | "edited" {
        if (TaskValidation.getTitleState(task.title) !== "valid" || TaskValidation.getDescriptionState(task.description) !== "valid"){
            return "incorrect";
        }
    
        let taskInArr = TaskManager.getTaskReferenceByID(id);
        if (taskInArr === null){
            return "not-found";
        } 
    
        if (taskInArr.status === TaskValidation.CANCELLED){
            return "not-editable";
        }
    
        if (TaskManager.areTasksTheSame(taskInArr, task)){
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
            //TODO log the error messages here
        }
        
        return "edited";
    }

    public static cancelTask(id : number) : "not-found" | "cancelled" | "already-cancelled" {
        const task = TaskManager.getTaskReferenceByID(id);
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
    
    public static getTaskReferenceByID(id : number) : Task | null{
        for (let i = 0; i < TaskManager._tasks.length; i++) {
            const task = TaskManager._tasks[i];
            if (task !== undefined && task.id === id){
                return task;
            }
        }
        return null;
    }

    //returns dummy copy of task
    public getTaskByID(id : Number): Task | null {
        for (let i = 0; i < TaskManager._tasks.length; i++) {
            const task = TaskManager._tasks[i];
            if (task !== undefined && task.id === id){
                ;
            }
        }
        return null;
    }
    
    public static areTasksTheSame(taskA:Task, taskB:Task) : boolean{
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

    public static getTasksToDisplay(state: number = TaskValidation.GETALL) :  {id:number, title:string, status : number}[] {
    
        let taskToDisplay = [], task;
        if (state === TaskValidation.GETALL) {
            for (let i = 0; i < TaskManager._tasks.length; i++) {
                task = TaskManager._tasks[i];
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
            for (let i = 0; i < TaskManager._tasks.length; i++) {
                task = TaskManager._tasks[i];
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
    
}