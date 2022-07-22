import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import * as path from "path"
import * as fs from "fs"
import * as uuid from "uuid"

export enum FileType {
    COVER = 'cover'
}

@Injectable()
export class FileService{

    createFile(type: FileType, file: Express.Multer.File): string{
        try {
            const fileExtention = file.originalname.split('.').pop()
            const fileName = uuid.v4() + '.' + fileExtention
            const filePath = path.resolve(__dirname, '..', '..', 'client', 'dist', type)
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, {recursive: true})
            }
            fs.writeFileSync(path.resolve(filePath, fileName), file.buffer)

            console.log('File has been created: ', type + '/' + fileName)
            return type + '/' + fileName
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    removeFile(typeAndFileName: string){
        try {
            const [type, filename] = typeAndFileName.split('/')
            const filePath = path.resolve(__dirname, '..', '..', 'client', 'dist', type, filename )
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
            }
            console.log('File has been removed: ', filePath)
            return true
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    updateFile(type: FileType, file: Express.Multer.File, oldFileSrc: string): string{
        const result = this.removeFile(oldFileSrc)
        if(!result) {
            throw new HttpException(
                'failed to remove file',
                HttpStatus.INTERNAL_SERVER_ERROR
            ) 
        }
        const imgCoverSrc = this.createFile(type, file)
        return imgCoverSrc
    }
}