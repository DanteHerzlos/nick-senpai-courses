import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";



@Injectable()
export class MailService{
    constructor(private mailerService: MailerService) {}

    async sendMail(email: string, name: string, resetUrl: string) {
        const mail = await this.mailerService.sendMail({
            to: email,
            subject: 'Reset pasword!',
            html:`
            <div>
                Hello ${name}<br><br>
                For reset password go to link: <br>
                <a href="${process.env.ORIGIN_URL}/reset_password/${resetUrl}">Сбросить пароль</a>
                
            </div>
            `
        })
    }

    async sendMailForPaymentInfo(email: string, name: string, payUrl: string, idCourse: string, courseName: string) {
        const mail = await this.mailerService.sendMail({
            to: email,
            subject: 'Заказ на покупку курса',
            html:`
            <div>
                Здраствуйте ${name}<br><br>
                Вы хотели приобрести ${courseName}?<br>
                Вам необходимо оплатить заказ, для этого перейдите по ссылке: <br>
                <a href="${process.env.ORIGIN_URL}/dealPay/${idCourse}/${payUrl}">${process.env.ORIGIN_URL}/dealPay/${idCourse}/${payUrl}</a>
                
            </div>
            `
        })
    }
}