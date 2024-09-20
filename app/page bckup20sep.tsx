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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
//import { ProgressDemo } from "@/components/ProgressDemo"; // Correctly import ProgressDemo
//import { progress } from "@/components/progress"; // Ensure this import is correct

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
    setAffirmations(newAffirmations) // Ensure this function is called to set affirmations
    setGratitudeStatements(newGratitudeStatements) // Ensure this function is called to set gratitude statements
  }

  const generateManifestationScript = () => {
    const script = `I am doing work that I love, and I am recognized for my talents.
    My career is growing, and I am open to new opportunities and success.
    I am committed to ${selectedGoals.join(', ')}, and I feel excited knowing I am creating the career of my dreams.
    I am confident in my abilities, and I know that I am on the path to achieving my career goals.`
    setManifestationScript(script)
  }

  const validateInputs = () => {
    return limitingBelief.fear && limitingBelief.adviceToFriend && limitingBelief.smallStep && limitingBelief.newBelief;
  };

  const handleNext = () => {
    if (validateInputs()) {
      setStep(prev => prev + 1);
      setError(null);
    } else {
      setError("Please fill in all fields about your limiting beliefs.");
    }
  };

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
      case 4: // Affirmations & Gratitude
        if (affirmations.length === 0 || gratitudeStatements.length === 0) {
          setError("Please generate affirmations and gratitude statements.")
          return false
        }
        break
      case 5: // Vision Board
        if (Object.keys(visionBoard).length !== selectedGoals.length) {
          setError("Please upload an image for each selected goal.")
          return false
        }
        break
      case 6: // Manifestation Script
        if (!manifestationScript) {
          setError("Please generate your manifestation script.")
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
        console.log("Rendering Career Goals section", selectedGoals);
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-purple-600">Career Goals</h2>
            <p className="text-sm italic text-gray-600">{sectionInstructions.careerGoals}</p>
            <div className="mb-6">
              <Label htmlFor="goal-select">Select your goals (up to 3)</Label>
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
            </div>
            {selectedGoals.map((goal, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{goal}</h3>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={`what-${index}`}>
                    <AccordionTrigger>What exactly do you want to achieve?</AccordionTrigger>
                    <AccordionContent>
                      <Input
                        id={`what-${index}`}
                        placeholder="Describe your goal in clear and simple terms."
                        value={goalDetails[index]?.whatToAchieve || ''}
                        onChange={(e) => handleGoalDetailsChange(index, 'whatToAchieve', e.target.value)}
                      />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value={`how-${index}`}>
                    <AccordionTrigger>How will you know when you&apos;ve achieved it?</AccordionTrigger>
                    <AccordionContent>
                      <Input
                        id={`how-${index}`}
                        placeholder="What specific result or outcome will show that you've reached your goal?"
                        value={goalDetails[index]?.howToKnow || ''}
                        onChange={(e) => handleGoalDetailsChange(index, 'howToKnow', e.target.value)}
                      />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value={`realistic-${index}`}>
                    <AccordionTrigger>Is this goal realistic for you right now?</AccordionTrigger>
                    <AccordionContent>
                      <Input
                        id={`realistic-${index}`}
                        placeholder="Do you have the time, resources, and ability to reach this goal?"
                        value={goalDetails[index]?.isRealistic || ''}
                        onChange={(e) => handleGoalDetailsChange(index, 'isRealistic', e.target.value)}
                      />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value={`importance-${index}`}>
                    <AccordionTrigger>Why is this goal important to you?</AccordionTrigger>
                    <AccordionContent>
                      <Textarea
                        id={`importance-${index}`}
                        placeholder="What makes this goal meaningful and relevant to your current life or future plans?"
                        value={goalDetails[index]?.importance || ''}
                        onChange={(e) => handleGoalDetailsChange(index, 'importance', e.target.value)}
                      />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value={`timeline-${index}`}>
                    <AccordionTrigger>When do you want to achieve this goal?</AccordionTrigger>
                    <AccordionContent>
                      <Input
                        id={`timeline-${index}`}
                        placeholder="Set a target date or time frame for achieving your goal."
                        value={goalDetails[index]?.timeline || ''}
                        onChange={(e) => handleGoalDetailsChange(index, 'timeline', e.target.value)}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            ))}
            <Button
              onClick={() => {
                generateAffirmationsAndGratitude();
                nextStep();
              }}
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
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="fear">
                  <AccordionTrigger>What fear is holding me back?</AccordionTrigger>
                  <AccordionContent>
                    <Input
                      id="fear"
                      placeholder="I fear ____________________."
                      value={limitingBelief.fear}
                      onChange={(e) => handleLimitingBeliefChange('fear', e.target.value)}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Step 1.2: Challenge Your Fears and Doubts</h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="adviceToFriend">
                  <AccordionTrigger>What advice would I give to a friend?</AccordionTrigger>
                  <AccordionContent>
                    <Textarea
                      id="adviceToFriend"
                      placeholder="If my friend felt this way, I would say ____________________."
                      value={limitingBelief.adviceToFriend}
                      onChange={(e) => handleLimitingBeliefChange('adviceToFriend', e.target.value)}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Step 2: Take Action to Remove Fear</h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="smallStep">
                  <AccordionTrigger>What is one small step I can take today to confront this fear?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <Label htmlFor="smallStep">Small Step</Label>
                      <p className="text-sm text-gray-600">Example: &ldquo;I&apos;ll practice in front of a friend.&rdquo;</p>
                      <Input
                        id="smallStep"
                        placeholder="Today, I will ____________________ to confront my fear."
                        value={limitingBelief.smallStep}
                        onChange={(e) => handleLimitingBeliefChange('smallStep', e.target.value)}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Step 3: Practice Self-Love</h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="newBelief">
                  <AccordionTrigger>What positive affirmation can I use to replace this fear?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <Label htmlFor="newBelief">New Belief</Label>
                      <p className="text-sm text-gray-600">Example: &ldquo;I am capable and confident.&rdquo;</p>
                      <Input
                        id="newBelief"
                        placeholder="I will replace my fear with the belief that ____________________."
                        value={limitingBelief.newBelief}
                        onChange={(e) => handleLimitingBeliefChange('newBelief', e.target.value)}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <Button
              onClick={handleNext}
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
              onClick={nextStep}
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
                if (validateStep()) {
                  generateManifestationScript()
                  nextStep()
                }
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
              onClick={nextStep}
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
              onClick={nextStep}
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
                  <p>Practice: Utilize the Wim Hof Breathing technique to enhance your focus and calm your mind.</p>
                </div>
              </li>
              <li className="space-y-2">
                <span className="font-semibold">Silence - 10 minutes</span>
                <div className="flex items-center space-x-2">
                  <ExternalLink className="w-4 h-4" />
                  <p>Action: Set a silence timer for 10 minutes to allow for deep reflection and mindfulness.</p>
                </div>
              </li>
              <li className="space-y-2">
                <span className="font-semibold">Ho&apos;oponopono - 2 minutes</span>
                <p>Mantra:</p>
                <ul className="list-disc list-inside">
                  <li>&quot;I&apos;m Sorry.&quot;</li>
                  <li>&quot;Please forgive me.&quot;</li>
                  <li>&quot;Thank you.&quot;</li>
                  <li>&quot;I love you.&quot;</li>
                </ul>
              </li>
              <li className="space-y-2">
                <span className="font-semibold">Gratitude - 2 minutes</span>
                <p>{gratitudeStatements.join(', ')}</p> {/* Include gratitude statements */}
              </li>
              <li className="space-y-2">
                <span className="font-semibold">Affirmations - 2 minutes</span>
                <p>{affirmations.join(', ')}</p> {/* Include affirmations */}
              </li>
              <li className="space-y-2">
                <span className="font-semibold">Read Your Life Script - 2 minutes</span>
                <p>{manifestationScript}</p> {/* Include manifestation script */}
              </li>
              <li className="space-y-2">
                <span className="font-semibold">Visualize Your Goals - 2 minutes</span>
                <p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedGoals.map((goal, index) => visionBoard[goal] && (
                      <Image key={index} src={visionBoard[goal]} alt={goal} width={320} height={160} className="w-full h-40 object-cover rounded-md" />
                    ))}
                  </div>
                </p> {/* Include visual from vision board */}
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
          <progress className="w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500" /> {/* Updated styles for gradient and dimensions */}
          <p>Progress: Step {step + 1} of {totalSteps - 1}</p> {/* Adjusted to reflect step 1 as the first step */}
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