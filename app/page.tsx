"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExternalLink } from 'lucide-react'
import Image from 'next/image';

const careerGoals = [
  "Get a promotion",
  "Switch careers",
  "Start a business",
  "Improve work-life balance",
  "Develop new skills",
  "Increase income",
  "Find a new job",
  "Expand professional network",
  "Achieve a specific career milestone",
  "Improve job satisfaction"
]

interface GoalDetails {
  goal: string;
  whatToAchieve: string;
  howToKnow: string;
  isRealistic: string;
  importance: string;
  timeline: string;
}

interface LimitingBelief {
  fear: string;
  triggeringSituation: string;
  adviceToFriend: string;
  smallStep: string;
  newBelief: string;
}

const sectionInstructions = {
  careerGoals: "This section helps you map out what you want to achieve in your career and the steps to get there.",
  limitingBeliefs: "This section helps you build confidence to pursue new opportunities and overcome career obstacles by removing fears/doubts that are holding you back to achieve your goal.",
  affirmationsGratitude: "This section helps you build a mindset of success by affirming your strengths and acknowledging the progress you've made, which keeps you motivated and focused on career growth.",
  manifestationScript: "This personalized career script will serve as a powerful tool to guide your intentions and manifest your dream career.",
  visionBoard: "Use this section to build a visual representation that captures your career goals all in one place for you to practice. You can download and use it as your desktop or phone wallpaper for daily inspiration.",
  thirtyMinutePlan: "This section helps you to be aligned with your career manifestation goals."
};

// Add this function at the top level of your file
function ProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const progress = (currentStep / totalSteps) * 100;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-purple-600 h-2.5 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

export default function ManifestMasteryApp() {
  const [step, setStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [goalDetails, setGoalDetails] = useState<GoalDetails[]>([])
  const [limitingBelief, setLimitingBelief] = useState<LimitingBelief>({
    fear: '',
    triggeringSituation: '',
    adviceToFriend: '',
    smallStep: '',
    newBelief: '',
  })
  const [visionBoard, setVisionBoard] = useState<Record<string, string>>({})
  const [affirmations, setAffirmations] = useState<string[]>([])
  const [gratitudeStatements, setGratitudeStatements] = useState<string[]>([])
  const [manifestationScript, setManifestationScript] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleGoalSelection = (goal: string) => {
    setSelectedGoals(prev => {
      if (prev.includes(goal)) {
        return prev.filter(g => g !== goal)
      } else if (prev.length < 3) {
        return [...prev, goal]
      }
      return prev
    })
  }

  const handleGoalDetailsChange = (index: number, field: keyof GoalDetails, value: string) => {
    setGoalDetails(prev => {
      const newDetails = [...prev]
      newDetails[index] = { ...newDetails[index], [field]: value }
      return newDetails
    })
  }

  const handleLimitingBeliefChange = (field: keyof LimitingBelief, value: string) => {
    setLimitingBelief(prev => ({ ...prev, [field]: value }))
  }

  const handleVisionBoardUpload = (goal: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setVisionBoard(prev => ({ ...prev, [goal]: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const generateAffirmationsAndGratitude = () => {
    const newAffirmations = selectedGoals.map(goal => `I am confident in my ability to ${goal.toLowerCase()}.`)
    const newGratitudeStatements = selectedGoals.map(goal => `I am grateful for the opportunity to ${goal.toLowerCase()}.`)
    setAffirmations(newAffirmations)
    setGratitudeStatements(newGratitudeStatements)
  }

  const generateManifestationScript = () => {
    const script = `I am doing work that I love, and I am recognized for my talents.
    My career is growing, and I am open to new opportunities and success.
    I am committed to ${selectedGoals.join(', ')}, and I feel excited knowing I am creating the career of my dreams.
    I am confident in my abilities, and I know that I am on the path to achieving my career goals.`
    setManifestationScript(script)
  }

  const validateStep = () => {
    setError(null)
    switch (step) {
      case 2: // Career Goals
        if (selectedGoals.length === 0) {
          setError("Please select at least one goal.")
          return false
        }
        if (goalDetails.length !== selectedGoals.length || goalDetails.some(detail =>
          !detail.whatToAchieve || !detail.howToKnow || !detail.isRealistic || !detail.importance || !detail.timeline
        )) {
          setError("Please answer all questions for each selected goal.")
          return false
        }
        break
      case 3: // Limiting Beliefs section
        if (Object.values(limitingBelief).some(value => !value)) {
          setError("Please fill in all fields about your limiting beliefs.")
          return false
        }
        break
    }
    return true
  }

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1)
    }
  }

  const totalSteps = 9; // Total number of steps including the 30-minute plan

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="container mx-auto px-4 py-8">
            <Card className="w-full max-w-4xl mx-auto mb-8">
              <CardContent className="pt-6 text-center">
                <Image 
                  src="/G.png" // Make sure this matches your file name exactly
                  alt="Manifestor Logo"
                  width={100}
                  height={100}
                  className="mx-auto mb-6"
                />
                <h1 className="text-4xl font-bold text-purple-600 mb-4">Manifest Mastery</h1>
                <h2 className="text-2xl font-semibold mb-2">Excited to start your goals manifestation?</h2>
                <p className="text-gray-600 mb-6">Start Your Manifestation Journey Today!</p>
                <Button 
                  onClick={() => setStep(1)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg text-lg"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>
        )
      case 1:
        return (
          <div className="container mx-auto px-4 py-8">
            <Card className="w-full max-w-4xl mx-auto mb-8">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <Image 
                    src="/G.png" // Update this path to your actual logo file
                    alt="Manifestor Logo"
                    width={96}
                    height={96}
                    className="object-contain"
                  />
                </div>
                <CardTitle className="text-3xl font-bold text-purple-600 text-center">Welcome to ManifestMastery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-center mb-6">
                  Start your journey to transforming every aspect of your life with the ManifestMastery app. We&apos;re here to help you set and achieve your goals, overcome doubts and fears, and rewire your mindset with powerful affirmations and gratitude practices.
                </p>
                <p className="text-lg text-center mb-6">
                  In this phase, we&apos;re focusing on helping you achieve your career goals. Our step-by-step guide will ensure you stay on track and manifest your career aspirations with ease.
                </p>
                <p className="text-lg text-center font-semibold mb-6">
                  Explore the tools and features designed to bring your professional goals to life.
                </p>
                <Button 
                  onClick={() => setStep(2)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg text-lg"
                >
                  Continue to Career Goals
                </Button>
              </CardContent>
            </Card>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-purple-600">Career Goals</h2>
            <p className="text-sm italic text-gray-600">{sectionInstructions.careerGoals}</p>
            <p className="text-sm italic text-gray-600">(Select Minimum 1 and Maximum 3)</p>
            <Select onValueChange={(value) => handleGoalSelection(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a goal" />
              </SelectTrigger>
              <SelectContent>
                {careerGoals.map((goal, index) => (
                  <SelectItem key={index} value={goal}>
                    {goal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="space-y-2">
              {selectedGoals.map((goal, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                  <span>{goal}</span>
                  <Button variant="ghost" size="sm" onClick={() => handleGoalSelection(goal)}>Remove</Button>
                </div>
              ))}
            </div>
            {selectedGoals.map((goal, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-xl font-semibold">{goal}</h3>
                <div className="space-y-2">
                  <Label htmlFor={`what-${index}`}>What exactly do you want to achieve?</Label>
                  <Input
                    id={`what-${index}`}
                    placeholder="Describe your goal in clear and simple terms."
                    value={goalDetails[index]?.whatToAchieve || ''}
                    onChange={(e) => handleGoalDetailsChange(index, 'whatToAchieve', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`how-${index}`}>How will you know when you&apos;ve achieved it?</Label>
                  <Input
                    id={`how-${index}`}
                    placeholder="What specific result or outcome will show that you've reached your goal?"
                    value={goalDetails[index]?.howToKnow || ''}
                    onChange={(e) => handleGoalDetailsChange(index, 'howToKnow', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`realistic-${index}`}>Is this goal realistic for you right now?</Label>
                  <Input
                    id={`realistic-${index}`}
                    placeholder="Do you have the time, resources, and ability to reach this goal?"
                    value={goalDetails[index]?.isRealistic || ''}
                    onChange={(e) => handleGoalDetailsChange(index, 'isRealistic', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`importance-${index}`}>Why is this goal important to you?</Label>
                  <Textarea
                    id={`importance-${index}`}
                    placeholder="What makes this goal meaningful and relevant to your current life or future plans?"
                    value={goalDetails[index]?.importance || ''}
                    onChange={(e) => handleGoalDetailsChange(index, 'importance', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`timeline-${index}`}>When do you want to achieve this goal?</Label>
                  <Input
                    id={`timeline-${index}`}
                    placeholder="Set a target date or time frame for achieving your goal."
                    value={goalDetails[index]?.timeline || ''}
                    onChange={(e) => handleGoalDetailsChange(index, 'timeline', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <Button
              onClick={nextStep}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              disabled={selectedGoals.length === 0}
            >
              Next: Limiting Beliefs
            </Button>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-purple-600">Limiting Belief</h2>
            <p className="text-sm italic text-gray-600">{sectionInstructions.limitingBeliefs}</p>
            <p className="text-sm italic text-gray-600">
              This section has 3 steps for you to understand your limiting belief and get rid of them to make your manifesting journey faster
            </p>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Step 1: Identify Your Fears and Doubts</h3>
              <div className="space-y-2">
                <Label htmlFor="fear">What fear is holding me back, and what thoughts cross my mind when it happens?</Label>
                <p className="text-sm text-gray-600">Example: &ldquo;I fear not being good enough, and I first noticed it during school presentations.&rdquo;</p>
                <Input
                  id="fear"
                  placeholder="I fear ____________________, and I first noticed it when ____________________."
                  value={limitingBelief.fear}
                  onChange={(e) => handleLimitingBeliefChange('fear', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="triggeringSituation">What triggers this fear, and what thoughts cross my mind when it happens?</Label>
                <p className="text-sm text-gray-600">Example: &ldquo;When I have to present, I think I&apos;ll fail or be judged.&rdquo;</p>
                <Textarea
                  id="triggeringSituation"
                  placeholder="When I ____________________, I think ____________________."
                  value={limitingBelief.triggeringSituation}
                  onChange={(e) => handleLimitingBeliefChange('triggeringSituation', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Step 1.2: Challenge Your Fears and Doubts</h3>
              <div className="space-y-2">
                <Label htmlFor="adviceToFriend">What advice would I give to a friend if they had this same fear?</Label>
                <p className="text-sm text-gray-600">Example: &ldquo;You&apos;ve done this before, and you can do it again.&rdquo;</p>
                <Textarea
                  id="adviceToFriend"
                  placeholder="If my friend felt this way, I would say ____________________."
                  value={limitingBelief.adviceToFriend}
                  onChange={(e) => handleLimitingBeliefChange('adviceToFriend', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Step 2: Take Action to Remove Fear</h3>
              <div className="space-y-2">
                <Label htmlFor="smallStep">What is one small step I can take today to confront this fear?</Label>
                <p className="text-sm text-gray-600">Example: &ldquo;I&apos;ll practice in front of a friend.&rdquo;</p>
                <Input
                  id="smallStep"
                  placeholder="Today, I will ____________________ to confront my fear."
                  value={limitingBelief.smallStep}
                  onChange={(e) => handleLimitingBeliefChange('smallStep', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Step 3: Practice Self-Love</h3>
              <div className="space-y-2">
                <Label htmlFor="newBelief">What positive affirmation can I use to replace this fear?</Label>
                <p className="text-sm text-gray-600">Example: &ldquo;I am capable and confident.&rdquo;</p>
                <Input
                  id="newBelief"
                  placeholder="I will replace my fear with the belief that ____________________."
                  value={limitingBelief.newBelief}
                  onChange={(e) => handleLimitingBeliefChange('newBelief', e.target.value)}
                />
              </div>
            </div>
            <Button
              onClick={() => {
                if (validateStep()) {
                  generateAffirmationsAndGratitude()
                  setStep(4)
                }
              }}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              Next: Affirm & Be Grateful
            </Button>
          </div>
        )
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-purple-600">Affirmations & Gratitude</h2>
            <p className="text-sm italic text-gray-600">{sectionInstructions.affirmationsGratitude}</p>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Affirmations</h3>
              {affirmations.map((affirmation, index) => (
                <p key={index} className="text-gray-600">{affirmation}</p>
              ))}
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Gratitude Statements</h3>
              {gratitudeStatements.map((statement, index) => (
                <p key={index} className="text-gray-600">{statement}</p>
              ))}
            </div>
            <Button
              onClick={() => setStep(5)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              Next: Vision Board
            </Button>
          </div>
        )
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-purple-600">Vision Board 2024</h2>
            <h3 className="text-xl font-semibold">Career Goals</h3>
            {selectedGoals.map((goal, index) => (
              <div key={index} className="space-y-4 border p-4 rounded-md">
                <h4 className="text-lg font-medium">{goal}</h4>
                <div className="space-y-2">
                  <Label htmlFor={`image-${index}`}>Upload Image:</Label>
                  <Input
                    id={`image-${index}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleVisionBoardUpload(goal, e)}
                  />
                  {visionBoard[goal] && (
                    <Image src={visionBoard[goal]} alt={goal} width={320} height={160} className="w-full h-40 object-cover rounded-md" />
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Goal Statement:</Label>
                  <p className="text-gray-600">{goalDetails[index]?.whatToAchieve}</p>
                </div>
                <div className="space-y-2">
                  <Label>Gratitude Statement:</Label>
                  <p className="text-gray-600">{gratitudeStatements[index]}</p>
                </div>
                <div className="space-y-2">
                  <Label>Affirmation Statement:</Label>
                  <p className="text-gray-600">{affirmations[index]}</p>
                </div>
              </div>
            ))}
            <Button
              onClick={() => {
                generateManifestationScript()
                setStep(6)
              }}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              Generate Manifestation Script
            </Button>
          </div>
        )
      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-purple-600">Your Career Manifestation Script</h2>
            <p className="text-sm italic text-gray-600">{sectionInstructions.manifestationScript}</p>
            <div className="p-4 bg-gray-100 rounded-md">
              <p className="text-gray-800 whitespace-pre-line">{manifestationScript}</p>
            </div>
            <Button
              onClick={() => setStep(7)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              View Overview
            </Button>
          </div>
        )
      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-purple-600">Vision Board Overview</h2>
            <p className="text-sm italic text-gray-600">{sectionInstructions.visionBoard}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedGoals.map((goal, index) => (
                <div key={index} className="space-y-4 border p-4 rounded-md">
                  <h3 className="text-xl font-semibold">{goal}</h3>
                  {visionBoard[goal] && (
                    <Image src={visionBoard[goal]} alt={goal} width={320} height={160} className="w-full h-40 object-cover rounded-md" />
                  )}
                  <div>
                    <h4 className="font-medium">Career Goal Statement</h4>
                    <p className="text-gray-600">{goalDetails[index]?.whatToAchieve}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Limiting Belief to be Addressed</h4>
                    <p className="text-gray-600">{limitingBelief.fear}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Affirmation Statement</h4>
                    <p className="text-gray-600">{affirmations[index]}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Gratitude Statement</h4>
                    <p className="text-gray-600">{gratitudeStatements[index]}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Career Goal Manifestation Script</h3>
              <p className="text-gray-600 whitespace-pre-line">{manifestationScript}</p>
            </div>
            <Button
              onClick={() => setStep(8)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              View 30 Minutes Plan
            </Button>
          </div>
        )
      case 8:
        return (
          <div className="space-y-6 bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg text-white">
            <h2 className="text-2xl font-bold">30 Minutes Plan</h2>
            <p className="text-sm italic">{sectionInstructions.thirtyMinutePlan}</p>
            <ol className="list-decimal list-inside space-y-4">
              <li className="space-y-2">
                <span className="font-semibold">Breathing - 10 minutes</span>
                <div className="flex items-center space-x-2">
                  <ExternalLink className="w-4 h-4" />
                  <a href="https://drive.google.com/file/d/1lQDV_cBdo6HP92o0eco3iSxXPRxs0LXt/view?usp=drive_web" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">
                    Wim Hoff Breathing
                  </a>
                </div>
              </li>
              <li className="space-y-2">
                <span className="font-semibold">Silence - 10 minutes</span>
                <div className="flex items-center space-x-2">
                  <ExternalLink className="w-4 h-4" />
                  <a href="https://youtu.be/IQ3SaSf--8Q?si=DUVfFFVBt2R8o-Ux" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">
                    Silence Timer
                  </a>
                </div>
              </li>
              <li className="space-y-2">
                <span className="font-semibold">Read Your 3 Career Goals</span>
              </li>
              <li className="space-y-2">
                <span className="font-semibold">Hooponopono - 2 minutes</span>
              </li>
              <li className="space-y-2">
                <span className="font-semibold">Gratitude - 2 minutes</span>
              </li>
              <li className="space-y-2">
                <span className="font-semibold">Affirmations - 2 minutes</span>
              </li>
              <li className="space-y-2">
                <span className="font-semibold">Read Your Life Script and Visualize Your Goals Vision Board - 2 minutes</span>
              </li>
            </ol>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Card className="w-[800px] mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-purple-600">Manifest Mastery</CardTitle>
        <CardDescription>Manifest your dreams with AI-powered guidance</CardDescription>
      </CardHeader>
      {step > 0 && step < totalSteps && (
        <CardContent>
          <ProgressBar currentStep={step} totalSteps={totalSteps - 1} />
        </CardContent>
      )}
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {renderStep()}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 0 && (
          <Button onClick={() => setStep(step - 1)} variant="outline">
            Previous
          </Button>
        )}
        {step < totalSteps - 1 && step > 0 && (
          <Button onClick={nextStep} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            Next
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}