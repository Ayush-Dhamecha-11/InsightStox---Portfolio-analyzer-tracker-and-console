import { getData } from '../../utils/getData.js';
export const searchStock = async (req,res)=>{
    const {query} = req.body;
    if(!query || query.length<1){
        return res.status(401).json({success:false,message:"Query is required"})
    }
    try{
        let result = await getData(query);
        if(!result){
            return res.status(404).json({success:false,message:"Stock not found"})
        }
        return res.status(200).json({success:true,data:result.quotes})
    }catch(error){
        console.log('Stock search error:',error);
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}

