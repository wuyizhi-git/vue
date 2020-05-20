

import { request } from '@/utils/request'

export const createCompButtons = async (data) => {
        return await request({
            url: '/paramComp/createParamComp',
            method: 'post',
            datas: data,
            timeout:10000,
           
     })
    
}

export const queryCompButtons = async (data) => {
        return await request({
            url: '/paramComp/findParamCompByCondition',
            method: 'post',
            datas: data,
            timeout:10000,
           
     })
}

export const updateCompButtons = async (data) => {
return await request({
    url: '/paramComp/updateParamComp',
    method: 'post',
    datas: data,
    timeout:10000,
    
})
}

export const deleteCompButtons = async (data) => {
    return await request({
        url: '/paramComp/deleteParamComp',
        method: 'post',
        datas: data,
        timeout:10000,
        
    })
    
}





