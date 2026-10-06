import PromptSync from "prompt-sync";
import * as funTask from "../model/task.js";
import type * as Types from "../model/task.js";
const prompt = PromptSync({ sigint: true });

export function showMainMenuOptions() : string {
    console.log("-----[TODO LIST]-----");
    console.log("[1]-Agregar una nueva Tarea;");
    console.log("[2]-Modificar una Tarea;");
    console.log("[3]-Cancelar una Tarea;");
    console.log("[4]-Ver todas mis Tareas;");
    console.log("[5]-Buscar una Tarea por Título;");

    console.log("[0]-Salir.");
    return prompt(">");
}

export function showAreYouSure(){
    while (true){
        showMessage("¿Esta seguro que desea salir?(s/n)", "warning");
        switch (prompt("<").toLowerCase()){
            case "s":
                return true;
            case "n":
                return false;
            default:
                showMessage("[UY!] Debe ingresar una opcion valida.", "warning");
        }
    }
}

export function showTaskFieldOptions() : string{

    console.log("-Ingrese el campo que desea modificar-");
    console.log("[1] Titulo");
    console.log("[2] Descripción(opcional)");
    console.log("[3] Estado(opcional)");
    console.log("[4] Dificultad(opcional)");
    console.log("[5] Fecha Vencimiento(opcional)");
    console.log("--------------");
    console.log("[G] Guardar");
    console.log("[C] Cancelar");
    console.log("--------------");
    return prompt("Ingrese una opción: ");
}

export function showTaskFilteringOptions() : string{
    console.log("-----[FILTRANDO]-----");
    console.log("Seleccione una de las opciones para buscar tareas con un estado en especifico:");
    console.log("[1]-Pendiente;");
    console.log("[2]-En Curso;");
    console.log("[3]-Terminada;");
    console.log("[4]-Quiero ver todas!;");
    console.log("[0]-Volver.");
    return prompt(">");
}

export function askSearchTitle() : string | null{
    let title;
    while(true){
        console.log("------[BUSCAR TAREA POR TÍTULO]-------");
        console.log("Ingrese su busqueda, o deje en blanco para volver al menu");
        title = prompt(">");
        if (title.trim().length == 0){
            return null;
        } else {
            return title.toLowerCase();
        }
    }
}

export function askTitle() : string{
    let title;
    while (true) {
        title = prompt("Ingrese el titulo de la tarea(maximo 100 caracteres): >");
        if (title.length >= 100) {
            showMessage("[UY!] El titulo no puede superar los 100 caracteres de maximo.", "warning");
        } else if (title.trim().length === 0 || title === null) {
            showMessage("[UY!] El titulo no puede estar vacio.", "warning");
        } else {
            return title;
        }
    }
}

export function askDescription() : string{
    let desc;
    while (true) {
        desc = prompt("Ingrese la descripcion de la tarea(maximo 500 caracteres): >");
        if (desc.length >= 500) {
            showMessage("[UY!] La descripcion no puede superar los 500 caracteres de maximo.", "warning");
        } else if (desc.trim().length === 0 || desc === null) {
            showMessage("[!] La descripcion se guardara vacia.", "info");
            return "";
        } else {
            return desc;
        }
    }
}

export function askState() : funTask.State {
    let status;
    while (true) {
        console.log("Ingrese el estado de la tarea: ");
        console.log("[1] Pendiente;");
        console.log("[2] En Curso;");
        console.log("[3] Terminada;");
        //supposing it wouldn't make much sense to let an user create a task that's already cancelled..
        //but it could make sense for Terminada in case of wanting to keep a record of the task.
        status = prompt(">");
        status = Number(status);
        if (isValidState(status)) {
            return status;
        } else {
            showMessage("[UY!] Debe ingresar un estado valido.", "warning");
        }
    }
}

export function isValidState(state : number) : state is funTask.State {
    for (let i = 0; i < funTask.VALID_STATE.length; i++) {
        const validState = funTask.VALID_STATE[i];
        if (validState === state){
            return true;
        }
    }
    return false;
};

export function askDifficulty() : funTask.Difficulty {
    let dif;
    while (true) {
        console.log("Ingrese el nivel de dificultad de la tarea: ");
        console.log("[1] Facil");
        console.log("[2] Medio");
        console.log("[3] Dificil");
        dif = prompt("> ");
        dif = Number(dif);
        if (isValidDifficulty(dif)) {
            return dif;
        } else {
            showMessage("[UY!] Debe ingresar un nivel de dificultad valido.", "warning");
        }
    }
}

export function isValidDifficulty(difficulty : number): difficulty is funTask.Difficulty{
    return difficulty === 1 || difficulty === 2 || difficulty === 3;
}

export function askStateChange(actualState : funTask.State) {
    let option;
    while (true) {
        console.log("Estado de la tarea: " + funTask.getStatetring(actualState));
        console.log("Desea cancelar la tarea?(s/n)");
        showMessage("[!] Esta accion no podra ser revertida y la tarea no podra ser editada.", "warning");
        option = prompt(">").toLowerCase();
        if (option === "s" || option === "n"){
            return option;
        } else {
            showMessage("[UY!] Debe ingresar una respuesta valido.", "warning");
        }
    }

}

/**
 * @function askDueDateMenu opens a menu to let the user create a date if nothing valid is passed by parameters, edit or or cancel date if a proper existing date is passed 
 * @return String; date in string format: returns the new date added, or the original if no changes were made. returns null if the date is deleted
 **/
export function askDueDateMenu(actualDueDateStrn : string | null = null) : string | null {
    let option;
    let dateOriginal = actualDueDateStrn;
    let date = dateOriginal;
    let hasDate;
    while (true) {
        hasDate = date !== null;
        if (hasDate) {
            console.log(`[${date}]`);
            console.log("[1] Cambiar Fecha;");
            console.log("[2] Quitar Fecha;");
        } else {
            console.log("No tiene fecha.");
            console.log("[1] Agregar Fecha;");
        }
        console.log("[G] Guardar;");
        console.log("[C] Cancelar;");

        option = prompt("Ingrese una opcion: ");
        if (option.toUpperCase() == "G") {
            return date;
        } else if (option.toUpperCase() == "C") {
            return dateOriginal;
        } else if (option == "1") {
            date = askDueDate();
        } else if (option == "2" && hasDate) {
            date = null;
        } else {
            showMessage("[UY!] Debe ingresar una opcion valida del menu.", "warning");
        }

    }
}

function askDueDate() : string {
    let year : number, month : number, dayNum : number;
    while (true) {
        year = askYear();
        console.log(`[  /  /${year}]`);
        month = askMonth();
        console.log(`[  /${month}/${year}]`);
        dayNum = askDay(year, month);
        return `${dayNum}/${month}/${year}`;
    }
}

function askYear() : number{
    let year;
    while (true) {
        year = Number(prompt("Ingrese el año: "));
        if (!isNaN(year) && year > 999) {
            return year;
        } else {
            showMessage("[UY!] Debe ingresar un año valido.", "warning");
        }
    }
}

function askMonth() : number{
    let month;
    while (true) {
        month = Number(prompt("Ingrese el mes: "));
        if (!isNaN(month) && month > 0 && month <= 12) {
            return month;
        } else {
            showMessage("[UY!] Debe ingresar un mes valido.", "warning");
        }
    }
}

function askDay(year : number, month : number) : number {
    const diasEnMeses = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let day;
    let bisiesto = ((year % 400 == 0) || (year % 4 == 0 && year % 100 != 0));
    let cantDiasMax = diasEnMeses[month - 1];
    if (month == 2 && bisiesto) {
        cantDiasMax = 29;
    }
    while (true) {
        day = Number(prompt("Ingrese el dia: "));
        if (!isNaN(day) && day > 0 && cantDiasMax !== undefined && day <= cantDiasMax) {
            return day;
        } else {
            showMessage("[UY!] Debe ingresar un día valido (1-" + cantDiasMax + ").", "warning");
        }
    }
}

/**
 * string with number of ID choosed("0" if choosed to go back), or null if tasks array empty, nothing to show
 */
export function showSelectTasksOptions(tasks : {title:string, id:number, state: Types.State}[]) : string | null{
    let task;
    if (tasks.length > 0) {
        for (let i = 0; i < tasks.length; i++) {
            task = tasks[i];
            if (task !== undefined){
                console.log(`[${task.id}]-${task.title} (${funTask.getStatetring(task.state)});`);
            }
        }
        console.log("-Seleccione el número de la tarea que desea editar, o [0] para volver.");
        return prompt(">");
    } else {
        showMessage("No se hallaron tareas...", "info");
        console.log("Presione cualquier tecla para volver.");
        prompt(">");
        return null;
    }
}

export function showTask(task : Types.Task | Types.TaskEditable) {
    console.log("-----------------------------------");
    console.log(task.title.length > 0 ? task.title : "No hay título.");
    console.log(task.description.length > 0 ? task.description : "No hay descripción.");
    console.log("Estado: " + funTask.getStatetring(task.state));
    console.log("Dificultad: " + funTask.getDifficultyString(task.difficulty));
    if ("creationDate" in task){
        console.log("Fecha de creación: " + task.creationDate);
    } else {
        console.log("Fecha de creación: --/--/---- --:--");
    }
    console.log("Fecha de vencimiento: " + (task.dueDate != null ? task.dueDate : "--/--/----."));
    if ("lastEditedDate" in task){
        console.log("Fecha de última edición: " + (task.lastEditedDate !== null ? task.lastEditedDate : "--/--/----."));
    } else {
        console.log("Fecha de última edición: --/--/---- --:--");
    }
    console.log("-----------------------------------");
}

export type MessageType = "success" | "error" | "warning" | "info";

export function showMessage(msg : string, type : MessageType) : void{
    let color : string;
    switch (type){
        case "success":
            color = "\x1b[32m";
        break;
        case "error":
            color = "\x1b[31m";
        break;
        case "warning":
            color = "\x1b[33m";
        break;
        default:
            color = "\x1b[36m"
    }
    console.log(`${color}${msg}\x1b[0m`);
}