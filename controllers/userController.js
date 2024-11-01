import {hash, compare} from "bcrypt"
import jwt from "jsonwebtoken"
const {sign} = jwt
// import {ApiError} from "../helper/ApiError"
import { insertUser, selectUserByEmail } from "../models/User.js"


class ApiError extends Error {
    constructor(message, statusCode
    ){
        super(message)
        this.statusCode = statusCode
    }
}

// export {ApiError}

const createUserObject = ({id, email, token=undefined}) => {
    return {
        "id":id,
        "email":email,
        ...(token !== undefined) && {"token" :token}
    }
}

const postRegistration = async(req,res,next) => {
    try {
        if (!req.body.email || req.body.email.length === 0) return next(new ApiError("Invalid email for user",400))
        if (!req.body.password || req.body.password.length < 8) return next(new ApiError("Invalid password for user",400))
        const hashedPassword = await hash(req.body.password, 10)
        const userFromDb = await insertUser(req.body.email, hashedPassword)
        const user = userFromDb.rows[0]
        // return res.status(201).json(createUserObject(user.id, user.email))
        return res.status(201).json(createUserObject({ id: user.id, email: user.email }));
    } catch(error) {
        return next(error)
    }
}


const postLogin = async(req,res,next) => {
    const invalid_credentials_message = "Invalid credentials"
    try {
        const userFromDb = await selectUserByEmail(req.body.email)
        if (userFromDb.rowCount === 0) return next(new ApiError(invalid_credentials_message))

        const user = userFromDb.rows[0]
        if (!await compare(req.body.password, user.password)) return next(new ApiError(invalid_credentials_message, 401))
        
        const token = sign(req.body.email, process.env.JWT_SECRET_KEY)
        // return res.status(200).json(createUserObject(user.id, user.email, token))
        return res.status(200).json(createUserObject({ id: user.id, email: user.email, token }));
    } catch (error) {
        return next(error)
    }
}
export {postRegistration, postLogin}