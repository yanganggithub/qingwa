'use strict'



const config={
    api:{
        base:'http://api.fffml.com/',

    },

    map:{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        follow: 20,
        timeout: 15000,
        size: 0,
    }

}



module.exports = config