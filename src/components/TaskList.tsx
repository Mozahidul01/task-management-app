"use client";

import { useSearchParams } from "next/navigation";
import { types, Instance } from "mobx-state-tree";
import { observer } from "mobx-react-lite";
import Task from "./Task";
import AddTask from "./AddTask";
import TaskFilter from "./TaskFilter";
import { useStore } from "@/stores/StoreProvider";
import { TaskModel } from "@/stores/TaskStore";

const TaskList = observer(() => {
  const { taskStore } = useStore();
  const searchParams = useSearchParams();
  const tasksFilter = searchParams.get("tasks");

  //@ts-ignore
  let filteredTasks: types.Array<Instance<typeof TaskModel>> = taskStore.tasks;

  if (tasksFilter === "pending") {
    filteredTasks = taskStore.tasks.filter((task) => task.status === "pending");
  } else if (tasksFilter === "in_progress") {
    filteredTasks = taskStore.tasks.filter(
      (task) => task.status === "in_progress"
    );
  } else if (tasksFilter === "completed") {
    filteredTasks = taskStore.tasks.filter(
      (task) => task.status === "completed"
    );
  }

  return (
    <div className="">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-8 sm:mb-14">
        <h2 className="text-2xl font-semibold">
          All The{" "}
          {tasksFilter === "pending"
            ? "Pending"
            : tasksFilter === "in_progress"
            ? "In Progress"
            : tasksFilter === "completed"
            ? "Completed"
            : ""}{" "}
          Tasks
        </h2>
        <AddTask />
      </div>

      <TaskFilter />

      <div className="flex flex-col gap-2 px-4 py-5 max-h-[600px] overflow-auto">
        {filteredTasks.map((task: any) => (
          <Task
            key={task.id}
            id={task.id}
            title={task.title}
            description={task.description}
            status={task.status}
          />
        ))}
      </div>
    </div>
  );
});

export default TaskList;
