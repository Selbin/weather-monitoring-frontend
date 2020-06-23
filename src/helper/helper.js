const structureData = result => {
  const mappedData = {}
  result.data.forEach(element => {
    if (mappedData[element.name]) {
      mappedData[element.name].data.push({
        dateStr: element.dateString,
        temp: element.temp
      })
    } else {
      mappedData[element.name] = {
        location: element.name,
        lat: element.lat,
        long: element.long,
        data: [{ dateStr: element.dateString, temp: element.temp }]
      }
    }
  })
  const dataArr = []
  for (const location in mappedData) {
    dataArr.push(mappedData[location])
  }
  return dataArr
}

const createTempStr = data => {
  let tempStr = ''
  data.forEach(tempInfo => {
    tempStr = tempStr + tempInfo.dateStr + ' : ' + tempInfo.temp + '\xB0 C\r\n'
  })
  return tempStr
}
export { structureData, createTempStr }
