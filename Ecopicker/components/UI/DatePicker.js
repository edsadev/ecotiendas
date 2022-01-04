import React, { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function DatePicker(){
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const [date, setDate] = useState(new Date())

  const showDatePicker = () => {
    setDatePickerVisibility(true)
  }

  const hideDatePicker = () => {
    setDatePickerVisibility(false)
  }

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date)
    setDate(date)
    hideDatePicker()
  }

  return (
    <View >
      <TouchableOpacity style={{}} onPress={showDatePicker}>
        <Text>Seleccionar fecha</Text>
      </TouchableOpacity>
      <Text>{`${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`}</Text>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  )
}

