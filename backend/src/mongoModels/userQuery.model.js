import mongoose,{Schema} from "mongoose"
const userQuerySchema = new Schema({
    email:{
        type:String,
        required:[true,"Email is required"]
    },
    query:{
        type:String,
        required:[true,"Query is required"]
    }
},
{
    timestamps:true
}
)

userQuerySchema.index({ email: 1, query: 1 }, { unique: true });

export const UserQuery = mongoose.model("userQuery",userQuerySchema)