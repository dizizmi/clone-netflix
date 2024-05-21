
import { NextPageContext } from "next"
import { getSession, signOut } from "next-auth/react"

import useCurrentUser from "../hooks/useCurrentUser";

import Navbar from "../components/Navbar"

//protecting home routes
export async function getServerSideProps(context: NextPageContext) { //client side
  const session = await getSession(context);

  if (!session) { //if no session, return redirect object to auth
    return {
      redirect: {
        destination: '/auth',
        permanent: false, 
      }
    }
  }
  return {
    props: {}
  }
}


export default function Home() {
  const { data: user } = useCurrentUser();

  return (
    <>
      <Navbar />
    </>
  )
}


