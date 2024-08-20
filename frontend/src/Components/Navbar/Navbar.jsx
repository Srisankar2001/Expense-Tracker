import React from 'react'
import './Navbar.css'
import home from '../../Assets/home.png'
import friends from '../../Assets/friends.png'
import { Link } from 'react-router-dom'

export const Navbar = () => {
  return (
    <div className='navbar'>
        <ul>
            <Link to="/"><li><img src={home}/><span>Home</span></li></Link>
            <Link to="/getFriend"><li><img src={friends}/><span>Friends</span></li></Link>
        </ul>
    </div>
  )
}
