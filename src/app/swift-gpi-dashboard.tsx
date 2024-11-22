"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CheckCircle, XCircle } from 'lucide-react'
import { TracerValidation } from "@/components/TracerValidation"

// Mock function to validate UETR
const validateUETR = (trn: string): { isValid: boolean; uetr: string } => {
  // In a real scenario, this would make an API call to SWIFT
  const isValid = trn.length === 16 && /^[a-zA-Z0-9]+$/.test(trn)
  const uetr = isValid ? `${trn}-${Math.random().toString(36).substr(2, 9)}` : ""
  return { isValid, uetr }
}

// Mock transaction history data
const mockTransactions = [
  { id: 1, trn: "TRN123456789012", uetr: "TRN123456789012-ab3d5f", status: "Completed", amount: "$5000", date: "2023-04-15" },
  { id: 2, trn: "TRN987654321098", uetr: "TRN987654321098-xy7u2p", status: "In Progress", amount: "$3500", date: "2023-04-14" },
  { id: 3, trn: "TRN456789012345", uetr: "TRN456789012345-mn9q8r", status: "Completed", amount: "$7200", date: "2023-04-13" },
  { id: 4, trn: "TRN654321098765", uetr: "TRN654321098765-jk4l5m", status: "Failed", amount: "$2100", date: "2023-04-12" },
  { id: 5, trn: "TRN234567890123", uetr: "TRN234567890123-gh6i7j", status: "Completed", amount: "$9800", date: "2023-04-11" },
]

export default function SwiftGpiDashboard() {
  const [trn, setTrn] = useState("")
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; uetr: string } | null>(null)
  const [showTracerDialog, setShowTracerDialog] = useState(false)
  const [showTracerValidation, setShowTracerValidation] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = validateUETR(trn)
    setValidationResult(result)
    if (!result.isValid) {
      setShowTracerDialog(true)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">SWIFT GPI UETR Validation Dashboard</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Validate UETR</CardTitle>
          <CardDescription>Enter a Transaction Reference Number (TRN) to validate its UETR</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="trn">Transaction Reference Number (TRN)</Label>
              <Input
                id="trn"
                value={trn}
                onChange={(e) => setTrn(e.target.value)}
                placeholder="Enter 16-character TRN"
                className="mt-1"
              />
            </div>
            <Button type="submit">Validate</Button>
          </form>
        </CardContent>
      </Card>

      {validationResult && (
        <Card>
          <CardHeader>
            <CardTitle>Validation Result</CardTitle>
          </CardHeader>
          <CardContent>
            {validationResult.isValid ? (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span>Valid UETR: {validationResult.uetr}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <span>Invalid TRN</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Last 5 transactions processed</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>TRN</TableHead>
                <TableHead>UETR</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.trn}</TableCell>
                  <TableCell>{tx.uetr}</TableCell>
                  <TableCell>
                    <Badge
                      variant={tx.status === "Completed" ? "success" : tx.status === "In Progress" ? "warning" : "destructive"}
                    >
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{tx.amount}</TableCell>
                  <TableCell>{tx.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={showTracerDialog} onOpenChange={setShowTracerDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>TRN Validation Failed</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to perform a tracer validation to check the message status with the sender bank?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setShowTracerDialog(false)
              setShowTracerValidation(true)
            }}>
              Yes, perform tracer validation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <TracerValidation
        isOpen={showTracerValidation}
        onClose={() => setShowTracerValidation(false)}
      />
    </div>
  )
}