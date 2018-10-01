module.exports = {
  retrieveDataViaMap: function(data, mapping) {
    filteredData = {};
    for (let key in mapping) {
      if (typeof mapping[key] === 'object') {
        //mapping is an object {att: 'name', (v) => {return v.toLower()}}
        const mappingObj = mapping[key];
        filteredData[key] = data[mappingObj.att] || false;
        if (mappingObj.format !== undefined) {
          // then format the thing
          filteredData[key] = mappingObj.format(filteredData[key]);
        }
      } else {
        // just plain old att field.
        const att = mapping[key];
        filteredData[key] = data[att];
      }
    }
    return filteredData;
  }
}