import ItemDBService from "./CRUD.js";

class TasksService extends ItemDBService {
  constructor() {
    super("tasks");
  }
}

export default new TasksService();
