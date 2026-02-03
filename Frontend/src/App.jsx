// import React, { useEffect } from 'react'
// import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
// import { AnimatePresence, motion } from 'framer-motion'
// import HomePage from './pages/HomePage'
// import Navbar from './Components/Navbar'
// import Menu from './Components/menu'
// import RegisterPage from './pages/RegisterPage'
// import LoginPage from './pages/LoginPage'
// import SplitText from './Components/splitText'
// // Wrapper component for route animations
// const AnimatedRoutes = () => {
//   const location = useLocation()
//   const navigate = useNavigate();
//   const pageTransition = {
//     initial: {
//       opacity: 0,
//       y: 20,
//       scale: 0.95
//     },
//     animate: {
//       opacity: 1,
//       y: 0,
//       scale: 1
//     },
//     exit: {
//       opacity: 0,
//       y: -20,
//       scale: 0.95
//     }
//   }


//   const handleAnimationComplete = () => {
//     console.log('All letters have animated!');
//   };


//   return (
//     <AnimatePresence mode="wait" initial={false}>
//       <motion.div
//         key={location.pathname}
//         initial="initial"
//         animate="animate"
//         exit="exit"
//         variants={pageTransition}
//         transition={{
//           type: "spring",
//           stiffness: 260,
//           damping: 20
//         }}
//       >

//         <Navbar />
//         <Routes location={location}>{
//           setTimeout(() => {
//             <Route path="/" element={<SplitText
//               text="Hello, GSAP!"
//               className="text-2xl font-semibold text-center"
//               delay={100}
//               duration={0.6}
//               ease="power3.out"
//               splitType="chars"
//               from={{ opacity: 0, y: 40 }}
//               to={{ opacity: 1, y: 0 }}
//               threshold={0.1}
//               rootMargin="-100px"
//               textAlign="center"
//               onLetterAnimationComplete={handleAnimationComplete}
//             />} />
//             navigate('/home');
//           }, 4000)}

//           <Route path="/home" element={<HomePage />} />
//           <Route path="/menu" element={<Menu />} />
//           <Route path="/register" element={<RegisterPage />} />
//           <Route path="/login" element={<LoginPage />} />
//         </Routes>
//       </motion.div>
//     </AnimatePresence>
//   )
// }



// const App = () => {
//   return (
//     <div>
//       <BrowserRouter>
//         <AnimatedRoutes />
//       </BrowserRouter>
//     </div>
//   )
// }

// export default App



import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import HomePage from './pages/HomePage'
import Navbar from './Components/Navbar'
import Menu from './Components/Menu'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import SplitText from './Components/SplitText'
import AuthProvider from './Context/Auth/AuthProvider'
import RecipeDisplayPage from './Components/RecipeDisplayPage'
import UserProfile from './Components/UserProfile'
import FavouritesPage from './pages/FavouritesPage'
import AddRecipePage from './pages/AddRecipePage'

// Intro page component that shows SplitText and then navigates
const IntroPage = () => {
  const navigate = useNavigate()
  const [animationComplete, setAnimationComplete] = useState(false)

  const handleAnimationComplete = () => {
    console.log('All letters have animated!')
    setAnimationComplete(true)
  }

  useEffect(() => {
    if (animationComplete) {
      const timer = setTimeout(() => {
        navigate('/home')
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [animationComplete, navigate])

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SplitText
        text="Welcome to Our App!"
        className="text-4xl md:text-6xl font-bold text-white"
        delay={100}
        duration={0.8}
        ease="power3.out"
        splitType="chars"
        from={{ opacity: 0, y: 100, rotationX: -90 }}
        to={{ opacity: 1, y: 0, rotationX: 0 }}
        threshold={0.1}
        rootMargin="-100px"
        textAlign="center"
        onAnimationComplete={handleAnimationComplete}
      />
    </motion.div>
  )
}

// Wrapper component for route animations
const AnimatedRoutes = () => {
  const location = useLocation()

  const pageTransition = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95
    }
  }

  // Don't show navbar on intro page
  const showNavbar = location.pathname !== '/'

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
      >
        {showNavbar && <Navbar />}
        <Routes location={location}>
          <Route path="/" element={<IntroPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/recipe/:id" element={<RecipeDisplayPage />} />
          <Route path="/profile/:email" element={<UserProfile />} />
          <Route path="/favourites" element={<FavouritesPage />} />
          <Route path="/addRecipe" element={<AddRecipePage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

const App = () => {
  return (
      <AuthProvider>
        <div>
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </div>
      </AuthProvider>
  );
}

export default App