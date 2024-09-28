import express from 'express';
import * as dotenv from 'dotenv';
import axios from "axios";
import FormData from "form-data";

dotenv.config();

const router = express.Router();

const payload = {
    prompt: "Lighthouse on a cliff overlooking the ocean",
  };

router.route('/').get((req, res)=>{
    res.send('Hello from DALL-E!')
});

router.route('/').post(async(req,res)=>{
    try{
        const {prompt} = req.body;
        const payload = {
            prompt: prompt,
          };
        const aiResponse = await axios.postForm(
            `https://api.stability.ai/v2beta/stable-image/generate/sd3`,
            axios.toFormData(payload, new FormData()),
            {
              validateStatus: undefined,
              responseType: "arraybuffer",
              headers: { 
                Authorization: `Bearer ${process.env.API_KEY}`, 
                Accept: "application/json" 
              },
            },
          );
        const jsonString = Buffer.from(aiResponse.data).toString('utf8');
        const jsonResponse = JSON.parse(jsonString);
        const image = jsonResponse.image;
        res.status(200).json({ photo: image })

    } catch(error){
        console.log(error);
        res.status(500).send(error?.response.data.eror.message)
    }
})
export default router;