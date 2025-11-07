import mongoose,{Schema} from "mongoose"
const userSuggestionSchema = new Schema({
    email:{
        type:String,
        required:[true,"Email is required"]
    },
    suggestion:{
        type:String,
        required:[true,"Query is required"]
    }
},
{
    timestamps:true
}
)

userSuggestionSchema.index({ email: 1, query: 1 }, { unique: true });

export const UserSuggestion = mongoose.model("userSuggestion",userSuggestionSchema)