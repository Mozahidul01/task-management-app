import { types, Instance, SnapshotIn, onSnapshot } from "mobx-state-tree";

export const TaskModel = types.model("Task", {
  id: types.identifier,
  title: types.string,
  description: types.string,
  status: types.string,
});

export const TaskStore = types
  .model("TaskStore", {
    tasks: types.optional(types.array(TaskModel), []),
  })
  .actions((self) => {
    return {
      addTask(task: SnapshotIn<typeof TaskModel> | Instance<typeof TaskModel>) {
        self.tasks.push(task);
      },
      editTask(
        id: string,
        editedTask: { title: string; description: string; status: string }
      ) {
        const task = self.tasks.find((task) => task.id === id);
        if (task) {
          task.title = editedTask.title;
          task.description = editedTask.description;
          task.status = editedTask.status;
        }
      },
      deleteTask(taskId: string) {
        const taskIndex = self.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
          self.tasks.splice(taskIndex, 1);
        }
      },
    };
  });

// Parse the tasks from local storage and create the task store
let tasksFromLocalStorage: any = [];
if (typeof window !== "undefined") {
  const tasksJSON = localStorage.getItem("taskStore");
  if (tasksJSON) {
    try {
      tasksFromLocalStorage = JSON.parse(tasksJSON).tasks;
    } catch (error) {
      console.error("Error parsing tasks from local storage:", error);
    }
  }
}

export let taskStore = TaskStore.create({
  tasks: tasksFromLocalStorage,
});

// Function to update the store with the initial snapshot
export function updateTaskStoreWithSnapshot(snapshot: any) {
  taskStore = TaskStore.create(snapshot);
}

// Save tasks to local storage whenever a change occurs
if (typeof window !== "undefined") {
  onSnapshot(taskStore, (snapshot) => {
    localStorage.setItem("taskStore", JSON.stringify(snapshot));
  });
}
