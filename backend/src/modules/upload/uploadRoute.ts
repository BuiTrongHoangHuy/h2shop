import express from "express";
import upload from "../../utils/fileUpload";
import {S3Service} from "../../utils/s3Service";
import orderRouter from "../order/routes/orderRoute";

const uploadRouter = ()=>{


    const router = express.Router();
    const s3Service = new S3Service();
    router.post('/', upload.single('file'),
    async (req, res) =>
    {
        try{
            const file = req.file;
            const userId = req.user?.userId;
            console.log("userId",userId);
            console.log("file",file);
            if(!file){
                return res.status(400).send('No file uploaded or user not authenticated.');
            }

            const imageUrl = await s3Service.uploadFileToS3(file.buffer, file.originalname);
            res.json({
                status: 'success',
                message: 'File uploaded successfully',
                data: {
                    imageUrl
                }
            });
        } catch(error){
            res.status(500).json({
                success: false,
                message: error.message || 'Error uploading file'
            });
        }

    });

    return router;
}

export default uploadRouter;