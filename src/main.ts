import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import * as cookieParser from 'cookie-parser'


const start = async() => {
    try {
        const PORT = process.env.PORT || 5000
        const app = await NestFactory.create(AppModule)
        app.enableCors({
            credentials: true,
            origin: process.env.CLIENT_URL
        })
        app.useGlobalPipes(new ValidationPipe())
        app.use(cookieParser())
        await app.listen(PORT, ()=> console.log(`Server run on port: ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()