import { Text, View } from "@/src/core/ui/tw";
import { Modal } from "react-native";
import { EventDTO } from "../dto/dto";

interface EventModalProps{
    events:Array<EventDTO>,
    visible:boolean,
    onClose:()=>void

}

export function EventModal({events,visible,onClose}:EventModalProps){
    return (
        <Modal
        transparent
        visible={visible}
        onRequestClose={onClose}>
            
            {events.map((event)=>{
                let startDate=event.startDatetime;
                let endDate=event.endDatetime;
                return (<View>
                        <Text>
                        {event.title}
                    </Text>
                    <Text className="text-lg">Comienza: {startDate.getDate()}/{startDate.getMonth()+1}/{startDate.getFullYear()} a las {startDate.getHours()}:{startDate.getMinutes()}</Text>
                    <Text className="text-lg">Termina: {endDate.getDate()}/{endDate.getMonth()+1}/{endDate.getFullYear()} a las {startDate.getHours()}:{startDate.getMinutes()}</Text>
                </View>)
            })}  
        </Modal>
    )
}