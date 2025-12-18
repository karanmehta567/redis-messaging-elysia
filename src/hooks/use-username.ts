import { nanoid } from "nanoid";
import { useEffect, useState } from "react"

const ANIMALS=['wolf','elephant','pig','eagle',"lion","leopard"]
const secret_key='name-generator';
const geenrateUsername=()=>{
    const word=ANIMALS[Math.floor(Math.random()*ANIMALS.length)]
    return `anonymous-${word}-${nanoid(5).toLowerCase()}`
}
export const useUsername=()=>{
        const [username,setUserName]=useState('')
        useEffect(()=>{
        const main=()=>{
        const stored=localStorage.getItem(secret_key)
        if(stored){
            setUserName(stored)
            return;
        }
        const generate=geenrateUsername()
        localStorage.setItem(secret_key,generate)
        setUserName(generate)
        }
        main()
    },[])
    return {username}
}