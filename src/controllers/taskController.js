import Task from "../models/task.js";

//Create task
export const createTask = async (req, res) =>{
    try{
        const {title, description} = req.body;

        const task = await Task.create({
            title,
            description,
            user: req.user.id
        });

        res.status(201).json({
            success: true,
            data: task
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//Fetch/get all tasks for the authenticated user
export const getTasks = async (req, res) => {
    try{
        const tasks = await Task.find({user: req.user.id})
        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//Update task

export const updateTask = async (req, res) => {
    try{
        const task = await Task.findById(req.params.id);

        //check if task exist
        if(!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }
        //check ownership
        if(task.user.toString() !==req.user.id){
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this task"
            });
        }
        //Update task
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true, runValidators: true}
        );

        res.status(200).json({
            success: true,
            data: updatedTask
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Delete task
export const deleteTask = async (req, res) => {
    try{
        const task = await Task.findById(req.params.id);

        //Check if task exist
        if(!task){
            return res.status(404).json({
                success: false,
            message: "Task not found"            })
        }
        //Check ownership
        if(task.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this task"
            });
        }
        await task.deleteOne();

        res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });
    }catch(error){
        res.status(500).json({
            success: false,
            mesaage: error.message
        })
    }
}