import { getData } from '../../utils/getData.js';

export const getNews = async (req,res) => { 
    const {query} = req.params;
    if(!query || query.length<1){
        return res.status(401).json({success:false,message:"Query is required"})
    }
    try {
        let data = await getData(query);
        console.log(data);
        if(!data){
            return res.status(404).json({success:false,message:"No data found for the given query"})
        }
        let news = data.news;
        console.log(news);
        return res.status(200).json({success:true,news});
    } catch (error) {
        console.log('Error fetching news:', error);
        return null;
    }
};