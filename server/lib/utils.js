module.exports = {

  convertDotNotationToVal: function(data, dotNotation) {
    return dotNotation.split('.').reduce((acc, currVal) => {
      if (acc && acc[currVal] !== undefined) {
        acc = acc[currVal] || data[parseInt(currVal)];
        return acc;
      } else {
        return null;
      }
    }, data);
  },
  retrieveDataViaMap: function(data, mapping) {
    filteredData = {};
    for (let key in mapping) {
      if (typeof mapping[key] === 'object') {
        //mapping is an object {att: 'name', (v) => {return v.toLower()}}
        const mappingObj = mapping[key];
        if (mappingObj.val) {
          filteredData[key] = mappingObj.val;
        } else {
          filteredData[key] = this.convertDotNotationToVal(data, mappingObj.att) || false;
        }
        if (mappingObj.format !== undefined) {
          // then format the thing
          filteredData[key] = mappingObj.format(filteredData[key]);
        }
      } else {
        // just plain old att field.
        const att = mapping[key];
        filteredData[key] = this.convertDotNotationToVal(data, att);
      }
    }
    return filteredData;
  }
}