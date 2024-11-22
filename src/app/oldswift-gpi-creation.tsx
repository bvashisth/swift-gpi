"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

const banks = [
  { name: "Deutsche Bank", logo: "/placeholder.svg?height=40&width=40", swift: "DEUTDEFF" },
  { name: "Barclays", logo: "/placeholder.svg?height=40&width=40", swift: "BARCGB22" },
  { name: "HSBC", logo: "/placeholder.svg?height=40&width=40", swift: "HSBCGB2L" },
  { name: "JP Morgan Chase", logo: "/placeholder.svg?height=40&width=40", swift: "CHASUS33" },
  { name: "UBS", logo: "/placeholder.svg?height=40&width=40", swift: "UBSWCHZH80A" },
]

export default function SwiftGpiCreationDashboard() {
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
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

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleInputChange = (name: string, value: string) => {
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitted data:", formData)
    toast({
      title: "SWIFT GPI Message Created",
      description: "Your message has been successfully created and sent.",
    })
  }

  if (!mounted) {
    return null
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
                    <SelectItem key={bank.swift} value={bank.swift}>
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
                name="senderReference"
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
                  name="amount"
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
                  name="currency"
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
                name="receiverBIC"
                value={formData.receiverBIC}
                onChange={(e) => handleInputChange("receiverBIC", e.target.value)}
                placeholder="Enter receiver BIC"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="beneficiaryName">Beneficiary Name</Label>
              <Input
                id="beneficiaryName"
                name="beneficiaryName"
                value={formData.beneficiaryName}
                onChange={(e) => handleInputChange("beneficiaryName", e.target.value)}
                placeholder="Enter beneficiary name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="beneficiaryAccount">Beneficiary Account</Label>
              <Input
                id="beneficiaryAccount"
                name="beneficiaryAccount"
                value={formData.beneficiaryAccount}
                onChange={(e) => handleInputChange("beneficiaryAccount", e.target.value)}
                placeholder="Enter beneficiary account"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remittanceInfo">Remittance Information</Label>
              <Textarea
                id="remittanceInfo"
                name="remittanceInfo"
                value={formData.remittanceInfo}
                onChange={(e) => handleInputChange("remittanceInfo", e.target.value)}
                placeholder="Enter remittance information"
              />
            </div>

            <Button type="submit" className="w-full">Create SWIFT GPI Message</Button>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}