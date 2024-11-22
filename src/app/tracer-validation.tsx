"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle } from 'lucide-react'

interface TracerValidationProps {
  isOpen: boolean
  onClose: () => void
}

export function TracerValidation({ isOpen, onClose }: TracerValidationProps) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'connecting' | 'checking' | 'complete'>('connecting')
  const [result, setResult] = useState<'success' | 'in-process' | null>(null)

  useEffect(() => {
    if (isOpen) {
      setProgress(0)
      setStatus('connecting')
      setResult(null)
      simulateTracerValidation()
    }
  }, [isOpen])

  const simulateTracerValidation = () => {
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += 5
      setProgress(currentProgress)

      if (currentProgress === 30) {
        setStatus('checking')
      }

      if (currentProgress === 100) {
        clearInterval(interval)
        setStatus('complete')
        setResult(Math.random() < 0.75 ? 'success' : 'in-process')
      }
    }, 100)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tracer Validation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Progress value={progress} className="w-full" />
          <p className="text-center text-sm text-gray-500">
            {status === 'connecting' && 'Connecting to sender bank...'}
            {status === 'checking' && 'Checking message status...'}
            {status === 'complete' && 'Validation complete'}
          </p>
          {result && (
            <div className="flex items-center justify-center space-x-2">
              {result === 'success' ? (
                <>
                  <CheckCircle className="text-green-500" />
                  <p className="text-green-500">Message sent successfully</p>
                </>
              ) : (
                <>
                  <AlertCircle className="text-yellow-500" />
                  <p className="text-yellow-500">Message in process</p>
                </>
              )}
            </div>
          )}
          {result === 'in-process' && (
            <p className="text-center text-sm text-gray-500">
              Reason: The message is still being processed by the sender bank.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}