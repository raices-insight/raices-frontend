export class EventDTO{
    
    id:number
    title:string
    date:Date
    startDatetime:Date
    endDatetime:Date
    constructor(id:number,title:string,date:Date,endDateTime:Date){
        this.id=id
        this.title=title
        this.date=date
        this.startDatetime=date
        this.endDatetime=endDateTime
    }
}