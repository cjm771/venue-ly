module.exports = {
  // merges data from two sets of data with some handy options
  mergePruneFilter: function([...arr1], [...arr2], opts) {
    // merge default options..
    opts = Object.assign({
      beforeStart: ([...arr]) => { return arr },
      mergeOn: 'id',
      attsToCopy: Object.keys(arr2),
      pruneDuplicates: true, 
      filter: (obj) => { return true },
      beforeFinish: (filteredArr, unfilteredArr) => { return filteredArr; }
    }, opts);
    
    arr1 = opts.beforeStart(arr1);
    arr2 = opts.beforeStart(arr2);
    let obj1 = {};
    let obj2 = {};
    arr2.forEach((currObj) => {
      const id = currObj[opts.mergeOn];
      obj2[id] = currObj;
    });
    // merge existing
    arr1.forEach((currObj) => {
      const id = currObj[opts.mergeOn];
      obj1[id] = currObj;
      if (obj2[id] !== undefined ) {
        // we should merge
        opts.attsToCopy = (Array.isArray(opts.attsToCopy)) ? opts.attsToCopy : [opts.attsToCopy];
        
        opts.attsToCopy.forEach((att) => {
          obj1[id][att] = obj2[id][att];
        });
        if (opts.pruneDuplicates) {
          delete obj2[id];
        }
      } 
    });
    // copy over remaining + convert back into array
    obj1 = Object.assign(obj1, obj2);
    const resultArr = Object.keys(obj1).map((key) => {
      return obj1[key];
    })
    // finally lets get our filtered and non filtered results
    const resultArrFiltered = resultArr.filter((obj) => {
      return opts.filter(obj);
    });
    const resultArrLeftovers = resultArr.filter( (obj) => {
      return !opts.filter(obj);
    });
    // and run it through our beforeFinish
    return opts.beforeFinish(resultArrFiltered, resultArrLeftovers);
  },
  // converts a dot notation string to its data counterpart
  // for instance externals.0.url = data['externals'][0]['url']
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
  // retrieves a sanitized / filtered data set given an object literal
  // mapping (desiredKey: sourceKey || opts Obj)
  // 
  // options include 
  // ----------------
  // att - sourceKey, 
  // format - callback to reformat before commiting
  // val - specify a value to commit to , rather than an attribbute
  // 
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