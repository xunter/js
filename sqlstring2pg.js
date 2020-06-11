function sqlformat2pg(sqlTemplate, params) {
    let sql = '';
    let sqlTokens = sqlTemplate.split('?');
    let pgParams = [];

    function formatParam(param) {
        let formatted = '';
        let paramValue = null;
        if (typeof param == 'number' 
        		|| typeof param == 'string'
            || typeof param == 'boolean') {
            paramValue = param;
        } else if (Object.prototype.toString.call(param) == '[object Array]') {
            formatted += param.map((paramArrayItem) => formatParam(paramArrayItem)).join(',');
        } else if (Object.prototype.toString.call(param) == '[object Object]') {
            formatted += Object.keys(param).map((paramObjKey) => paramObjKey + '=' + formatParam(param[paramObjKey])).join(',');
        } else if (Object.prototype.toString.call(param) == '[object Date]') {
            let dateIsoFormatted = `${param.getFullYear()}-${param.getMonth()+1}-${param.getDate()}`;//format date to iso moment|format|custom
            formatted += formatParam(dateIsoFormatted);
        }
        let paramIndex = 0;
        if (paramValue) {
            paramIndex = pgParams.push(paramValue);
        }
        if (paramIndex) {
            formatted += '$' + paramIndex;
        }
        return formatted;
    }


    sqlTokens.forEach((sqlToken, i) => {
        sql += sqlToken;
        if (params.length < i + 1) {
            return;
        }
        let param = params[i];

        sql += formatParam(param);
    });

    return {sql, params: pgParams};
}
