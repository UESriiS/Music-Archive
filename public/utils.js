var _table_ = document.createElement('table'),
    _tr_ = document.createElement('tr'),
    _th_ = document.createElement('th'),
    _td_ = document.createElement('td');

function addAllColumnHeaders(arr, table) {
    var columnSet = [],
        tr = _tr_.cloneNode(false);
    for (var i = 0, l = arr.length; i < l; i++) {
        for (var key in arr[i]) {
            if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key) === -1) {
                columnSet.push(key);
                var th = _th_.cloneNode(false);
                th.appendChild(document.createTextNode(key));
                tr.appendChild(th);
            }
        }
    }
    table.appendChild(tr);
    return columnSet;
}

function buildHtmlTable(arr) {
    if (arr === undefined || arr.length == 0) {
        const msg = document.createElement('p');
        msg.appendChild(document.createTextNode('No results!'));
        return msg;
    }
    if (!Array.isArray(arr)) {
        arr = [arr];
    }
    if (typeof arr[0] === 'string' || arr[0] instanceof String) {
        const tr = _tr_.cloneNode(false);
        for (const i of arr) {
            var td = _td_.cloneNode(false);
            td.appendChild(document.createTextNode(i));
            tr.appendChild(td);
        }
        const shortTable = _table_.cloneNode(false);
        shortTable.appendChild(tr);
        return shortTable;
    }
    var table = _table_.cloneNode(false),
        columns = addAllColumnHeaders(arr, table);
    for (var i = 0, maxi = arr.length; i < maxi; ++i) {
        var tr = _tr_.cloneNode(false);
        for (var j = 0, maxj = columns.length; j < maxj; ++j) {
            var td = _td_.cloneNode(false);
            var cellValue = arr[i][columns[j]];
            td.appendChild(document.createTextNode(arr[i][columns[j]] || ''));
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    return table;
}