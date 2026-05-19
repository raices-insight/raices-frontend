import { Text, View } from "@/src/core/ui/tw";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import React, { useEffect, useState, } from "react";
import { Modal, Pressable, TextInput as RNTextInput, TouchableOpacity, ViewStyle } from "react-native";
import { EventDTO } from "../dto/dto";

interface CreateEventModalProps{
    selectedDate:Date
    visible:boolean,
    addEvent:(event:EventDTO)=>void,
    onClose:()=>void

}
const API_URL = process.env.EXPO_PUBLIC_API_URL

const STATIC_CALENDAR_ID="d34562f3ee0bce99009c1e865fc021447681ef26acc045bdb839bd878099a35d@group.calendar.google.com"

export function CreateEventModal({selectedDate,visible,addEvent,onClose}:CreateEventModalProps){
    const touchableStyle={backgroundColor:"#00af1f", padding:6, margin:8}
    const normalButtonStyle:ViewStyle={flexShrink:3, backgroundColor:"#00ff7f", margin:6,padding:8, alignItems:"center", justifyContent:"center", borderRadius:10}
    const [name,setName]=useState("")
    console.log("date from modal, ", selectedDate.getDate(),selectedDate.getMonth(),selectedDate.getFullYear())
    const [startDate, setStartDate] = useState(selectedDate);
    const [endDate, setEndDate] = useState<Date>(selectedDate);

    const showMode = (currentMode:any,date:Date,setDate:(date:Date)=>void) => {
    DateTimePickerAndroid.open({
      value: date,
      onValueChange: (event, selectedDate) => setDate(selectedDate),
      mode: currentMode,
      is24Hour: true,
    });
  };

  useEffect(()=>{
    setStartDate(selectedDate)
    setEndDate(selectedDate)
  },[selectedDate])

    const showStartDatePicker=()=>{
        showMode('date',startDate,setStartDate)
        
    }

    const showStartTimePicker=()=>{
        showMode('time',startDate,setStartDate)
    }

    const showEndDatePicker=()=>{
        showMode('date',endDate,setEndDate)
        
    }

    const showEndTimePicker=()=>{
        showMode('time',endDate,setEndDate)
    }
    const onEmailChange=(nameInput:string)=>{
        setName(nameInput)
    }


    const onSend=async ()=>{
        const jsonBody={
            calendarId:STATIC_CALENDAR_ID,
            name,
            startDatetime:startDate.toISOString(),
            endDatetime:endDate.toISOString(),
            
        }
        console.log("sending uhh ",JSON.stringify(jsonBody))
        
        
        
    }
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
                <Text className="text-2xl font-bold mb-4">Crear evento</Text>
            <Text className="text-xl">Nombre evento</Text>
            <RNTextInput
                      style={{
                        width: '100%',
                        paddingVertical: 16,
                        paddingHorizontal: 20,
                        borderRadius: 16,
                        backgroundColor: '#FFFFFF',
                        borderWidth: 1,
                        borderColor: 'rgba(0,237,123,1)',
                        fontSize: 16,
                        color: '#1F1B15',
                      }}
                      placeholder="Nombre de evento"
                      placeholderTextColor="#A0978A"
                      
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={name}
                      onChangeText={onEmailChange}
                      editable={true}
                    />

            <Text className="text-xl">Fecha de inicio</Text>
            <Text className="text-lg">{startDate.getDate()}/{startDate.getMonth()+1}/{startDate.getFullYear()} a las {startDate.getHours()}:{startDate.getMinutes()}</Text>
            <View className="flex-row justify-center ">
                <Pressable onPress={showStartDatePicker}  className="bg-blue-500" children={(<Text>Cambiar fecha</Text>)}  style={normalButtonStyle}/>
                <Pressable onPress={showStartTimePicker} children={(<Text>Cambiar hora </Text>)} style={normalButtonStyle}/>
            </View>
             <Text className="text-xl mt-3">Fecha de término</Text>
            <Text className="text-lg">{endDate.getDate()}/{endDate.getMonth()+1}/{endDate.getFullYear()} a las {endDate.getHours()}:{endDate.getMinutes()}</Text>
            <View className="flex-row justify-center ">
                <Pressable onPress={showEndDatePicker}  className="bg-blue-500" children={(<Text>Cambiar fecha</Text>)}  style={normalButtonStyle}/>
                <Pressable onPress={showEndTimePicker} children={(<Text>Cambiar hora </Text>)} style={normalButtonStyle}/>
            </View>

            <View className="flex-row justify-center gap-3">
              <TouchableOpacity
                onPress={onClose}
                style={[touchableStyle,{backgroundColor:"red"}]}
                className="px-4 py-2 rounded-xl bg-gray"
              >
                <Text className="text-white text-xl">Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onSend}
                style={touchableStyle}
                className="px-4 py-2 rounded-xl bg-blue-600"
              >
                <Text className="text-white font-bold text-xl">
                  Agregar
                </Text>
              </TouchableOpacity>
            </View>
            </View>
            </View>

            
        </Modal>
      </View>
        
    )
}
