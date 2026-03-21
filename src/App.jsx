import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { workouts } from './data/workouts'
import LoginScreen from './components/LoginScreen'
import Dashboard from './components/Dashboard'
import WorkoutModal from './components/WorkoutModal'
import NutritionModal from './components/NutritionModal'
import SleepModal from './components/SleepModal'
import BonusModal from './components/BonusModal'
import MayaChat from './components/MayaChat'
import ProfileModal from './components/ProfileModal'
import Onboarding from './components/Onboarding'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [userId, setUserId] = useState(null)
  const [profile, setProfile] = useState(null)
  const [completedDays, setCompletedDays] = useState([])
  const [activeScreen, setActiveScreen] = useState('dashboard')
  const [selectedDay, setSelectedDay] = useState(null)
  const [nutritionApproved, setNutritionApproved] = useState(false)
  const [sleepApproved, setSleepApproved] = useState(false)
  const [presidentialApproved, setPresidentialApproved] = useState(false)
  const [bonusOpen, setBonusOpen] = useState(false)
  const [nutritionOpen, setNutritionOpen] = useState(false)
  const [sleepOpen, setSleepOpen] = useState(false)
  const [presidentialOpen, setPresidentialOpen] = useState(false)
  const [mayaOpen, setMayaOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [showOnboarding, setShowOnboarding] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('tactical_auth')
    const savedProfile = localStorage.getItem('tactical_profile')

    if (savedAuth) {
      const authData = JSON.parse(savedAuth)
      setIsAuthenticated(true)
      setUserEmail(authData.email)
      setUserId(authData.id)
      setNutritionApproved(authData.nutritionApproved || false)
      setSleepApproved(authData.sleepApproved || false)
      setPresidentialApproved(authData.presidentialApproved || false)

      // If authenticated but no profile, show onboarding
      if (!savedProfile) {
        setShowOnboarding(true)
      }
    }

    const savedProgress = localStorage.getItem('tactical_progress_v2')
    if (savedProgress) {
      setCompletedDays(JSON.parse(savedProgress))
    }

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    }
  }, [])

  const handleLogin = async (email) => {
    setLoginLoading(true)
    setLoginError('')
    try {
      const { data, error } = await supabase
        .from('app_approved')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single()

      if (error || !data) {
        setLoginError('ACCESO DENEGADO. EMAIL NO AUTORIZADO.')
        setLoginLoading(false)
        return
      }

      const authData = {
        email: email.toLowerCase().trim(),
        id: data.id || email,
        nutritionApproved: data.nutrition_approved || false,
        sleepApproved: data.sleep_approved || false,
        presidentialApproved: data.presidential_approved || false,
      }

      localStorage.setItem('tactical_auth', JSON.stringify(authData))
      setIsAuthenticated(true)
      setUserEmail(authData.email)
      setUserId(authData.id)
      setNutritionApproved(authData.nutritionApproved)
      setSleepApproved(authData.sleepApproved)
      setPresidentialApproved(authData.presidentialApproved)

      // After login, check if profile exists
      const savedProfile = localStorage.getItem('tactical_profile')
      if (!savedProfile && !profile) {
        setShowOnboarding(true)
      }
    } catch (err) {
      setLoginError('ERROR DE CONEXIÓN. INTENTA DE NUEVO.')
    }
    setLoginLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('tactical_auth')
    setIsAuthenticated(false)
    setUserEmail('')
    setUserId(null)
    setNutritionApproved(false)
    setSleepApproved(false)
    setPresidentialApproved(false)
    setShowOnboarding(false)
  }

  const handleDayComplete = (dayNumber) => {
    const newCompleted = completedDays.includes(dayNumber)
      ? completedDays.filter(d => d !== dayNumber)
      : [...completedDays, dayNumber]
    setCompletedDays(newCompleted)
    localStorage.setItem('tactical_progress_v2', JSON.stringify(newCompleted))
  }

  const handleOpenDay = (workout) => {
    // Dia 1 sempre liberado; os demais só abrem se o anterior estiver completo
    const isLocked = workout.day > 1 && !completedDays.includes(workout.day - 1)
    if (isLocked) return
    setSelectedDay(workout)
  }

  const handleCloseDay = () => {
    setSelectedDay(null)
  }

  const handleSaveProfile = (profileData) => {
    setProfile(profileData)
    localStorage.setItem('tactical_profile', JSON.stringify(profileData))
  }

  const handleOnboardingComplete = (profileData) => {
    setShowOnboarding(false)
    handleSaveProfile(profileData)
  }

  // Get next incomplete day for the "START DAY" button
  const nextDay = workouts.find(w => !completedDays.includes(w.day)) || workouts[0]

  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        loading={loginLoading}
        error={loginError}
      />
    )
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  return (
    <div style={{ backgroundColor: '#0F110F', minHeight: '100vh', position: 'relative' }}>
      <div className="scanline" />

      <Dashboard
        workouts={workouts}
        completedDays={completedDays}
        userEmail={userEmail}
        profile={profile}
        nextDay={nextDay}
        activeScreen={activeScreen}
        onSelectDay={handleOpenDay}
        onOpenNutrition={() => setNutritionOpen(true)}
        onOpenSleep={() => setSleepOpen(true)}
        onOpenBonus={() => setBonusOpen(true)}
        onOpenMaya={() => setMayaOpen(true)}
        onOpenProfile={() => setProfileOpen(true)}
        onNavigate={setActiveScreen}
        onStartDay={() => handleOpenDay(nextDay)}
        nutritionApproved={nutritionApproved}
        sleepApproved={sleepApproved}
        presidentialApproved={presidentialApproved}
      />

      {selectedDay && (
        <WorkoutModal
          workout={selectedDay}
          isCompleted={completedDays.includes(selectedDay.day)}
          onClose={handleCloseDay}
          onComplete={handleDayComplete}
        />
      )}

      {nutritionOpen && (
        <NutritionModal
          approved={nutritionApproved}
          onClose={() => setNutritionOpen(false)}
          userEmail={userEmail}
          profile={profile}
        />
      )}

      {sleepOpen && (
        <SleepModal
          onClose={() => setSleepOpen(false)}
        />
      )}

      {bonusOpen && (
        <BonusModal
          onClose={() => setBonusOpen(false)}
        />
      )}

      {mayaOpen && (
        <MayaChat
          onClose={() => setMayaOpen(false)}
          userEmail={userEmail}
        />
      )}

      {profileOpen && (
        <ProfileModal
          profile={profile}
          userEmail={userEmail}
          completedDays={completedDays}
          onClose={() => setProfileOpen(false)}
          onSave={handleSaveProfile}
          onLogout={handleLogout}
        />
      )}
    </div>
  )
}

export default App
