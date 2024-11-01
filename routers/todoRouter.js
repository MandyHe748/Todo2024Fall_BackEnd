import { emptyOrRows } from "../helper/utils.js"
import {pool} from "../helper/db.js"
import { Router } from "express"
import  auth  from "../helper/auth.js"
import {getTasks, postTask,deleteTask} from "../controllers/TaskController.js"

const router = Router()

// todo 8
router.get("/", getTasks)
router.post("/create", postTask)
router.delete("/delete/:id", deleteTask)

// to-do task 5

// router.get("/", (req,res,next) => {
//     pool.query("select * from task", (error,result) => {

//         if(error) {
//             return next(error)
//             // return res.status(500).json({error: error.message})
//         }

//         // return res.status(200).json(e)
//         return res.status(200).json(emptyOrRows(result))
//     })

// // res.status(200).json({result: "Success"})
// })

//  todo task 5
// router.post("/create", auth, (req, res,next) => {
//     // const pool = openDb()//
//     pool.query("insert into task (description) values ($1) returning *",
//         [req.body.description],

//         (error, result) => {
//             if (error) {
//                 return next(error)
//             }
//             // return res.status(200).json(emptyOrRows(result)[0].id)
//             const task = emptyOrRows(result)[0];
//             return res.status(200).json({ id: task.id, description: task.description });
//         }

//     )
// })
// to-do part 5
// router.delete("/delete/:id",auth, (req, res,next) => {
//     // const pool = openDb()
//     const id = parseInt(req.params.id);
//     pool.query("delete from task where id = $1", [id],
//         (error, result) => {
//             if (error) {
//                 return next(error)

//             }
//             // Use emptyOrRows to get the result
//             const rows = emptyOrRows(result);
            
//             // Always return the id of the task you attempted to delete
//             return res.status(200).json({ id: id });
//                 // return res.status(200).json(emptyOrRows(emptyOrRows(result).id))
//             }
//     )
// })
export default router; 


// task 4
// router.get("/", (req,res) => {
//     // const pool = openDb()//

//     pool.query("select * from task", (error,result) => {

//         if(error) {
//             return res.status(500).json({error: error.message})
//         }

//         return res.status(200).json(result.rows)
//     })
//     // res.status(200).json({result: "Success"})//
// })

// todo task 4
// router.post("/create", (req, res) => {
//     // const pool = openDb()//
//     pool.query("insert into task (description) values ($1) returning *",
//         [req.body.description],

//         (error, result) => {
//             if (error) {
//                 return res.status(500).json({error:error.message})
//             }
//             return res.status(200).json({id:result.rows[0].id})
//         }

//     )
// })


//  to do part 4
// router.delete("/delete/:id", (req, res) => {
//     // const pool = openDb()//
//     const id = parseInt(req.params.id);
//     pool.query("delete from task where id = $1", [id],
//         (error, result) => {
//             if (error) {
//                 return res.status(500).json({error:error.message})

//             }
//             return res.status(200).json({id: id})
//         }
//     )
// })

