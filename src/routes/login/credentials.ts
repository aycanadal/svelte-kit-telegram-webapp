export class Credentials{
    
    telegramId:string
    password:string

    constructor(object:any) {
        this.telegramId = object.telegramId;
        this.password = object.password;
      }

}