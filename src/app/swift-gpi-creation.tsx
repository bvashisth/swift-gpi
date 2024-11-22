"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

const banks = [
  { name: "Deutsche Bank", logo: "/placeholder.svg?height=40&width=40", swift: "DEUTDEFF" },
  { name: "Barclays", logo: "/placeholder.svg?height=40&width=40", swift: "BARCGB22" },
  { name: "HSBC", logo: "/placeholder.svg?height=40&width=40", swift: "HSBCGB2L" },
  { name: "JP Morgan Chase", logo: "/placeholder.svg?height=40&width=40", swift: "CHASUS33" },
  { name: "UBS", logo: "/placeholder.svg?height=40&width=40", swift: "UBSWCHZH80A" },
]

export default function SwiftGpiCreationDashboard() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    senderBank: "",
    senderReference: "",
    amount: "",
    currency: "",
    receiverBIC: "",
    beneficiaryName: "",
    beneficiaryAccount: "",
    remittanceInfo: "",
  })
  const [showMessage, setShowMessage] = useState(false)
  const [fullMessage, setFullMessage] = useState("")

  const handleInputChange = (name: string, value: string) => {
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const generateUETR = () => {
    return 'UETR-' + Math.random().toString(36).substr(2, 9)
  }

  const generateFullMessage = () => {
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const messageSequence = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
    const uetr = generateUETR()

    return `
SWIFT Message Details:
----------------------
Message Type: MT 103 - Single Customer Credit Transfer
Sender: ${formData.senderBank} (${banks.find(bank => bank.name === formData.senderBank)?.swift})
Receiver: ${formData.receiverBIC}
Message Sequence: ${messageSequence}
UETR: ${uetr}
Date: ${currentDate}

Transaction Information:
------------------------
Sender's Reference: ${formData.senderReference}
Amount: ${formData.currency} ${formData.amount}
Value Date: ${currentDate}
Process Type: Semi-Automated GPI
Funds Destination: Common Account

Ordering Customer:
------------------
${formData.senderBank}
${banks.find(bank => bank.name === formData.senderBank)?.swift}

Beneficiary Customer:
---------------------
Account: ${formData.beneficiaryAccount}
Name: ${formData.beneficiaryName}

Remittance Information:
-----------------------
${formData.remittanceInfo}

Charges: SHA (Shared)

SWIFT Message Content:
----------------------
{1:F01${banks.find(bank => bank.name === formData.senderBank)?.swift}AXXX0000000000}
{2:I103${formData.receiverBIC}N}
{3:{108:${messageSequence}}
{121:${uetr}}}
{4:
:20:${formData.senderReference}
:23B:CRED
:32A:${currentDate}${formData.currency}${formData.amount}
:50K:/${formData.beneficiaryAccount}
${formData.beneficiaryName}
:59:/${formData.beneficiaryAccount}
${formData.beneficiaryName}
:70:${formData.remittanceInfo}
:71A:SHA
-}
{5:{MAC:00000000}{CHK:000000000000}}

Additional Information:
-----------------------
This SWIFT message represents a semi-automated GPI (Global Payments Innovation) transaction.
Funds will be deposited into a common account for further processing.
The message is authenticated and encrypted for secure transmission.
Please ensure all details are correct before processing the payment.
For any queries, please contact the sending institution.

Disclaimer: This message is for demonstration purposes only.
    `.trim()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fullMessageText = generateFullMessage()
    setFullMessage(fullMessageText)
    setShowMessage(true)
    
    // Simulate storing in a database
    setTimeout(() => {
      console.log("Stored in database:", { ...formData, fullMessage: fullMessageText })
      toast({
        title: "SWIFT GPI Message Created",
        description: "Your message has been successfully created and stored.",
      })
    }, 1000)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">SWIFT GPI Message Creation Dashboard</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Create SWIFT GPI Message</CardTitle>
          <CardDescription>Fill in the details to create a new SWIFT GPI message</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="senderBank">Sender Bank</Label>
              <Select onValueChange={(value) => handleInputChange("senderBank", value)} value={formData.senderBank}>
                <SelectTrigger id="senderBank">
                  <SelectValue placeholder="Select sender bank" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank.swift} value={bank.name}>
                      <div className="flex items-center space-x-2">
                        <img src={bank.logo} alt={`${bank.name} logo`} className="w-6 h-6" />
                        <span>{bank.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="senderReference">Sender Reference</Label>
              <Input
                id="senderReference"
                value={formData.senderReference}
                onChange={(e) => handleInputChange("senderReference", e.target.value)}
                placeholder="Enter sender reference"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={formData.currency}
                  onChange={(e) => handleInputChange("currency", e.target.value)}
                  placeholder="Enter currency code"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="receiverBIC">Receiver BIC</Label>
              <Input
                id="receiverBIC"
                value={formData.receiverBIC}
                onChange={(e) => handleInputChange("receiverBIC", e.target.value)}
                placeholder="Enter receiver BIC"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="beneficiaryName">Beneficiary Name</Label>
              <Input
                id="beneficiaryName"
                value={formData.beneficiaryName}
                onChange={(e) => handleInputChange("beneficiaryName", e.target.value)}
                placeholder="Enter beneficiary name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="beneficiaryAccount">Beneficiary Account</Label>
              <Input
                id="beneficiaryAccount"
                value={formData.beneficiaryAccount}
                onChange={(e) => handleInputChange("beneficiaryAccount", e.target.value)}
                placeholder="Enter beneficiary account"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remittanceInfo">Remittance Information</Label>
              <Textarea
                id="remittanceInfo"
                value={formData.remittanceInfo}
                onChange={(e) => handleInputChange("remittanceInfo", e.target.value)}
                placeholder="Enter remittance information"
              />
            </div>

            <Button type="submit" className="w-full">Create SWIFT GPI Message</Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showMessage} onOpenChange={setShowMessage}>
        <DialogContent className="max-w-[800px] w-full">
          <DialogHeader>
            <DialogTitle>SWIFT Message - Full Details</DialogTitle>
            <DialogDescription>
              This is the full SWIFT message generated from your input.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto max-h-[60vh]">
            <pre className="whitespace-pre-wrap text-sm">{fullMessage}</pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}