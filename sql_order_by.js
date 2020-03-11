//sortBy = ['code', ['name', 'desc'], { flexibleTypeCode: 'asc' }];

function sqlOrderBy(sortBy) {
    let sql = '';
    if (typeof sortBy == 'string') {
        sql += sortBy;
    } else if (Array.isArray(sortBy)) {
        for (let ord of sortBy) {
            if (typeof ord == 'string') {
                sql += ord;
            } else if (Array.isArray(ord) && ord.length == 2) {
                for (let i = 0; i < ord.length; i+=2) {
                    sql += ord[i] + ' ' + ord[i + 1];
                }
            } else if (typeof ord == 'object') {
                Object.keys(ord).forEach(k => sql += k + ' ' + ord[k]);
            }
            if (ord != sortBy[sortBy.length - 1]) {
                sql += ', ';
            }
        }
    }
    if (sql) {
      sql = 'ORDER BY ' + sql;
    }
    return sql;
}

//sqlOrderBy(sortBy) => 'ORDER BY code, name desc, flexibleTypeCode asc'
