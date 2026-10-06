
export type Task = {
    id: number;
    title: string;
    description: string;
    state: State;
    difficulty: Difficulty;
    creationDate: string;
    dueDate: string | null;
    lastEditedDate: string | null
}

export type TaskEditable = {
    title: string;
    description: string;
    state: State;
    difficulty: Difficulty;
    dueDate: string | null;
}

let idUnique = 1;
let tasksArray: Task[] = [];

const TODAS = 0;

const PENDIENTE = 1;
const EN_CURSO = 2;
const TERMINADA = 3;
const CANCELADA = 4;

//user can't create task CANCELLED, nor edit into that state from edit menu, only from cancel task menu
export const VALID_STATE : number[] = [
    PENDIENTE, 
    EN_CURSO,
    TERMINADA
] as const;

export type State = 1 | 2 | 3 | 4;
export type Difficulty = 1 | 2 | 3;

//export type state = "Pendiente" | "En Curso" | "Terminada" | "Cancelada";
//export type difficulty = "Facil" | "Medio" | "Dificil";

//returns dummy copy of task
export function getTaskByID(id : Number): Task | null {
    for (let i = 0; i < tasksArray.length; i++) {
        const task = tasksArray[i];
        if (task !== undefined && task.id === id){
            return {...task}
        }
    }
    return null;
}

export function getTasksByTitle(title : string, tasks = getTasksToDisplay()) : {id:number, title:string, state: State}[] {
    let taskToDisplayFiltered = [];

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        if (task !== undefined && task.title.toLowerCase().indexOf(title) !== -1) {
            taskToDisplayFiltered[taskToDisplayFiltered.length] = {title:task.title, id:task.id, state: task.state};
        }
    }
    return taskToDisplayFiltered;
}

export function cancelTask(id : number) : "not-found" | "cancelled" | "already-cancelled" {
    const task = getTaskReferenceByID(id);
    if (task === null){
        return "not-found";
    }
    if (task.state !== CANCELADA) {
        const date = new Date();
        task.lastEditedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
        task.state = CANCELADA;
        return "cancelled";
    } else {
        return "already-cancelled";
    }
}

function getTaskReferenceByID(id : number) : Task | null{
    for (let i = 0; i < tasksArray.length; i++) {
        const task = tasksArray[i];
        if (task !== undefined && task.id === id){
            return task;
        }
    }
    return null;
}

function areTasksTheSame(taskA:Task | TaskEditable, taskB:Task | TaskEditable) : boolean{
    if (taskA.title !== taskB.title){
        return false;
    }
    if (taskA.description !== taskB.description){
        return false;
    }
    if (taskA.state !== taskB.state){
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

export function editTask(id : number, task:TaskEditable) : "incorrect" | "not-found" | "not-editable" | "no-changes" | "edited" {
    if (!isValidTitle(task.title) || !isValidDescription(task.description)){
        return "incorrect";
    }

    let taskInArr = getTaskReferenceByID(id);
    if (taskInArr === null){
        return "not-found";
    } 

    if (taskInArr.state === CANCELADA){
        return "not-editable";
    }

    if (areTasksTheSame(taskInArr, task)){
        return "no-changes";
    }

    let date = new Date();
    taskInArr.title = task.title;
    taskInArr.description = task.description;
    taskInArr.state = task.state;
    taskInArr.difficulty = task.difficulty;
    taskInArr.dueDate = task.dueDate;
    taskInArr.lastEditedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    return "edited";
}

/**
 * @returns array with tasks found(will be empty if no result matched)
 */
export function getTasksToDisplay(state: State | 0 = TODAS) : {id:number, title:string, state : State}[] {

    let taskToDisplay = [], task;
    if (state == TODAS) {
        for (let i = 0; i < tasksArray.length; i++) {
            task = tasksArray[i];
            if (task !== undefined && task.state != CANCELADA) {
                taskToDisplay[taskToDisplay.length] =
                {
                    id: task.id,
                    title: task.title,
                    state: task.state
                };
            }
        }
    } else {
        for (let i = 0; i < tasksArray.length; i++) {
            task = tasksArray[i];
            if (task !== undefined && task.state == state) {
                taskToDisplay[taskToDisplay.length] =
                {
                    id: task.id,
                    title: task.title,
                    state: task.state
                };
            }
        }
    }
    return taskToDisplay;
}

export function createTask(newTask: TaskEditable) {
    if (!isValidTitle(newTask.title) || !isValidDescription(newTask.description)){
        return false;
    }
    const date = new Date();
    const task : Task = {
            id: idUnique++,
            title: newTask.title,
            description: newTask.description,
            state : newTask.state,
            difficulty: newTask.difficulty,
            creationDate: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`,
            dueDate: newTask.dueDate,
            lastEditedDate: null
        }
    tasksArray[tasksArray.length] = task;
    return true;
}

/**
 * tells if task is editable. it won't be if cancelled or if it doesn't exists in the array
 */
export function isTaskEditable(id : number) : boolean {
    for (let i = 0; i < tasksArray.length; i++) {
        const task = tasksArray[i];
        if (task !== undefined && task.id === id && task.state !== CANCELADA){
            return true;
        }
    }
    return false;
}

export function isValidDescription(description: string){
    return (description.length < 500);
}

export function isValidTitle(title : string) {
    return (title.length < 100 && title.trim().length != 0)
}

//TODO: Move to other module, does not belong here
export function getStatetring(state : State) : string {
    switch (state) {
        case 1:
            return "Pendiente";
        case 2:
            return "En Curso";
        case 3:
            return "Terminada";
        case 4:
            return "Cancelada";
    }
}

//TODO: Move to other module, does not belong here
export function getDifficultyString(difficulty : Difficulty) {
    switch (difficulty) {
        case 1: return "*--";
        case 2: return "**-";
        case 3: return "***";
    }
}