/**
 * @desc for structuring the data
 * @param {{}} result
 */
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

/**
 * @description Take an array as input and returns a string
 * @param {[]} data
 */
const createTempStr = data => {
  let tempStr = ''
  data.forEach(tempInfo => {
    tempStr = tempStr + tempInfo.dateStr + ' : ' + tempInfo.temp + '\xB0 C\r\n'
  })
  return tempStr
}
/**
 * @desc call fetch api
 * @param {String} url
 * @param {String} method
 * @param {String} header
 * @param {String} body
 */
async function fetchData (url, method, header, body) {
  const response = await window.fetch(url, {
    method,
    headers: {
      'Content-Type': header
    },
    body
  })
  return response
}

export { structureData, createTempStr, fetchData }
