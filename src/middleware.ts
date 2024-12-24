import { auth } from "@/server/auth"

export const runtime = 'nodejs'

export default auth((req) => {

    console.log("middleware >>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    if (!req.auth) {
        console.log("redirecting to sign in page ,user is not authenticated")
        return Response.redirect(new URL('/sign-in', req.nextUrl))
    }
})




export const config = {
    matcher: ["/dashboard/:path*", "/resume/:path*"]
}
