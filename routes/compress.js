import express from "express"
import multer from "multer"
import fs from "fs/promises"
import Compressor from "../lib/PDF-Compressor/index.js"

const router = express.Router()

const storage = multer.diskStorage({
    destination: "tmp/uploads",
    filename: function (req, file, cb){
        file.givenname = file.originalname.replace(/\.(.*)/, "")
        file.id = Math.random().toString().replace("0.", "")
        file.ext = file.mimetype.replace(/.+?(?=\/)/, "").replace("/", "")
        cb(null, `${file.givenname}_${file.id}.${file.ext}`)
    }
})
const upload = multer({storage, fileFilter})

router.post("/", upload.single("file"), processFile)

function fileFilter(req, file, cb){
    if(file.mimetype === "application/pdf"){
        req.fileAccepted = true
        cb(null, true)
    } else {
        req.fileAccepted = false
        cb(null, false)
    }
}

async function processFile(req, res, next){

    console.log(`STATUS: recieved incoming file`);
    const originalFile = req.file

    console.log(`STATUS: checking if file is pdf...`);
    if (req.fileAccepted){
        console.log(`STATUS: incoming file is pdf (accepted)`);
        const compressedFile = await compressFile(originalFile, req.body)
        await deleteFileFromServer(originalFile.path)
        await sendFileToClient(res, compressedFile)
        await deleteFileFromServer(compressedFile)
    } else {
        console.log(`STATUS: incoming file is not pdf (rejected)`);
        res.json({error: {msg: "file rejected"}})
    }

    async function compressFile(file, options){
        console.log(`STATUS: compressing file (${file.path})...`);
        const data = new Compressor(file.path, {
            output_file_dirname: "tmp/compressed",
            output_file_name: `${file.givenname}_${file.id}.${file.ext}`,
            pixel_resolution: options.compressionType === "lossy" ? 300 : 900,
            printed: options.preserveHyperlinks ? true : false
        })
        const compressedFile = await data.compress()
        console.log(`STATUS: successfully compressed file (${file.path})`);
        return compressedFile
    }

    async function deleteFileFromServer(file){
        console.log(`STATUS: deleting file (${file}) from server`);
        await fs.rm(file)
    }

    async function sendFileToClient(response, file){
        console.log(`STATUS: sending file (${file}) to client`);
        response.download(file)
    }
}


export default router