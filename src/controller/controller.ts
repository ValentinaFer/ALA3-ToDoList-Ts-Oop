
import * as interfaceFun from "../interface/interface.js"
import * as taskFun from "../model/task.js"

export function showMainMenu(){
    let option : string, task : taskFun.Task | null;
    while(true){
        option = interfaceFun.showMainMenuOptions();
        switch (option.toUpperCase()) {
            case "1":
                createTask();
                break;
            case "2":
                task = selectTask();
                if (task !== null){
                    editTask(task);
                }
                break;
            case "3":
                task = selectTask();
                if (task !== null){
                    cancelTask(task);
                }
                break;
            case "4":
                task = selectTask();
                if (task !== null){
                    editTask(task);
                }
                break;
            case "5":
                let title = interfaceFun.askSearchTitle();
                if (title !== null){
                    task = selectTask(taskFun.getTasksByTitle(title));
                    if (task !== null){
                        editTask(task);
                    }
                } else {
                    interfaceFun.showMessage("[<-] Volviendo al menu", "info");
                }
                break;
            case "0":
                if (interfaceFun.showAreYouSure()){
                    return;
                }
                break;
            default:
                interfaceFun.showMessage("[UY!] Debe ingresar una opcion valida del menu", "warning");
                break;
        }
    }
}

function getTasksFiltered(){
    let option : number;
    while (true) {
        option = Number(interfaceFun.showTaskFilteringOptions());
        switch (option) {
            case 0:
                interfaceFun.showMessage("[<-] Volviendo al menu.", "info");
                return null;
            case 1:
            case 2:
            case 3:
                return taskFun.getTasksToDisplay(option);
            case 4:
                return taskFun.getTasksToDisplay();
            default:
                interfaceFun.showMessage("[UY!] Debe ingresar una opcion valida del menu.","warning");
                break;
        }
    }
}

function selectTask(tasks = getTasksFiltered()) : taskFun.Task | null{
    if (tasks === null){
        return null;
    }
    let selectedId;
    while (true){
        selectedId = interfaceFun.showSelectTasksOptions(tasks);
        if (selectedId === null || selectedId === "0"){
            interfaceFun.showMessage("[<-] Volviendo al menu.", "info");
            return null;
        } else if (selectedId.trim() !== ""){
            selectedId = Number(selectedId);
            if (isNaN(selectedId)){
                interfaceFun.showMessage("[UY!] Debe ingresar un id valido.", "info");
            } else {
                if (idInTasks(selectedId, tasks)){
                return taskFun.getTaskByID(selectedId);
                } else {
                    interfaceFun.showMessage("[UY!] El ID que ha seleccionado no se encuentra en la lista.", "warning");
                }
            }
        } else {
            interfaceFun.showMessage("[UY!] Debe ingresar un ID valido de la lista", "warning");
        }
    }
}

function idInTasks(id : number, tasks : {id:number, title:string, state: taskFun.State}[]){
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        if (task !== undefined && task.id === id){
            return true;
        }
    }
    return false;
}

function createTask(){
    let option: string;
    let task : taskFun.TaskEditable = {
            title : "",
            description : "",
            state : 1,
            difficulty : 1,
            dueDate : null,
        };

    while(true){
        interfaceFun.showTask(task);
        option = interfaceFun.showTaskFieldOptions();

        switch(option.toUpperCase()){
            case "1":
                task.title = interfaceFun.askTitle();
                break;
            case "2":
                task.description = interfaceFun.askDescription();
                break;
            case "3":
                task.state = interfaceFun.askState();
                break;
            case "4":
                task.difficulty = interfaceFun.askDifficulty();
                break;
            case "5":
                task.dueDate = interfaceFun.askDueDateMenu(task.dueDate);
                break;
            case "G":
                if (task.title === ""){
                    interfaceFun.showMessage("[UY!] El titulo de la tarea no puede estar vacio.", "warning");
                } else {
                    if (taskFun.createTask(task)){
                        interfaceFun.showMessage("[Exito!] La tarea fue creada con exito.",  "success");
                    } else {
                        interfaceFun.showMessage("[Error!] La tarea no pudo ser creada.", "error");
                    }
                    return;
                }
                break;
            case "C":
                interfaceFun.showMessage("[<-] Volviendo al menu.", "info");
                return;
            default:
                interfaceFun.showMessage("[UY!] Debe ingresar una de las opciones del menu.", "info");
                break;
        }
    }
}

function editTask(task : taskFun.Task){
    let option : string;
    while (true) {
        interfaceFun.showTask(task);
        option = interfaceFun.showTaskFieldOptions();
        switch (option.toUpperCase()) {
            case "1":
                task.title = interfaceFun.askTitle();
                break;
            case "2":
                task.description = interfaceFun.askDescription();
                break;
            case "3":
                task.state = interfaceFun.askState();
                break;
            case "4":
                task.difficulty = interfaceFun.askDifficulty();
                break;
            case "5":
                task.dueDate = interfaceFun.askDueDateMenu(task.dueDate);
                break;
            case "G":
                    switch (taskFun.editTask(task.id, task)) {
                        case "edited":
                                interfaceFun.showMessage("[Exito!] La tarea fue editada con exito.", "success");
                            break;
                        case "no-changes":
                                interfaceFun.showMessage("[Info!] No hubieron cambios.", "info");
                            break;
                        case "incorrect":
                                interfaceFun.showMessage("[Error!] La tarea no es valida.", "error");
                            break;
                        case "not-editable":
                                interfaceFun.showMessage("[Error!] La tarea no puede ser editada.", "error");
                            break;
                        case "not-found":
                                interfaceFun.showMessage("[Error!] La tarea no fue encontrada para editar!", "error");
                    }
                return;
            case "C":
                interfaceFun.showMessage("[<-] Volviendo al menu.", "info");
                return;
            default:
                interfaceFun.showMessage("[UY!] Debe ingresar una de las opciones del menu.", "info");
                break;
        }
    }
}

function cancelTask(task : taskFun.Task){
    let option : string;
    while (true){
        option = interfaceFun.askStateChange(task.state);
        if (option === "s"){
            switch(taskFun.cancelTask(task.id)){
                case "cancelled":
                    interfaceFun.showMessage("[Exito!] La tarea fue cancelada con exito.", "success");
                    break;
                case "not-found":
                    interfaceFun.showMessage("[Error] La tarea no fue encontrada.", "error");
                    break;
                case "already-cancelled":
                    interfaceFun.showMessage("[!] La tarea ya esta cancelada", "info");
                    break;
            }
            return;
        } else if (option === "n"){
            interfaceFun.showMessage("[<-] Volviendo al menu.", "info");
            return;
        } else {
            interfaceFun.showMessage("[UY!] Debe ingresar una opcion valida.", "warning");
        }
    }
}   