import { Pressable, Text, View } from "@/src/core/ui/tw";
import { useEffect, useState } from "react";
import { EventDTO } from "../dto/dto";
import { CreateEventModal } from "./CreateEventModal";
import { EventModal } from "./EventModal";

const API_URL = process.env.EXPO_PUBLIC_API_URL

export function CalendarSelector(){
    
    const [modalVisible, setModalVisible] = useState(false);
    const [createEventModalVisible, setCreateEventModalVisible] = useState(false);
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear,setCurrentYear] = useState(today.getFullYear());
    const [events,setEvents] = useState<Array<EventDTO>>([]);
    const [selectedDay,setSelectedDay]=useState(today.getDate())
    
    const [selectedDate,setSelectedDate]=useState(new Date())


    const monthEvents=events?.filter((event)=>{
      console.log(event.date.getDate())
      let sameYear=event.date.getFullYear()==currentYear
      let sameMonth=event.date.getMonth()==currentMonth
      return sameYear&&sameMonth
    })

  useEffect(()=>{
    const fetchEvents = async () => {
    
    const url=new URL(`${API_URL}/calendar/dates`)
    url.searchParams.append("calendarId","d34562f3ee0bce99009c1e865fc021447681ef26acc045bdb839bd878099a35d@group.calendar.google.com")
    const fetchedEvents = await fetch(url, { method: "GET" })
    console.log(fetchedEvents.status,null,url)
    const jsonData = await fetchedEvents.json()
    let tempEvents: Array<EventDTO> = []
    jsonData.forEach((ev: any) => {
      
      
      tempEvents.push(
        new EventDTO(
          ev.eventId,
          ev.name,
          new Date(ev.startDatetime),
          
          new Date(ev.endDatetime),

        )
      )

      
      
    })
    setEvents(tempEvents);
  }

    fetchEvents()
  },[])

    let currentMonthName=(new Date(currentYear, currentMonth).toLocaleString("default", {
    month: "long",
  }))

  const weekDays = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab", ];


const daysInMonth =(new Date(currentYear, currentMonth + 1, 0).getDate());


const firstDayOfWeek= new Date(currentYear, currentMonth, 1).getDay();

const prevMonth = () => {
  if (currentMonth === 0) {
    setCurrentMonth(11);
    setCurrentYear(currentYear-1);
  } else {
    setCurrentMonth(currentMonth-1)
  }
};

const nextMonth = () => {
  if (currentMonth === 11) {
    setCurrentMonth(0);
    setCurrentYear(currentYear+1)
  } else {
    setCurrentMonth(currentMonth+1)
  }
};



function removeThing(eventId:number){
    console.log("remthing")
    events?.forEach((e)=>{
        console.log("di ",e.id)
    })
    let index=events?.findIndex(e=>{
        return e.id==eventId
    })
    console.log("index ",index, " remid ", eventId)
    if (index!=undefined && index !== -1) {
        events?.splice(index, 1);
    }
}

 const firstDay = new Date(currentYear, currentMonth, 1);

  const buildDateKey = (day: number) => {
    const month = String(currentMonth + 1).padStart(2, "0");
    const paddedDay = String(day).padStart(2, "0");

    return `${currentYear}-${month}-${paddedDay}`;
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  // Weekday index of first day
  const startingWeekday = firstDay.getDay();

const cells: (number | null)[] = [];

  for (let i = 0; i < startingWeekday; i++) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(day);
  }

const dayEvents = (day:any) => monthEvents??Array<EventDTO>().filter((e) => e.date.getDate() === day);

return (
    <View className="flex-1 bg-zinc-100 p-4">
      {/* HEADER */}
      <View className="mb-4 flex-row items-center justify-between">
        <Pressable
          onPress={prevMonth}
          className="rounded-xl bg-zinc-200 px-4 py-2 active:bg-zinc-300"
        >
          <Text className="font-medium text-zinc-800">Prev</Text>
        </Pressable>

        <View>
          <Text className="text-2xl font-bold capitalize text-zinc-900">
            {currentMonthName} {currentYear}
          </Text>
        </View>

        <Pressable
          onPress={nextMonth}
          className="rounded-xl bg-zinc-200 px-4 py-2 active:bg-zinc-300"
        >
          <Text className="font-medium text-zinc-800">Next</Text>
        </Pressable>
      </View>

      {/* WEEK HEADER */}
      <View className="mb-2 flex-row">
        {weekDays.map((weekDay) => (
          <View
            key={weekDay}
            className="flex-1 items-center justify-center py-2"
          >
            <Text className="text-xs font-semibold uppercase text-zinc-500">
              {weekDay}
            </Text>
          </View>
        ))}
      </View>
        <CreateEventModal selectedDate={selectedDate} visible={createEventModalVisible} onClose={()=>{
                    setCreateEventModalVisible(false)
                  }}
                  addEvent={(event:EventDTO)=>{
                    
                    setEvents(prevEvents=>[...prevEvents,event])
                  }}
                  />

        <EventModal events={dayEvents(selectedDay)} visible={modalVisible} onClose={()=>{
          setModalVisible(false)
        }}></EventModal>
      {/* CALENDAR GRID */}
      <View className="flex-row flex-wrap">
        {cells.map((day, index) => {
          /*
            EMPTY CELL
          */
          if (day === null) {
            return (
              <View
                key={`empty-${index}`}
                className="h-16 w-[14.28%] p-1"
              >
                <View className="flex-1 rounded-2xl bg-transparent" />
              </View>
            );
          }

          /*
            DATE KEY
          */
          const dateKey = buildDateKey(day);

          /*
            EVENTS FOR THIS DAY
          */
          const dayEvents = monthEvents.filter((e) => e.date.getDate() === day);
          if (dayEvents.length>0)console.log("day ", day, "events ", dayEvents)
          /*
            TODAY STATE
          */
          const todayCell = isToday(day);

          return (
            <View
              key={dateKey}
              className="h-16 w-[14.28%] p-1"
            >
              
              <View
                className={[
                  "flex-1 rounded-2xl border p-2 ",
                  todayCell
                    ? "border-blue-500 bg-blue-50"
                    : "",
                    dayEvents.length>0&&!todayCell?"border-red-500 bg-indigo-400":""
                ].join(" ")}
              >
                
                <Pressable onPress={()=>{
                  console.log("pressed")
                if (dayEvents.length==0){
                  
                  const dateString=`${currentMonth+1}/${day}/${currentYear}`
                  let date=new Date(currentYear,currentMonth,day,today.getHours(),today.getMinutes())
                  console.log("using empty date ",dateString," isostring ", date.toISOString())
                  setSelectedDate(date)
                  setCreateEventModalVisible(true)
                  
                }
                else{
                  setSelectedDay(day)
                  setModalVisible(!modalVisible)
                }
              }
              }>
                {/* DAY NUMBER */}
                <View className={["flex-row items-center justify-between",todayCell?"rounded-full bg-blue-500 px-1 py-[2px]":"", todayCell?"":"mb-2"].join(" ")}
                >
                  <Text
                    className={[
                      "text-sm font-bold",
                      todayCell ? "text-blue-600" : "text-zinc-800",
                      todayCell? "text-[10px] font-semibold text-white":"",
                      
                    ].join(" ")}
                  >
                    {day}
                  </Text>

                  
                </View>

                {/* EVENTS */}
                
                </Pressable>
              </View>
              
            </View>
          );
        })}
      </View>
      
    </View>
  );
    
  
  
}