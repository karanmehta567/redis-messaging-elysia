import { NextRequest, NextResponse } from "next/server"
import { redis } from "./lib/redis"
import { nanoid } from "nanoid"

export const proxy=async(req:NextRequest)=>{
    const pathname=req.nextUrl.pathname
    const match = pathname.match(/^\/room\/(.+)$/)
    if(!match){
        return NextResponse.redirect(new URL('/',req.url))
    }
    const roomId=match[1]
    const meta=await redis.hgetall<{connected:string[],createdAt:number}>(`meta:${roomId}`)
    if(!meta || Object.keys(meta).length === 0){
        return NextResponse.redirect(new URL("/?error=room-not-found",req.url))
    }
    const exisitingToken=req.cookies.get("x-auth-token")?.value
    // User is already in and just refreshed the page(allowed)
    if(exisitingToken&&meta.connected.includes(exisitingToken)){
        return NextResponse.next()
    }
    // Room Full(max Length 2)
    if(meta.connected.length>=2){
        return NextResponse.redirect(new URL('/?error=room-full',req.url))
    }
    const response=NextResponse.next()
    const token=nanoid()
    response.cookies.set("x-auth-token",token,{
        path:"/",
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:true
    })
    await redis.hset(`meta:${roomId}`,{
        connected:[...meta.connected,token]
    })
    return response
    // localhost:3000/room/dbwabdkjw
}
export const config={
    matcher:'/room/:path*'
}