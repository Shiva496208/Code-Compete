import React from 'react'
import Landingpage from './Pages/Landingpage/Landingpage'
import Room from './Pages/Room/Room'
import Battle from './Pages/Battle/Battle'
import Login from './Pages/Login/Login'
import LeaderboardOverlay from './Component/Leaderboard/LeaderboardOverlay '
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import ProfilePage from './Pages/Profile/ProfilePage.jsx'
const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Landingpage/>}/>
      <Route path='/room/:id' element={<Room/>}/>
      <Route path='/battle/:id' element={<Battle/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/leaderboard/:roomid' element={<LeaderboardOverlay/>}/>
      <Route path='/profile/:username' element={<ProfilePage/>}/>

    </Routes>
    </BrowserRouter>
  )
}

export default App
