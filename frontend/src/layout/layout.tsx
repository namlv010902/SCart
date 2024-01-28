import React, { useEffect, useState } from 'react'
import Header from '../components/header/header'
import { Outlet } from 'react-router-dom'
import Footer from '../components/footer/footer'
import ScrollToTop from '../components/scrollToTop/ScrollToTop'

const LayOutClient = () => {
  const [isScrollingUp, setIsScrollingUp] = useState(false);

  useEffect(() => {
    let prevScrollPos = window.pageYOffset;

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      // console.log(currentScrollPos);
      setIsScrollingUp(prevScrollPos < currentScrollPos);
      prevScrollPos = currentScrollPos;
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <>
      <Header></Header>
      <main style={{ marginTop: "100px" }}>
        <Outlet></Outlet>
      </main>
      <Footer></Footer>
      <ScrollToTop />
    </>
  )
}

export default LayOutClient