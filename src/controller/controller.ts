import type { Task } from "../model/Task.js";
import {Interface} from "../interface/Interface.js"
import { TaskManager } from "../model/TaskManager.js";

export class Controller {
    private readonly _interface = new Interface();

    public createTask(){
        let option:string, title:string = "", description:string = "", dueDate: string = "";
        let status:number = 1, difficulty:number = 1;
        while(true){
            this._interface.showTask(title, description, status, difficulty, undefined, dueDate, undefined);
            option = this._interface.askFieldToModify();
    
            switch(option.toUpperCase()){
                case "1":
                    title = this._interface.askTitle();
                    break;
                case "2":
                    description = this._interface.askDescription();
                    break;
                case "3":
                    status = this._interface.askStatus();
                    break;
                case "4":
                    difficulty = this._interface.askDifficulty();
                    break;
                case "5":
                    dueDate = this._interface.askDueDateMenu(dueDate);
                    break;
                case "G":
                    if (title === ""){
                        this._interface.showMessage("[UY!] El titulo de la tarea no puede estar vacio.", "warning");
                    } else {
                        if (TaskManager.createTask(title, description, status, difficulty,dueDate)){
                            this._interface.showMessage("[Exito!] La tarea fue creada con exito.",  "success");
                        } else {
                            this._interface.showMessage("[Error!] La tarea no pudo ser creada.", "error");
                        }
                        return;
                    }
                    break;
                case "C":
                    this._interface.showMessage("[<-] Volviendo al menu.", "info");
                    return;
                default:
                    this._interface.showMessage("[UY!] Debe ingresar una de las opciones del menu.", "info");
                    break;
            }
        }
    }

    public editTask(task : Task){
        let option : string;
        while (true) {
            this._interface.showTask(task.title, task.description, task.status, task.difficulty, task.creationDate, task.dueDate, task.lastEditedDate);
            option = this._interface.askFieldToModify();
            switch (option.toUpperCase()) {
                case "1":
                    task.title = this._interface.askTitle();
                    break;
                case "2":
                    task.description = this._interface.askDescription();
                    break;
                case "3":
                    task.status = this._interface.askStatus();
                    break;
                case "4":
                    task.difficulty = this._interface.askDifficulty();
                    break;
                case "5":
                    task.dueDate = this._interface.askDueDateMenu(task.dueDate);
                    break;
                case "G":
                        switch (TaskManager.editTask(task.id, task)) {
                            case "edited":
                                    this._interface.showMessage("[Exito!] La tarea fue editada con exito.", "success");
                                break;
                            case "no-changes":
                                    this._interface.showMessage("[Info!] No hubieron cambios.", "info");
                                break;
                            case "incorrect":
                                    this._interface.showMessage("[Error!] La tarea no es valida.", "error");
                                break;
                            case "not-editable":
                                    this._interface.showMessage("[Error!] La tarea no puede ser editada.", "error");
                                break;
                            case "not-found":
                                    this._interface.showMessage("[Error!] La tarea no fue encontrada para editar!", "error");
                        }
                    return;
                case "C":
                    this._interface.showMessage("[<-] Volviendo al menu.", "info");
                    return;
                default:
                    this._interface.showMessage("[UY!] Debe ingresar una de las opciones del menu.", "info");
                    break;
            }
        }
    }

    public cancelTask(task : Task){
        let option : string;
        while (true){
            option = this._interface.askStateChange(task.status);
            if (option === "s"){
                switch(TaskManager.cancelTask(task.id)){
                    case "cancelled":
                        this._interface.showMessage("[Exito!] La tarea fue cancelada con exito.", "success");
                        break;
                    case "not-found":
                        this._interface.showMessage("[Error] La tarea no fue encontrada.", "error");
                        break;
                    case "already-cancelled":
                        this._interface.showMessage("[!] La tarea ya esta cancelada", "info");
                        break;
                }
                return;
            } else if (option === "n"){
                this._interface.showMessage("[<-] Volviendo al menu.", "info");
                return;
            } else {
                this._interface.showMessage("[UY!] Debe ingresar una opcion valida.", "warning");
            }
        }
    }   

    public isIdInTasks(id : number, tasks : Task[] | {id:number, title:string, status : number}[]){
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            if (task !== undefined && task.id === id){
                return true;
            }
        }
        return false;
    }

    public selectTask(tasks = this.getTasksFiltered()) : Task | null{
        if (tasks === null){
            return null;
        }
        let selectedId;
        while (true){
            selectedId = this._interface.askTaskToEdit(tasks);
            if (selectedId === null || selectedId === "0"){
                this._interface.showMessage("[<-] Volviendo al menu.", "info");
                return null;
            } else if (selectedId.trim() !== ""){
                selectedId = Number(selectedId);
                if (isNaN(selectedId)){
                    this._interface.showMessage("[UY!] Debe ingresar un id valido.", "info");
                } else {
                    if (this.isIdInTasks(selectedId, tasks)){
                    return TaskManager.getTaskDataByID(selectedId);
                    } else {
                        this._interface.showMessage("[UY!] El ID que ha seleccionado no se encuentra en la lista.", "warning");
                    }
                }
            } else {
                this._interface.showMessage("[UY!] Debe ingresar un ID valido de la lista", "warning");
            }
        }
    }

    public getTasksFiltered(){
        let option : number;
        while (true) {
            option = Number(this._interface.askFilterToApply());
            switch (option) {
                case 0:
                    this._interface.showMessage("[<-] Volviendo al menu.", "info");
                    return null;
                case 1:
                case 2:
                case 3:
                    return TaskManager.getTasksToDisplay(option);
                case 4:
                    return TaskManager.getTasksToDisplay();
                default:
                    this._interface.showMessage("[UY!] Debe ingresar una opcion valida del menu.","warning");
                    break;
            }
        }
    }

    public showMainMenu(){
        let option : string, task : Task | null;
        while(true){
            option = this._interface.askMainMenuOption();
            switch (option.toUpperCase()) {
                case "1":
                    this.createTask();
                    break;
                case "2":
                    task = this.selectTask();
                    if (task !== null){
                        this.editTask(task);
                    }
                    break;
                case "3":
                    task = this.selectTask();
                    if (task !== null){
                        this.cancelTask(task);
                    }
                    break;
                case "4":
                    task = this.selectTask();
                    if (task !== null){
                        this.editTask(task);
                    }
                    break;
                case "5":
                    let title = this._interface.askTitleToSearch();
                    if (title !== null){
                        task = this.selectTask(TaskManager.getTasksByTitle(title));
                        if (task !== null){
                            this.editTask(task);
                        }
                    } else {
                        this._interface.showMessage("[<-] Volviendo al menu", "info");
                    }
                    break;
                case "0":
                    if (this._interface.askAreYouSure()){
                        return;
                    }
                    break;
                default:
                    this._interface.showMessage("[UY!] Debe ingresar una opcion valida del menu", "warning");
                    break;
            }
        }
    }

}