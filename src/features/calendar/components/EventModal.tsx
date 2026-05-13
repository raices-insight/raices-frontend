import { Text, View } from "@/src/core/ui/tw";
import { Modal, TouchableOpacity, ViewStyle } from "react-native";
import { EventDTO } from "../dto/dto";

interface EventModalProps{
    events:Array<EventDTO>,
    visible:boolean,
    onClose:()=>void

}

export function EventModal({events,visible,onClose}:EventModalProps){
    const touchableStyle={backgroundColor:"#00af1f", padding:6, margin:8}
        const normalButtonStyle:ViewStyle={flexShrink:3, backgroundColor:"#00ff7f", margin:6,padding:8, alignItems:"center", justifyContent:"center", borderRadius:10}
    return (
            <View className="flex-1 justify-center items-center bg-white outline-solid outline-black " style={{outline:"solid",outlineColor:"black"}}>
            <Modal
            transparent
            visible={visible}
            onRequestClose={onClose}
            
            >
                <View className="flex-1 justify-center items-center px-6 " style={{outlineStyle:"solid",outlineColor:"#000000",boxShadow:"10px 10px 10px "}} >
              {/* Modal box */}
              <View className="w-full bg-white rounded-2xl p-5 justify-center items-center">
                    <Text className="text-2xl font-bold mb-4">Eventos registrados</Text>
                {
                    events.map((event)=>{
                        let startDate=event.startDatetime;
                        let endDate=event.endDatetime;
                        return (
                            <View key={event.id}>
                                <Text className="text-xl">Nombre evento</Text>
                                <Text className="text-xl">{event.title}</Text>
                                <Text className="text-xl">Fecha de inicio</Text>
                <Text className="text-lg">{startDate.getDate()}/{startDate.getMonth()+1}/{startDate.getFullYear()} a las {startDate.getHours()}:{startDate.getMinutes()}</Text>
                <Text className="text-xl mt-3">Fecha de término</Text>
                <Text className="text-lg">{endDate.getDate()}/{endDate.getMonth()+1}/{endDate.getFullYear()} a las {endDate.getHours()}:{endDate.getMinutes()}</Text>
                            </View>
                        )
                    })
                }
                
                <View className="flex-row justify-center gap-3">
                  <TouchableOpacity
                    onPress={onClose}
                    style={[touchableStyle,{backgroundColor:"red"}]}
                    className="px-4 py-2 rounded-xl bg-gray"
                  >
                    <Text className="text-white text-xl">Cerrar</Text>
                  </TouchableOpacity>
    
                 
                </View>
                </View>
                </View>
    
                
            </Modal>
          </View>
            
        )
}