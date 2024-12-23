const KanbanBoard = () => {
    const boards = [
      { title: "To Do", color: "bg-blue-200", tasks: ["Task 1", "Task 2"] },
      { title: "In Progress", color: "bg-yellow-200", tasks: ["Task 3", "Task 4"] },
      { title: "Done", color: "bg-green-200", tasks: ["Task 5", "Task 6"] },
    ];
  
    return (
      <div className="flex flex-1 space-x-4 overflow-x-auto p-6">
        {boards.map((board) => (
          <div key={board.title} className="flex flex-col bg-white p-4 rounded shadow w-80">
            <h3 className={`font-bold text-lg ${board.color} p-2 rounded`}>{board.title}</h3>
            <div className="mt-4 space-y-2">
              {board.tasks.map((task, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-100 rounded shadow-sm cursor-pointer hover:bg-gray-200"
                >
                  {task}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default KanbanBoard;