import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import BookingBack from '../components/booking/sidebarBack';
import { db } from '../lib/initFirebase';
import { doc, getDoc } from 'firebase/firestore';
import Header from '../components/navbar';
import Pending from '../components/booking/pending';
import Ready from '../components/booking/ready';
import Use from '../components/booking/use';
import Complete from '../components/booking/complete';
import Booking from '../components/booking';
import { useAuth } from '../context/useAuth';
const Page = () => {
  const router = useRouter();
  const bookingItemId = router.query.bookingItemId;
  const inbounded = router.query.inbounded;
  const [sideBar, setSideBar] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const { authenticated } = useAuth();
  useEffect(() => {
    if (authenticated === false) {
      router.push("/")
    }
  }, [authenticated]);
  useEffect(() => {
    console.log()
    bookingItemId && bookingItemId && setBookingId(bookingItemId)
  }, [ bookingItemId])
  useEffect(() => {
    console.log(bookingId)
    bookingId && getBooking(bookingId, inbounded);
  }, [bookingId, inbounded]);
  const getBooking = async (id, inbounded) => {
    const docRef = doc(db, "bookings", id);
    let querySnapshot = await getDoc(docRef);
    let tempdata = querySnapshot.data();
    if (tempdata.status == "0") {
      setSideBar(<Pending bookingId={id} inbounded={inbounded} />)
    }
    if (tempdata.status == "1") {
      setSideBar(<Ready bookingId={id} inbounded={inbounded} />)
    }
    if (tempdata.status == "2") {
      setSideBar(<Use bookingId={id} inbounded={inbounded} />)
    }
    if (tempdata.status == "3") {
      console.log("here is status 3 ", bookingId)
      setSideBar(<Complete bookingId={id} inbounded={inbounded} />)
    }
  }

  return (
    <>
      {
        sideBar
      }
      <Header />
      <Booking />
      <BookingBack />
    </>
  );
};

export default Page;