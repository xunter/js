//http://pnsols.com/en/cms/blog/20016/node-js-mysql-like-string-wildcard
//const lookupStrings = [ 'string1', 'string2', 'string_of_text', 'cr%zy_string', 'string*' ]

function filterNameLikeLookupStrings(lookupStrings) {
    let sql = '';
    if (lookupStrings && lookupStrings.length) {
        sql += db.prepareQuery('(name in(?)', [lookupStrings]);
        lookupStrings.filter(tp => tp.lastIndexOf('*') === tp.length - 1).forEach((tp, i) => {
            let tpParam = tp.substr(0, tp.length - 1).replace(/([%_#])/g, "#$1") + '%';
            sql += db.prepareQuery(` OR name LIKE ? ESCAPE '#'`, [tpParam]);
        });
        sql += ')';
    }
    return sql;
}
