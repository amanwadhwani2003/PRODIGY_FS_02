"use client";

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link';
// import '@/styles/navbar.css'
// import "./utilities.css"
// import * from "../media"


const Navbar = () => {

    return (
        <>
            <nav className="navigation-bar">
                <div className="logo-heading">
                    <Link href="/"><Image id='main-logo' src="/media/prodigy_infotech_logo.jpeg" alt='Prodigy Infotech' width={120} height={20} /></Link>
                </div>
                <ul className="nav-items-list">
                    <Link href="/"><li className="nav-item">Search</li></Link>
                    <Link href="https://prodigyinfotech.dev/"><li className="nav-item">Website</li></Link>
                    <Link href="https://www.linkedin.com/company/prodigy-infotech/posts/?feedView=all"><li className="nav-item">Linkedin</li></Link>
                    {/* <li className="nav-item"></li> */}
                    <Link href="mailto:amanwadhwani2003@gmail.com"><li className="nav-item">Contact</li></Link>
                </ul>
            </nav>
        </>
    )
}

export default Navbar
