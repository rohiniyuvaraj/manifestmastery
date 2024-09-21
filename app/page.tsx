"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
//import VisionBoard from '@/components/VisionBoard'; // Ensure this import is correct
import { PlayCircle } from "lucide-react"

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
  
  const [visionBoardImage, setVisionBoardImage] = useState<string | null>(null); // Add this state to store the uploaded image

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
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVisionBoard(prev => ({ ...prev, [goal]: reader.result as string }));
        setVisionBoardImage(reader.result as string); // Store the uploaded image in the state
      };
      reader.readAsDataURL(file);
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
      case 1: // Career Goals
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

  const totalSteps = 7; // Total number of steps from "Career Goals" to "Vision Board Overview"

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
                  Transform your life with the ManifestMastery app! Achieve your career goals, overcome doubts, and rewire your mindset with powerful affirmations and gratitude practices.
                </p>
                <p className="text-lg text-center mb-6">
                  Our step-by-step guide in phase 1 keeps you on track to manifest your professional aspirations effortlessly. Download now and start your journey to success!
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
                    <Image src={visionBoard[goal]} alt={goal} width={1080} height={1080} className="w-full h-full object-cover rounded-md" />
                  )}
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
          <div className="min-h-screen p-4 bg-white" style={{
            border: "20px solid",
            borderImage: "linear-gradient(to right, pink, purple) 1"
          }}>
            <Card className="mx-auto max-w-4xl bg-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-center text-3xl font-bold text-pink">YOUR 30 MINUTES PLAN</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="bg-light pink/20 border border-gradient-to-r from-pink-500 to-purple-500">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Breathing - 10 Minutes</span>
                        <Button size="sm" variant="ghost">
                          <PlayCircle className="h-6 w-6" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Input className="bg-white/50" placeholder="YouTube Link: Breathing" />
                    </CardContent>
                  </Card>
                  <Card className="bg-white/20 border border-gradient-to-r from-pink-500 to-purple-500">
                    <CardHeader>
                      <CardTitle>Silence - 10 Minutes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Input className="bg-white/50" placeholder="YouTube Link: Silence" />
                    </CardContent>
                  </Card>
                </div>
                <Card className="bg-white/20 border border-gradient-to-r from-pink-500 to-purple-500">
                  <CardHeader>
                    <CardTitle className="text-center">VISION BOARD 2024</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="md:col-span-2">
                        <Card className="h-full bg-white/30 border border-gradient-to-r from-pink-500 to-purple-500">
                          <CardHeader>
                            <CardTitle>VISION BOARD</CardTitle>
                          </CardHeader>
                          <CardContent className="flex h-full items-center justify-center">
                            {visionBoardImage ? ( // Display the uploaded image
                              <Image src={visionBoardImage} alt="Vision Board" width={320} height={160} className="max-h-full w-full rounded-lg object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center rounded-lg border-2 border-dashed">
                                <p>No image uploaded yet.</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                      <div className="space-y-4">
                        <Card className="bg-white/30 border border-gradient-to-r from-pink-500 to-purple-500">
                          <CardHeader>
                            <CardTitle>GOALS</CardTitle>
                            <p className="text-gray-600">{goalDetails[0]?.whatToAchieve}</p>
                          </CardHeader>
                        </Card>
                        <Card className="bg-white/30 border border-gradient-to-r from-pink-500 to-purple-500">
                          <CardHeader>
                            <CardTitle className="text-sm">LIMITING BELIEF + HO&apos;OPONOPONO</CardTitle>
                            <p className="text-gray-600">{limitingBelief.fear}</p>
                          </CardHeader>
                          <CardContent>
                            <Textarea
                              className="bg-white/50"
                              value="I am Sorry. Please Forgive. Thank you. I Love you."
                              readOnly
                            />
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <Card className="bg-white/30 border border-gradient-to-r from-pink-500 to-purple-500">
                        <CardHeader>
                          <CardTitle>GRATITUDE</CardTitle>
                          <p className="text-gray-600">{gratitudeStatements[0]}</p>
                        </CardHeader>
                      </Card>
                      <Card className="bg-white/30 border border-gradient-to-r from-pink-500 to-purple-500">
                        <CardHeader>
                          <CardTitle>AFFIRMATION</CardTitle>
                          <p className="text-gray-600">{affirmations[0]}</p>
                        </CardHeader>
                      </Card>
                    </div>
                    <Card className="mt-4 bg-white/30 border border-gradient-to-r from-pink-500 to-purple-500">
                      <CardHeader>
                        <CardTitle>READ YOUR LIFE SCRIPT</CardTitle>
                        <p className="text-gray-800 whitespace-pre-line">{manifestationScript}</p>
                      </CardHeader>
                    </Card>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
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
      {step >= 2 && step < totalSteps && ( // Show progress bar only for steps 3 to 6
        <CardContent>
          <div className="relative w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-full rounded-full bg-pink-500" // Solid pink color
              style={{
                width: `${((step - 1) / (totalSteps - 1)) * 100}%`, // Calculate fill percentage
              }}
            />
          </div>
          <p>Progress: Step {step} of {totalSteps}</p> {/* Updated to reflect step 1 to step 7 */}
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